'use strict';

const httpError = require('http-errors');

const Poll = require('../model/poll');

module.exports = function() {
  return (req, res, next) => {
    Poll.findById(req.params.pollId)
    .then((poll) => {
      if (!poll) {
        return next(httpError(404, 'invalid poll id'));
      }
      req.poll = poll;
      next();
    })
    .catch(err => next(err));
  };
};
