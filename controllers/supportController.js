// controllers/supportController.js
const SupportMessage = require('../models/SupportMessage');

exports.getAllMessages = async () => {
  return await SupportMessage.find().populate('creator');
};

exports.getMessagesByCreator = async (creatorId) => {
  return await SupportMessage.find({ creator: creatorId });
};

exports.createMessage = async (data) => {
  const Message = new SupportMessage(data);
  return await Message.save();
};

exports.respondToMessage = async (id, responseText) => {
  return await SupportMessage.findByIdAndUpdate(id, { response: responseText, status: 'answered' });
};
