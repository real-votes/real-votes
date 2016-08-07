const express = require('express');
const twilio = require('twilio');
const debug = require('debug')('rv:vote-router');

const Poll = require('../model/poll');

const voteRouter = new express.Router();

voteRouter.get('/sms_callback', (req, res, next) => {
  Poll.findOneAndUpdate({ pollStatus: 'in_progress' },
    {
      $push: {
        votes: {
          phoneNumber: req.query.From,
          vote: req.query.Body,
        },
      },
    },
    { new: true }
  )
  .then((newVote) => {
    debug(`Creating new vote from ${req.query.From} of ${req.query.Body}`);
    const response = new twilio.TwimlResponse();

    res
      .status(200)
      .set('Content-Type', 'application/xml')
      .end(response.toString());

    next();
  })
  .catch((err) => {
    console.log(err);
  });
});

module.exports = voteRouter;
