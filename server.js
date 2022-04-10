const {
  PORT,
  MAIL_HOST,
  MAIL_PORT,
  MAIL_USERNAME,
  MAIL_PASSWORD,
  MAIL_FROM_NAME,
  MAIL_FROM_ADDRESS,
  MAIL_ENCRYPTION,
} = require('./config');

const mailer = require('nodemailer');
const express = require('express');
const cors = require('cors');

const app = express();
const transporter = mailer.createTransport({
  host: MAIL_HOST,
  port: MAIL_PORT,
  secure: true,
  tls: {
    rejectUnauthorized: false,
  },
  auth: {
    username: MAIL_USERNAME,
    password: MAIL_PASSWORD,
  },
});

app.set('trust proxy', 1);

app.post('/sendMail', cors(), express.json(), express.urlencoded({ extended: true }), (req, res) => {
  let { to, cc, bbc, subject, text, html } = req.body;
  if (!to || !subject || !(text||html)) return res.status(400).json({ error: 'Bad Request' });
  let mail = {
    from: MAIL_FROM_NAME + '<' + MAIL_FROM_ADDRESS + '>',
    to,
    cc,
    bbc,
    subject,
    html,
    text,
  };
  transporter.sendMail(mail, (err, info) => {
    if (err) {
      return res.json({
        error: err,
      });
    }
    return res.json({
      result: info,
    });
  });
});

app.all('*', cors(), express.json(), express.urlencoded({ extended: true }), (req, res) => {
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