const mongoose = require('mongoose');

const creatorRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  channelDescription: {
    type: String,
    required: true,
  },
  socialLinks: [String],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  reviewedAt: Date,
  adminNote: String,
});

module.exports = mongoose.model('CreatorRequest', creatorRequestSchema);
