import axios from "axios";
import ffmpegPath from "ffmpeg-static";
import ffmpeg from "fluent-ffmpeg";
import tmp from "tmp";
import fs from "fs-extra";
import mongoose from "mongoose";
import FormData from "form-data";
import http from 'http';

http.createServer((req, res) => {
  res.writeHead(200);
  res.end("Background worker läuft.");
}).listen(process.env.PORT || 3000);

ffmpeg.setFfmpegPath(ffmpegPath);

// === Schema wie in deiner Webseite ===
const videoSchema = new mongoose.Schema({
  title: String,
  description: String,
  categories: [String],
  originalFilename: String,
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  embedUrl: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Video = mongoose.model("Video", videoSchema);

// === Pixeldrain Upload ===
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

// === Videopfad holen und verarbeiten ===
async function processVideo(videoDoc) {
  console.log("🔧 Verarbeite Video:", videoDoc._id);

  const inputTmp = tmp.tmpNameSync({ postfix: ".mp4" });
  const outputTmp = tmp.tmpNameSync({ postfix: ".mp4" });

  try {
    // 1. Lade Originalvideo von Backblaze herunter
    const downloadUrl = `${process.env.B2_DOWNLOAD_URL}/file/${process.env.B2_BUCKET_NAME}/${videoDoc.originalFilename}`;
    const response = await axios.get(downloadUrl, { responseType: "stream" });

    const writer = fs.createWriteStream(inputTmp);
    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });

    // 2. ffmpeg: Metadaten strippen und komprimieren
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

    // 3. Zu Pixeldrain hochladen
    const pixeldrainUrl = await uploadToPixeldrain(outputTmp);

    // 4. MongoDB-Dokument aktualisieren
    videoDoc.status = "completed";
    videoDoc.embedUrl = pixeldrainUrl;
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

// === Worker holt einen neuen Job ===
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
