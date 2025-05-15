const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: String,
  description: String,
  categories: [String],
  status: { type: String, default: 'pending' },
  localFilename: String,
  originalName: String,
  url: String,
  createdAt: { type: Date, default: Date.now },
  processedAt: Date,
  fileBuffer: String // optional, falls du Base64-Videodaten in Mongo speicherst
});

module.exports = mongoose.model('Video', videoSchema);
