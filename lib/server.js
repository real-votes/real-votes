const path = require('path');

const app = require('express')();
const morgan = require('morgan');
const mongoose = require('mongoose');

const pollRouter = require('../route/pollRouter');
const voteRouter = require('../route/voteRouter');

const errorHandler = require('./errorHandler');
const Promise = require('./promise');

mongoose.Promise = Promise;

if (!process.env.PASSWORD) {
  console.log('You MUST set the PASSWORD enviroment variable');
  process.exit(1);
}

const mongoServer = process.env.MONGODB_URI || 'mongodb://localhost/pollDatabase';
mongoose.connect(mongoServer);

app.use(morgan('dev'));

app.use('/api/poll', pollRouter);
app.use('/api/vote', voteRouter);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../resources/index.html'));
});

app.use(errorHandler);

module.exports = app;
