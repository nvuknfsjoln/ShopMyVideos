const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    discountAmount: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
    expirationDate: { type: Date, required: true }
}, { timestamps: true });

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;
