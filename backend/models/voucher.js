const mongoose = require('mongoose');

const voucherSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discountPercent: { type: Number, required: true },
  expiresAt: { type: Date },
  usedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

module.exports = mongoose.model('Voucher', voucherSchema);
