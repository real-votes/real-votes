'use strict';

const app = require('express')();
const morgan = require('morgan');
const mongoose = require('mongoose');

const pollRouter = require('../route/pollRouter');
const voteRouter = require('../route/voteRouter');
const Promise = require('../lib/promise');

mongoose.Promise = Promise;

const mongoServer = 'mongodb://localhost/pollDatabase';
mongoose.connect(mongoServer);

app.use(morgan('dev'));

app.use('/api/poll', pollRouter);
app.use('/api/vote', voteRouter);

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).send(err.message);
  next();
});

module.exports = app;
