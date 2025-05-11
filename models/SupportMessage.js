// models/SupportMessage.js
const mongoose = require('mongoose');

const supportMessageSchema = new mongoose.Schema({
  message: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SupportMessage', supportMessageSchema);
