// models/AdminLogs.js
const mongoose = require('mongoose');

const adminLogSchema = new mongoose.Schema({
  adminName: String,
  action: String,
  section: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AdminLogs', adminLogSchema);
