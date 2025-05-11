const mongoose = require('mongoose');

const voucherSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discount: { type: Number, required: true }, // Rabatt in Prozent
  expirationDate: { type: Date, required: true },
  usageCount: { type: Number, default: 0 },
  status: { type: String, enum: ['requested', 'approved', 'rejected'], default: 'requested' },
  creatorName: { type: String, required: true }, // Wer hat angefragt
  approvedBy: { type: String }, // Admin-Name (optional)
}, { timestamps: true });

module.exports = mongoose.model('Voucher', voucherSchema);
