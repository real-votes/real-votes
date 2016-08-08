'use strict';

const auth = require('basicauth-middleware');

module.exports = auth('admin', process.env.PASSWORD || 'password');
