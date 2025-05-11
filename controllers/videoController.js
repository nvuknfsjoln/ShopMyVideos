// controllers/videoController.js
const Video = require('../models/Video');

exports.listAllVideos = async () => {
  return await Video.find().populate('creator');
};

exports.getVideoById = async (id) => {
  return await Video.findById(id).populate('creator');
};

exports.getVideosByCreator = async (creatorId) => {
  return await Video.find({ creator: creatorId });
};

exports.deleteVideo = async (id) => {
  return await Video.findByIdAndDelete(id);
};
