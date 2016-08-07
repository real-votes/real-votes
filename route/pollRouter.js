'use strict';

const jsonParser = require('body-parser').json();
const express = require('express');
const httpError = require('http-errors');

const Poll = require('../model/poll');

const pollRouter = module.exports = express.Router(); // eslint-disable-line

pollRouter.post('/', jsonParser, (req, res, next) => {
  // TODO: dissallow creating polls with any status expect not_started
  const newPoll = new Poll(req.body);
  newPoll.save((err, poll) => {
    if (err) return next(err);
    return res.json(poll);
  });
});

pollRouter.get('/:id', (req, res, next) => {
  const _id = req.params.id;
  Poll.findOne({ _id }, (err, poll) => {
    if (err) return next(err);
    return res.json(poll);
  });
});

pollRouter.get('/', (req, res, next) => {
  Poll.find({}, (err, polls) => {
    if (err) return next(err);
    return res.json(polls);
  });
});

pollRouter.put('/:id', jsonParser, (req, res, next) => {
  const _id = req.params.id;
  if (!_id) {
    return next(httpError(400, 'id not specified'));
  }

  if (!req.body) {
    return next(httpError(400, 'no body'));
  }

  if (req.body.pollStatus === 'in_progress') {
    return Poll.find({ pollStatus: 'in_progress' })
    .then((polls) => {
      if (polls.length) return next(httpError(400, 'a poll is already in progress'));
      return Poll.findByIdAndUpdate(_id, req.body, { new: true })
      .then(poll => res.json(poll))
      .catch(err => next(err));
    });
  }
  return console.log('what dude');
});

/*
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
)*/
