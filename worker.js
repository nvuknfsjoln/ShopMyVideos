// worker.js

import axios from "axios";
import ffmpegPath from "ffmpeg-static";
import ffmpeg from "fluent-ffmpeg";
import tmp from "tmp";
import fs from "fs-extra";
import mongoose from "mongoose";
import FormData from "form-data";
import http from "http";
import dotenv from "dotenv";

dotenv.config();

http.createServer((req, res) => {
  res.writeHead(200);
  res.end("🎥 Background Worker läuft.");
}).listen(process.env.PORT || 3000);

// === MongoDB verbinden ===
const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.error("❌ MONGODB_URI ist nicht gesetzt.");
  process.exit(1);
}
await mongoose.connect(mongoUri);
console.log("✅ Mit MongoDB verbunden");

// === FFmpeg konfigurieren ===
ffmpeg.setFfmpegPath(ffmpegPath);

// === Video-Modell ===
const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  categories: [String],
  originalFilename: String,
  status: {
    type: String,
    enum: ['pending', 'processing', 'done', 'failed'],
    default: 'pending'
  },
  url: String,
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

  const uploadRes = await axios.post("https://pixeldrain.com/api/file", data, {
    headers: {
      ...data.getHeaders(),
      Authorization: `Bearer ${process.env.PIXELDRAIN_API_KEY}`
    }
  });

  if (!uploadRes.data?.id) throw new Error("❌ Pixeldrain Upload fehlgeschlagen");

  await axios.post(
    `https://pixeldrain.com/api/file/${uploadRes.data.id}`,
    { hidden: true, allow_embed: true },
    { headers: { Authorization: `Bearer ${process.env.PIXELDRAIN_API_KEY}` } }
  );

  return `https://pixeldrain.com/u/${uploadRes.data.id}`;
}

// === Video verarbeiten ===
async function processVideo(videoDoc) {
  console.log("🔧 Verarbeite Video:", videoDoc._id);

  const inputTmp = tmp.tmpNameSync({ postfix: ".mp4" });
  const outputTmp = tmp.tmpNameSync({ postfix: ".mp4" });

  try {
    const downloadUrl = `${process.env.B2_DOWNLOAD_URL}/file/${process.env.B2_BUCKET_NAME}/${videoDoc.originalFilename}`;
    const response = await axios.get(downloadUrl, { responseType: "stream" });

    const inputStream = fs.createWriteStream(inputTmp);
    response.data.pipe(inputStream);

    await new Promise((resolve, reject) => {
      inputStream.on("finish", resolve);
      inputStream.on("error", reject);
    });

    await new Promise((resolve, reject) => {
      ffmpeg(inputTmp)
        .outputOptions([
          "-map_metadata", "-1",
          "-vf", "scale=-2:1080",
          "-c:v", "libx264",
          "-preset", "slow",
          "-crf", "23",
          "-c:a", "aac"
        ])
        .on("end", resolve)
        .on("error", reject)
        .save(outputTmp);
    });

    const pixeldrainUrl = await uploadToPixeldrain(outputTmp);

    videoDoc.status = "done";
    videoDoc.url = pixeldrainUrl;
    await videoDoc.save();

    console.log("✅ Fertig verarbeitet:", pixeldrainUrl);
  } catch (err) {
    console.error("❌ Fehler bei der Verarbeitung:", err);
    videoDoc.status = "failed";
    await videoDoc.save();
  } finally {
    fs.removeSync(inputTmp);
    fs.removeSync(outputTmp);
  }
}

// === Worker-Loop ===
async function runWorkerLoop() {
  console.log("🔁 Starte Video-Worker-Loop...");

  while (true) {
    try {
      const job = await Video.findOneAndUpdate(
        { status: "pending" },
        { status: "processing" },
        { new: true }
      );

      if (!job) {
        console.log("⏳ Keine offenen Videos. Warte 30 Sekunden...");
        await new Promise(resolve => setTimeout(resolve, 30_000));
        continue;
      }

      await processVideo(job);
    } catch (err) {
      console.error("❌ Worker-Fehler:", err);
    }
  }
}

runWorkerLoop();
