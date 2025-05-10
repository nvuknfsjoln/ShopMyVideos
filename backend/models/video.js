const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'Creator', required: true },
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  videoUrl: { type: String, required: true },
  thumbnailUrl: { type: String },
  tags: [String],
  isActive: { type: Boolean, default: true },
  purchasedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

module.exports = mongoose.model('Video', videoSchema);
