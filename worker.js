// worker.js
const { MongoClient } = require('mongodb');
const { spawn } = require('child_process');
const path = require('path');

// Konfiguration
const mongoUri = process.env.MONGO_URI;
const client = new MongoClient(mongoUri);

async function processJobs() {
  try {
    await client.connect();
    console.log('MongoDB verbunden');

    const db = client.db('your-database-name'); // ❗ Anpassen
    const queue = db.collection('video_queue');

    setInterval(async () => {
      const job = await queue.findOne({ status: 'pending' });

      if (job) {
        console.log('Job gefunden:', job.filename);
        await queue.updateOne({ _id: job._id }, { $set: { status: 'processing' } });

        // Beispiel: mit ffmpeg verarbeiten
        const inputPath = path.join('/mnt/data', job.filename);
        const outputPath = path.join('/mnt/data', 'processed_' + job.filename);

        const ffmpeg = spawn('ffmpeg', ['-i', inputPath, '-vcodec', 'libx264', outputPath]);

        ffmpeg.on('close', async (code) => {
          if (code === 0) {
            console.log('Verarbeitung abgeschlossen:', outputPath);

            // TODO: Hochladen zu B2 (z. B. mit SDK)
            // await uploadToB2(outputPath);

            await queue.updateOne({ _id: job._id }, {
              $set: {
                status: 'done',
                processedPath: outputPath, // oder URL nach dem Hochladen
                finishedAt: new Date()
              }
            });
          } else {
            console.error('Fehler bei Verarbeitung:', code);
            await queue.updateOne({ _id: job._id }, {
              $set: { status: 'error', errorCode: code }
            });
          }
        });
      } else {
        // Kein Job
      }
    }, 10000); // alle 10 Sekunden prüfen
  } catch (err) {
    console.error('Fehler beim Verbinden mit MongoDB:', err);
  }
}
processJobs();
