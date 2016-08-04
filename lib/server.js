const express = require('express');

const server = express();

server.get('/sms_callback', (req, res) => {
  console.log(req.query);
  res.status(200).end();
});

const port = 3141;
server.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
