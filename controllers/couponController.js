// controllers/couponController.js
const Coupon = require('../models/Coupon');

exports.listAllCoupons = async () => {
  return await Coupon.find().populate('creator');
};

exports.getCreatorCoupons = async (creatorId) => {
  return await Coupon.find({ creator: creatorId });
};

exports.createCoupon = async (data) => {
  const coupon = new Coupon(data);
  return await coupon.save();
};

exports.deleteCoupon = async (id) => {
  return await Coupon.findByIdAndDelete(id);
};

exports.getCouponByCode = async (code) => {
  return await Coupon.findOne({ code });
};

exports.createCoupon = async (req, res) => {
    const { code, discountAmount, expirationDate } = req.body;

    const newCoupon = new Coupon({ code, discountAmount, expirationDate });

    try {
        await newCoupon.save();
        res.status(201).json({ message: 'Coupon created successfully', coupon: newCoupon });
    } catch (error) {
        res.status(500).json({ message: 'Error creating coupon', error });
    }
};

exports.getCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find();
        res.json(coupons);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving coupons', error });
    }
};
