const mongoose = require('mongoose');

// Logs Schema (Für Systemlogs oder Admin-Aktionen)
const logSchema = new mongoose.Schema({
  action: { type: String, required: true },
  description: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Logs', logSchema);
