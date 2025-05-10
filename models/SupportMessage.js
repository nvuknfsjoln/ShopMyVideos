const mongoose = require('mongoose');

// Support Message Schema
const supportMessageSchema = new mongoose.Schema({
  message: { type: String, required: true },
  email: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('SupportMessage', supportMessageSchema);
