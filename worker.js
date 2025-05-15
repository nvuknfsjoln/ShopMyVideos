import axios from "axios";
import ffmpegPath from "ffmpeg-static";
import ffmpeg from "fluent-ffmpeg";
import tmp from "tmp";
import fs from "fs-extra";
import B2 from "backblaze-b2";
import mongoose from "mongoose";
import FormData from "form-data";

ffmpeg.setFfmpegPath(ffmpegPath);

// MongoDB Video Model
const videoSchema = new mongoose.Schema({
  _id: String,
  sourcePath: String, // Pfad in Backblaze B2
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

// Datei von Backblaze B2 herunterladen
async function downloadFromB2(b2Path, targetPath) {
  const b2 = new B2({
    applicationKeyId: process.env.B2_KEY_ID,
    applicationKey: process.env.B2_APPLICATION_KEY
  });

  await b2.authorize();

  const downloadUrl = await b2.getDownloadAuthorization({
    bucketId: process.env.B2_BUCKET_ID,
    fileNamePrefix: b2Path,
    validDurationInSeconds: 3600
  });

  const url = `${process.env.B2_DOWNLOAD_URL}/file/${process.env.B2_BUCKET_NAME}/${b2Path}`;

  const response = await axios.get(url, {
    responseType: "stream",
    headers: {
      Authorization: downloadUrl.authorizationToken || ""  // falls benötigt
    }
  });

  const writer = fs.createWriteStream(targetPath);
  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}

// Video verarbeiten (Metadaten entfernen, komprimieren)
async function processVideo(videoDoc) {
  console.log("🔧 Verarbeite Video:", videoDoc._id);

  const inputTmp = tmp.tmpNameSync({ postfix: ".mp4" });
  const outputTmp = tmp.tmpNameSync({ postfix: ".mp4" });

  try {
    // Datei von B2 herunterladen
    await downloadFromB2(videoDoc.sourcePath, inputTmp);

    // ffmpeg verarbeiten (Metadaten entfernen, codec & crf einstellen)
    await new Promise((resolve, reject) => {
      ffmpeg(inputTmp)
        .outputOptions("-map_metadata -1") // Metadaten entfernen
        .videoCodec("libx264")
        .audioCodec("aac")
        .outputOptions("-crf 28")
        .on("end", resolve)
        .on("error", reject)
        .save(outputTmp);
    });

    // Zu Pixeldrain hochladen
    const pixeldrainUrl = await uploadToPixeldrain(outputTmp);

    // MongoDB Update
    videoDoc.status = "completed";
    videoDoc.pixeldrainUrl = pixeldrainUrl;
    await videoDoc.save();

    console.log("✅ Upload abgeschlossen:", pixeldrainUrl);
  } catch (err) {
    console.error("❌ Fehler:", err);
    videoDoc.status = "failed";
    await videoDoc.save();
  } finally {
    // Temporäre Dateien löschen
    fs.removeSync(inputTmp);
    fs.removeSync(outputTmp);
  }
}

// Worker: 1 Job aus der Queue holen und verarbeiten
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
