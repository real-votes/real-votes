'use strict';

const twilio = require('twilio');

module.exports = function twilioRespond(message, res) {
  const response = new twilio.TwimlResponse();
  response.message(message);

  res
  .status(200)
  .set('Content-Type', 'application/xml')
  .end(response.toString());
};
