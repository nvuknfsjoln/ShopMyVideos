const mongoose = require('mongoose');

// Admin Schema
const adminSchema = new mongoose.Schema({
  adminName: { type: String, required: true, unique: true },
  adminPassword: { type: String, required: true },
  joinDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Admin', adminSchema);
