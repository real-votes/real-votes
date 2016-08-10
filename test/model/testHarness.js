require('./testServer');
require('./pollTests');
require('./voteTests');

const mongoose = require('mongoose');

process.on('exit', () => {
  mongoose.connection.db.dropDatabase(() => console.log('Database dropped!!'));
});
