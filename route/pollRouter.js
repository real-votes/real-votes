'use strict';

const jsonParser = require('body-parser').json();
const express = require('express');

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
