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
