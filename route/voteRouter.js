const express = require('express');
const twilio = require('twilio');
const debug = require('debug')('rv:vote-router');
const httpError = require('http-errors');

const Poll = require('../model/poll');
const User = require('../model/user');

const voteRouter = new express.Router();

voteRouter.get('/sms_callback', (req, res, next) => {
  Poll.findOne({ pollStatus: 'in_progress' })
  .then((poll) => {
    if (!poll) {
      return next(httpError(404, 'no poll currently in progress'));
    }

    const activePollId = poll._id;

    if (!poll.choices.some((choice) => choice.toLowerCase() === req.query.Body.toLowerCase())) {
      return next(httpError(400, 'no such choice'));
    }

    const userNumber = req.query.From;

    User.findOne({
      phoneNumber: userNumber,
      pollId: activePollId,
    })
    .then((user) => {
      if (!user) {
        user = new User();
        user.phoneNumber = userNumber;
        user.pollId = activePollId;
        user.vote = [];
      }

      // if user already exists
      if (user.vote.length >= poll.votesPerUser) {
        return next(httpError(400, 'no more votes allowed'));
      }

      debug(`Creating new vote from ${req.query.From} of ${req.query.Body}`);

      user.vote.push(req.query.Body.toLowerCase());
      user.save()
      .then(() => {
        const response = new twilio.TwimlResponse();

        res
        .status(200)
        .set('Content-Type', 'application/xml')
        .end(response.toString());
        next();
      })
      .catch(err => next(err));
    })
    .catch(err => next(err));
  })
  .catch(err => next(err));
});

voteRouter.get('/tally', (req, res, next) => {
  debug('Tallying results');
  Poll.findOne({ pollStatus: 'in_progress' })
    .then((poll) => User.find({ pollId: poll._id }))
    .then((users) => {
      const results = users
        .map((user) => user.vote) // Get just the votes
        .reduce((a, b) => a.concat(b)) // Flatten the array
        // Return a object with the individual vote counts
        .reduce((acc, curr) => {
          if (typeof acc[curr] === 'undefined') {
            acc[curr] = 1;
          } else {
            acc[curr] += 1;
          }
          return acc;
        }, {});

      res.json(results);
    })
    .catch((err) => next(err));
});

module.exports = voteRouter;
