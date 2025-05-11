const mongoose = require('mongoose');

const voucherSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discount: { type: Number, required: true },
  valid: { type: Boolean, default: true },
  isCreatorVoucher: { type: Boolean, default: false },
  creatorName: { type: String }, // Nur bei Creator-Gutscheinen
  requested: { type: Boolean, default: false } // Für Beantragungsstatus
});

module.exports = mongoose.model('Voucher', voucherSchema);
