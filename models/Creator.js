const mongoose = require('mongoose');

const creatorSchema = new mongoose.Schema({
  creatorName: { type: String, required: true, unique: true },
  creatorPassword: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  allowAdminVouchers: { type: Boolean, default: true } // Steuerung durch Creator
});

module.exports = mongoose.model('Creator', creatorSchema);
