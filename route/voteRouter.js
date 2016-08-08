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

    const activePoll = poll._id;

    poll.choices.forEach((choice) => {
      if (!req.query.Body.match(new RegExp(choice, 'gi')).length) {
        return next(httpError(400, 'no such poll choice'));
      }
    });

    const userNumber = req.query.From;

    User.findOne({
      phoneNumber: userNumber,
      pollId: activePoll,
    })
    .then((user) => {
      if (!user) {
        let newUser = new User();
        newUser.phoneNumber = userNumber;
        newUser.pollId = activePoll;
        newUser.vote = [];
        newUser.vote.push(req.query.Body);
        newUser.save()
        .then(savedUser => res.json(savedUser))
        .catch(err => next(err));
      }

      if (user.vote.length >= poll.votesPerUser) {
        return next(httpError(400, 'no more votes allowed'));
      }

      user.vote.push(req.query.Body).save()
      .then(saved => res.json(saved))
      .catch(err => next(err));
    })
    .catch(err => next(err));
  })
  .catch(err => next(err));
  // Poll.findOneAndUpdate({ pollStatus: 'in_progress' },
  //   {
  //     $push: {
  //       votes: {
  //         phoneNumber: req.query.From,
  //         vote: req.query.Body,
  //       },
  //     },
  //   },
  //   { new: true }
  // )
  // .then(() => {
  //   debug(`Creating new vote from ${req.query.From} of ${req.query.Body}`);
  //   const response = new twilio.TwimlResponse();
  //
  //   res
  //   .status(200)
  //   .set('Content-Type', 'application/xml')
  //   .end(response.toString());
  //
  //   next();
  // })
  // .catch((err) => {
  //   console.log(err);
  // });
});

module.exports = voteRouter;
