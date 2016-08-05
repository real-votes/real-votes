'use strict';

const mongoose = require('mongoose');

const voteSchema = require('./vote');

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
  votes: [voteSchema],
});

module.exports = mongoose.model('Poll', PollSchema);
