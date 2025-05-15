require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const cron = require('node-cron');
const { processAndUploadVideo } = require('./utils/videoProcessor');
const Video = require('./models/Video');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  console.log('MongoDB verbunden');
};

const processPendingVideos = async () => {
  const pending = await Video.findOne({ status: 'pending' }).sort({ createdAt: 1 });
  if (!pending) return;

  console.log(`Verarbeite Video: ${pending.originalName}`);

  try {
    const localPath = path.join('/tmp', pending.localFilename);
    fs.writeFileSync(localPath, pending.fileBuffer, 'base64'); // Falls du Buffer im DB speicherst

    const url = await processAndUploadVideo(localPath);

    pending.status = 'done';
    pending.url = url;
    pending.processedAt = new Date();
    await pending.save();

    console.log(`Erfolgreich verarbeitet: ${url}`);
  } catch (err) {
    console.error('Fehler:', err.message);
    pending.status = 'failed';
    await pending.save();
  }
};

// alle 30 Sekunden prüfen
cron.schedule('*/30 * * * * *', processPendingVideos);

connectDB();
console.log('Background Worker läuft...');
