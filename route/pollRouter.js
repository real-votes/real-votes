'use strict';

const jsonParser = require('body-parser').json();
const express = require('express');
const httpError = require('http-errors');

const Poll = require('../model/poll');
const auth = require('../lib/auth');
const tallyVotes = require('../lib/voteTalley');

const pollRouter = module.exports = express.Router(); // eslint-disable-line

pollRouter.post('/', jsonParser, auth, (req, res, next) => {
  // TODO: dissallow creating polls with any status expect not_started
  const newPoll = new Poll(req.body);

  if (newPoll.pollStatus !== 'not_started') {
    return next(httpError(400, 'must set to poll status to \'not_started\''));
  }

  return newPoll.save((err, poll) => {
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

pollRouter.put('/:id', jsonParser, auth, (req, res, next) => {
  const _id = req.params.id;
  if (!_id) {
    return next(httpError(400, 'id not specified'));
  }

  if (!req.body) {
    return next(httpError(400, 'no body'));
  }

  console.log(req.body);

  // return Poll.findOne({ pollStatus: 'in_progress' })
  // .then((poll) => {
  //   if (poll) {
  //     return next(httpError(400, 'a poll is already in progress'));
  //   }
  // })
  // .catch(err => next(err));


  if (req.body.pollStatus === 'in_progress') {
    return Poll.find({ pollStatus: 'in_progress' })
    .then((polls) => {
      if (polls.length) return next(httpError(400, 'a poll is already in progress'));
      return Poll.findByIdAndUpdate(_id, req.body, { new: true })
      .then(poll => res.json(poll))
      .catch(err => next(err));
    });
  }

  if (req.body.pollStatus === 'completed') {
    return Poll.findByIdAndUpdate(_id, req.body, { new: true })
    .then((poll) => {
      tallyVotes(poll);
      res.json(poll);
    })
    .catch(err => next(err));
  }

  Poll.findByIdAndUpdate(_id, req.body, { new: true })
  .then(poll => res.json(poll))
  .catch(err => next(err));
});

pollRouter.delete('/:id', (req, res, next) => {
  const _id = req.params._id;

  if (!_id) {
    return next(httpError(400, 'no id specified'));
  }
  Poll.findOneAndRemove({ _id }, (err) => {
    if (err) return next(err);
    res.json({ message: 'Deleted poll' });
  });
});
