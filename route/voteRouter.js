const express = require('express');

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
  .then((updated) => {
    console.log(updated);
  })
  .catch((err) => {
    console.log(err);
  });

  console.log(req.query);
  res.status(200).end();
  next();
});

module.exports = voteRouter;
