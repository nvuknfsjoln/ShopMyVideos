import axios from "axios";
import ffmpegPath from "ffmpeg-static";
import ffmpeg from "fluent-ffmpeg";
import tmp from "tmp";
import fs from "fs-extra";
import B2 from "backblaze-b2";
import mongoose from "mongoose";
import FormData from "form-data";
import http from "http";
import dotenv from "dotenv";

dotenv.config();

http.createServer((req, res) => {
  res.writeHead(200);
  res.end("Background worker läuft.");
}).listen(process.env.PORT || 3000);

ffmpeg.setFfmpegPath(ffmpegPath);

// MongoDB Video Model (Schema passt zum Web-Modell)
const videoSchema = new mongoose.Schema({
  title: String,
  description: String,
  categories: [String],
  originalFilename: String,
  status: String,
  sourcePath: String,
  embedUrl: String,
  createdAt: Date
}, { strict: false });

const Video = mongoose.model("Video", videoSchema);

// Pixeldrain Upload
async function uploadToPixeldrain(filePath) {
  const data = new FormData();
  data.append("file", fs.createReadStream(filePath));

  const res = await axios.post("https://pixeldrain.com/api/file", data, {
    headers: {
      ...data.getHeaders(),
      Authorization: `Bearer ${process.env.PIXELDRAIN_API_KEY}`
    }
  });

  if (!res.data?.id) throw new Error("Pixeldrain Upload fehlgeschlagen");

  // Versteckt + embedding aktivieren
  await axios.post(`https://pixeldrain.com/api/file/${res.data.id}`, {
    hidden: true,
    allow_embed: true
  }, {
    headers: { Authorization: `Bearer ${process.env.PIXELDRAIN_API_KEY}` }
  });

  return `https://pixeldrain.com/u/${res.data.id}`;
}

// Backblaze B2: Download
async function downloadFromB2(b2Path, targetPath) {
  const b2 = new B2({
    applicationKeyId: process.env.B2_KEY_ID,
    applicationKey: process.env.B2_APPLICATION_KEY
  });

  await b2.authorize();

  const url = `${process.env.B2_DOWNLOAD_URL}/file/${process.env.B2_BUCKET_NAME}/${b2Path}`;

  const response = await axios.get(url, {
    responseType: "stream"
  });

  const writer = fs.createWriteStream(targetPath);
  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}

// Verarbeitung
async function processVideo(videoDoc) {
  console.log("🔧 Verarbeite Video:", videoDoc._id);

  const inputTmp = tmp.tmpNameSync({ postfix: ".mp4" });
  const outputTmp = tmp.tmpNameSync({ postfix: ".mp4" });

  try {
    await downloadFromB2(videoDoc.sourcePath, inputTmp);

    await new Promise((resolve, reject) => {
      ffmpeg(inputTmp)
        .outputOptions("-map_metadata -1")
        .videoCodec("libx264")
        .audioCodec("aac")
        .outputOptions("-crf 28")
        .on("end", resolve)
        .on("error", reject)
        .save(outputTmp);
    });

    const embedUrl = await uploadToPixeldrain(outputTmp);

    videoDoc.status = "completed";
    videoDoc.embedUrl = embedUrl;
    await videoDoc.save();

    console.log("✅ Upload abgeschlossen:", embedUrl);
  } catch (err) {
    console.error("❌ Fehler:", err);
    videoDoc.status = "failed";
    await videoDoc.save();
  } finally {
    fs.removeSync(inputTmp);
    fs.removeSync(outputTmp);
  }
}

// Worker
export default async function runWorker() {
  const job = await Video.findOneAndUpdate(
    { status: "pending" },
    { status: "processing" },
    { new: true }
  );

  if (!job) {
    console.log("📭 Keine Jobs in der Warteschlange.");
    return;
  }

  await processVideo(job);
}
