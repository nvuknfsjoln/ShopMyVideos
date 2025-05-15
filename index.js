require('dotenv').config();
const { MongoClient } = require('mongodb');
const path = require('path');
const { processVideo } = require('./worker');

const mongoUri = process.env.MONGODB_URI;
const client = new MongoClient(mongoUri);
const POLL_INTERVAL = 15000; // alle 15 Sekunden

async function poll() {
  try {
    await client.connect();
    const db = client.db();
    const queue = db.collection('video_jobs');

    console.log('✅ MongoDB verbunden, warte auf Jobs...');

    setInterval(async () => {
      const job = await queue.findOneAndUpdate(
        { status: 'pending' },
        { $set: { status: 'processing', startedAt: new Date() } }
      );

      if (job.value) {
        console.log(`🔄 Starte Verarbeitung für: ${job.value._id}`);
        try {
          await processVideo(job.value);
          await queue.updateOne(
            { _id: job.value._id },
            { $set: { status: 'done', finishedAt: new Date() } }
          );
        } catch (err) {
          console.error('❌ Fehler bei Verarbeitung:', err.message);
          await queue.updateOne(
            { _id: job.value._id },
            { $set: { status: 'error', error: err.message } }
          );
        }
      }
    }, POLL_INTERVAL);
  } catch (e) {
    console.error('❌ MongoDB-Fehler:', e);
    process.exit(1);
  }
}

poll();
