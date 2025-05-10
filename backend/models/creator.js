const mongoose = require('mongoose');

const creatorSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  description: { type: String },
  profileImage: { type: String },
  bannerImage: { type: String },
  isVerified: { type: Boolean, default: false },
  videos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
}, { timestamps: true });

module.exports = mongoose.model('Creator', creatorSchema);
