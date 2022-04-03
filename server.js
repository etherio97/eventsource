const PORT = process.env.PORT || 5555;

const express = require('express');
const cors = require('cors');

const app = express();

app.set('trust proxy', 1);

app.all('*', cors(),express.json(), express.urlencoded({ extended: true }), (req, res) => {
  let ip = (req.headers['x-forwarded-for'] || '').split(',').pop().trim() || req.socket.remoteAddress;

  res.json({
    ip,
    method: req.method,
    path: req.originalUrl,
    headers: req.headers,
    body: req.body,
  })
});

app.listen(PORT);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(() => resolve(), ms));
}