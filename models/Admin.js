// models/Admin.js
const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  permissions: [String], // z.B. ['dashboard', 'videos', 'support']
  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('Admin', adminSchema);
