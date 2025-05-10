const mongoose = require('mongoose');

// Video Upload Queue Schema (für Videos, die noch verarbeitet werden müssen)
const videoUploadQueueSchema = new mongoose.Schema({
  videoPath: { type: String, required: true },
  status: { type: String, default: 'pending' }, // z.B. 'pending', 'processing', 'completed'
  createdAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
});

module.exports = mongoose.model('VideoUploadQueue', videoUploadQueueSchema);
