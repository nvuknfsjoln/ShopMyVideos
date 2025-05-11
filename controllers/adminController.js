// controllers/adminController.js
const Admin = require('../models/Admin');
const Video = require('../models/Video');
const Creator = require('../models/Creator');
const Coupon = require('../models/Coupon');

exports.getAdminByEmail = async (email) => {
  return await Admin.findOne({ email });
};

exports.listAdmins = async () => {
  return await Admin.find();
};

exports.createAdmin = async (email, password) => {
  const newAdmin = new Admin({ email, password });
  return await newAdmin.save();
};

exports.deleteAdmin = async (id) => {
  return await Admin.findByIdAndDelete(id);
};

exports.getDashboardStats = async () => {
  const videoCount = await Video.countDocuments();
  const creatorCount = await Creator.countDocuments();
  const couponCount = await Coupon.countDocuments();
  return { videoCount, creatorCount, couponCount };
};
