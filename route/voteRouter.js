'use strict';

const jsonParser = require('body-parser').json();
const express = require('express');

const Poll = require('../model/poll');

const pollRouter = require('./pollRouter');

const voteRouter = module.exports = express.Router({ mergeParams: true }); // eslint-disable-line

voteRouter.get('/', (req, res, next) => {
  Poll.findOne({}, null, { sort: { createdAt: 'desc' } })
  .then((currentPoll) => {
    // TODO: check if poll is in progress
    if (!currentPoll) {
      return next(new Error('no poll'));
    }
  })
  .catch(err => next(err));
  // newPoll.save((err, poll) => {
  //   if (err) return next(err);
  //   return res.json(poll);
  // });
});
