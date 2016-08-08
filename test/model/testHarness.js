require('./testServer');
require('./routerTests');

const mongoose = require('mongoose');

process.on('exit', (code) => {
  mongoose.connection.db.dropDatabase(() => console.log('Database dropped!!'));
});
