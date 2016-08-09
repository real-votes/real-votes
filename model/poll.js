const mongoose = require('mongoose');

const User = require('./user');

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
  votesPerUser: {
    type: Number,
    required: true,
    default: 1,
  },
});

PollSchema.methods.removePoll = function() {
  const self = this;
  return User.find({ pollId: this._id }).remove()
  .then(() => {
    self.remove();
  })
  .catch(err => {
    throw err;
  });
};

module.exports = mongoose.model('Poll', PollSchema);
