import axios from "axios";
import ffmpegPath from "ffmpeg-static";
import ffmpeg from "fluent-ffmpeg";
import tmp from "tmp";
import fs from "fs-extra";
import B2 from 'backblaze-b2';
import mongoose from "mongoose";

ffmpeg.setFfmpegPath(ffmpegPath);

// MongoDB Video Model
const videoSchema = new mongoose.Schema({
  _id: String,
  sourcePath: String, // B2-Pfad
  status: String,
  pixeldrainUrl: String
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

  const fileId = res.data?.id;
  if (!fileId) throw new Error("Pixeldrain Upload fehlgeschlagen");

  // Set hidden + embeddable
  await axios.post(`https://pixeldrain.com/api/file/${fileId}`, {
    hidden: true,
    allow_embed: true
  }, {
    headers: {
      Authorization: `Bearer ${process.env.PIXELDRAIN_API_KEY}`
    }
  });

  return `https://pixeldrain.com/u/${fileId}`;
}

// Lade Datei von Backblaze B2
async function downloadFromB2(b2Path, targetPath) {
  const b2 = new B2({
    applicationKeyId: process.env.B2_KEY_ID,
    applicationKey: process.env.B2_APPLICATION_KEY
  });

  await b2.authorize();
  const { data: { authorizationToken, downloadUrl } } = b2;

  const url = `${downloadUrl}/file/${process.env.B2_BUCKET_NAME}/${b2Path}`;
  const response = await axios.get(url, {
    responseType: "stream",
    headers: {
      Authorization: authorizationToken
    }
  });

  const writer = fs.createWriteStream(targetPath);
  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}

// Verarbeite ein Video
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

    const pixeldrainUrl = await uploadToPixeldrain(outputTmp);
    videoDoc.status = "completed";
    videoDoc.pixeldrainUrl = pixeldrainUrl;
    await videoDoc.save();

    console.log("✅ Upload abgeschlossen:", pixeldrainUrl);
  } catch (err) {
    console.error("❌ Fehler:", err);
    videoDoc.status = "failed";
    await videoDoc.save();
  } finally {
    fs.removeSync(inputTmp);
    fs.removeSync(outputTmp);
  }
}

export default async function runWorker() {
  const job = await Video.findOneAndUpdate(
    { status: "pending" },
    { status: "processing" }
  );

  if (!job) {
    console.log("📭 Keine Jobs in der Warteschlange.");
    return;
  }

  await processVideo(job);
}
