const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const Video = require('../models/Video');
const { uploadToPixeldrain } = require('../utils/pixeldrain');

// Video bearbeiten (Metadaten entfernen, komprimieren)
exports.processVideo = async (req, res) => {
  const { videoPath } = req.body; // Datei wird per Request geschickt
  try {
    const processedVideoPath = await removeMetadata(videoPath);
    const compressedVideoPath = await compressVideo(processedVideoPath);

    // Uploaden zu Pixeldrain
    const videoUrl = await uploadToPixeldrain(compressedVideoPath);

    // Video im Shop anlegen
    const newVideo = new Video({
      title: req.body.title,
      price: req.body.price,
      videoUrl,
      creatorName: req.body.creatorName,
      categories: req.body.categories
    });
    await newVideo.save();

    res.status(200).json({ message: 'Video erfolgreich verarbeitet und hochgeladen' });
  } catch (error) {
    res.status(500).json({ message: 'Fehler bei der Videoverarbeitung' });
  }
};

// Metadaten entfernen
const removeMetadata = (videoPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .outputOptions('-map_metadata -1')
      .save(path.join(__dirname, '../temp', 'cleaned_video.mp4'))
      .on('end', () => resolve(path.join(__dirname, '../temp', 'cleaned_video.mp4')))
      .on('error', reject);
  });
};

// Video komprimieren
const compressVideo = (videoPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .outputOptions('-
