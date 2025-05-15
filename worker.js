const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const { MongoClient, ObjectId } = require('mongodb');

ffmpeg.setFfmpegPath(ffmpegPath);

const TMP_DIR = '/tmp';

async function removeMetadataAndCompress(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .outputOptions('-map_metadata', '-1') // entfernt Metadaten
      .videoCodec('libx264')
      .audioCodec('aac')
      .outputOptions(['-crf 28', '-preset veryfast']) // Kompression
      .save(outputPath)
      .on('end', () => resolve())
      .on('error', reject);
  });
}

async function uploadToPixeldrain(filePath) {
  const form = new FormData();
  form.append('file', fs.createReadStream(filePath));
  const headers = form.getHeaders();
  headers['Authorization'] = `Bearer ${process.env.PIXELDRAIN_API_KEY}`;

  const uploadRes = await axios.post('https://pixeldrain.com/api/file', form, { headers });
  const fileId = uploadRes.data.id;

  // Einstellungen setzen: versteckt + eingebettet
  await axios.post(`https://pixeldrain.com/api/file/${fileId}/edit`, {
    hidden: true,
    allow_embed: true
  }, {
    headers: {
      Authorization: `Bearer ${process.env.PIXELDRAIN_API_KEY}`
    }
  });

  return `https://pixeldrain.com/u/${fileId}`;
}

async function processVideo(job) {
  const inputPath = path.join(TMP_DIR, job.local_path); // z. B. "abc123.mp4"
  const outputPath = path.join(TMP_DIR, `compressed-${job.local_path}`);

  console.log('🎥 Verarbeite Datei:', inputPath);

  await removeMetadataAndCompress(inputPath, outputPath);
  console.log('✅ Metadaten entfernt & Video komprimiert');

  const finalUrl = await uploadToPixeldrain(outputPath);
  console.log('📤 Hochgeladen zu Pixeldrain:', finalUrl);

  // MongoDB aktualisieren
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db();
  const jobs = db.collection('video_jobs');

  await jobs.updateOne(
    { _id: new ObjectId(job._id) },
    {
      $set: {
        final_url: finalUrl,
        hidden: true,
        embedded: true
      }
    }
  );

  await client.close();

  // Cleanup
  fs.unlinkSync(inputPath);
  fs.unlinkSync(outputPath);
  console.log('🧹 Temporäre Dateien gelöscht');
}

module.exports = { processVideo };
