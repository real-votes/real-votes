'use strict';
const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  vote: {
    type: String,
    required: true,
  },
});

module.exports = voteSchema;
