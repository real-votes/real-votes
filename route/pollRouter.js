'use strict';

const jsonParser = require('body-parser').json();
const express = require('express');

const Poll = require('../model/poll');

const voteRouter = require('./voteRouter');

const pollRouter = module.exports = express.Router(); // eslint-disable-line

pollRouter.post('/', jsonParser, (req, res, next) => {
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

pollRouter.get('/sms_callback', (req, res, next) => {
  console.log(req.query);
  res.status(200).end();
  next();
});

pollRouter.use('/:pollId/vote', voteRouter);
