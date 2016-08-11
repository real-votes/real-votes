require('./testServer');
require('./routerTests');
require('./voteTests');

const mongoose = require('mongoose');

module.exports = exports = (callback) => { //eslint-disable-line
  mongoose.connection.db.dropDatabase(() => console.log('Database dropped!!'));
};
