'use strict';

const express = require('express');
const httpError = require('http-errors');

const User = require('../model/user');
const auth = require('../lib/auth');
const findPoll = require('../lib/findPoll');

const pollVoteRouter = module.exports = new express.Router({ mergeParams: true });

pollVoteRouter.get('/', auth, findPoll(), (req, res, next) => {
  const poll = req.poll._id;
  if (!poll) {
    return next(httpError(404, 'no poll id specified'));
  }
  User.find({ pollId: poll })
  .then((users) => {
    if (users.length < 1) {
      return next(httpError(404, 'no users found'));
    }
    res.json(users);
  })
  .catch(err => next(err));
});

// reset poll route
pollVoteRouter.delete('/', auth, findPoll(), (req, res, next) => {
  const poll = req.poll._id;
  if (!poll) {
    return next(httpError(404, 'no poll id specified'));
  }
  User.remove({ pollId: poll })
  .then((result) => {
    console.log(result);
    res.json({ message: `deleted ${result.result.n} user(s) associated with the poll.` });
  })
  .catch(err => next(err));
});
