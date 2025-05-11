// models/Creator.js
const mongoose = require('mongoose');

const creatorSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  email: String,
  approved: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  appliedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Creator', creatorSchema);
