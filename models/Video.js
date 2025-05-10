const mongoose = require('mongoose');

// Video Schema
const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  creatorName: { type: String, required: true },
  price: { type: Number, required: true },
  views: { type: Number, default: 0 },
  videoUrl: { type: String, required: true },
  categories: [{ type: String }],
  length: { type: Number, required: true }, // Dauer in Sekunden
  uploadDate: { type: Date, default: Date.now },
});

// Index für die Textsuche nach Videos
videoSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Video', videoSchema);
