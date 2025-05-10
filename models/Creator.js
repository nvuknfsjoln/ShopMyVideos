const mongoose = require('mongoose');

// Creator Schema
const creatorSchema = new mongoose.Schema({
  creatorName: { type: String, required: true, unique: true },
  creatorPassword: { type: String, required: true },
  email: { type: String, required: true },
  joinDate: { type: Date, default: Date.now },
  videos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
});

module.exports = mongoose.model('Creator', creatorSchema);
