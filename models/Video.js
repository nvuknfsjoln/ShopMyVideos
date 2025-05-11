// models/Video.js
const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: String,
  price: Number,
  categories: [String],
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'Creator', default: null },
  url: String,
  thumbnail: String,
  isOnline: { type: Boolean, default: true },
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  processed: { type: Boolean, default: false }
});

module.exports = mongoose.model('Video', videoSchema);
