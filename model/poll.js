'use strict';

const mongoose = require('mongoose');

const PollSchema = new mongoose.Schema({
  pollName: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  pollStatus: {
    type: String,
    required: true,
    enum: ['not_started', 'in_progress', 'completed'],
  },
  choices: [{
    type: String,
    required: true,
  }],
  votes: [{
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    vote: {
      type: String,
      required: true,
    },
  }],
});

module.exports = exports = mongoose.model('Poll', PollSchema);
