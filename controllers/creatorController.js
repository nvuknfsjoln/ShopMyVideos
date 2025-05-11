// controllers/creatorController.js
const Creator = require('../models/Creator');

exports.getCreatorByEmail = async (email) => {
  return await Creator.findOne({ email });
};

exports.getCreatorById = async (id) => {
  return await Creator.findById(id);
};

exports.listCreators = async () => {
  return await Creator.find();
};

exports.createCreator = async (data) => {
  const creator = new Creator(data);
  return await creator.save();
};

exports.deleteCreator = async (id) => {
  return await Creator.findByIdAndDelete(id);
};
