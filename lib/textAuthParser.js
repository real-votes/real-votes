'use strict';

const httpError = require('http-errors');

const VERIFY = process.env.PASSWORD;

module.exports = function(req, res, next) {
  let textBody = req.query.Body;
  textBody = textBody.split(' ');
  if (textBody[0] !== 'Verification') {
    req.userRole = 'basic';
    return next();
  }
  const verificationToken = textBody[1];
  if (verificationToken !== VERIFY) {
    return next(httpError(401, 'verification token invalid'));
  }
  req.userRole = 'admin';
  req.query.Body = textBody.slice(2).join(' ');
  next();
};
