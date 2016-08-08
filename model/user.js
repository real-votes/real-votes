const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  pollId: { type: mongoose.Schema.ObjectId },
  vote: [String],
});

module.exports = mongoose.model('User', userSchema);
