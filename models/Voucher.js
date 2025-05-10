const mongoose = require('mongoose');

// Voucher Schema (für Rabatte oder Gutscheine)
const voucherSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discount: { type: Number, required: true }, // Rabatt in Prozent
  expirationDate: { type: Date, required: true },
  usageCount: { type: Number, default: 0 },
});

module.exports = mongoose.model('Voucher', voucherSchema);
