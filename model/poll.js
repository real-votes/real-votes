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
    default: 'not_started',
  },
  choices: [{
    type: String,
    required: true,
  }],
  votes: [voteSchema],
});

PollSchema.methods.updateChoices = function(choices) {
  this.choices = choices;
  return this.save();
};

module.exports = mongoose.model('Poll', PollSchema);
