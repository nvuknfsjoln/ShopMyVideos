// controllers/supportController.js
const SupportTicket = require('../models/SupportTicket');

exports.getAllTickets = async () => {
  return await SupportTicket.find().populate('creator');
};

exports.getTicketsByCreator = async (creatorId) => {
  return await SupportTicket.find({ creator: creatorId });
};

exports.createTicket = async (data) => {
  const ticket = new SupportTicket(data);
  return await ticket.save();
};

exports.respondToTicket = async (id, responseText) => {
  return await SupportTicket.findByIdAndUpdate(id, { response: responseText, status: 'answered' });
};
