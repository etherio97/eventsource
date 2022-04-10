const {
  PORT,
  MAIL_HOST,
  MAIL_USERNAME,
  MAIL_PASSWORD,
  MAIL_FROM_NAME,
  MAIL_FROM_ADDRESS,
  PUBLIC_DIR,
  PRIVATE_DIR,
} = require('./config');
const { v4: uuid } = require('uuid');

const mailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const express = require('express');
const cors = require('cors');
const ejs = require('ejs');

const app = express();

const transporter = mailer.createTransport(
  smtpTransport({
    service: 'yandex',
    host: MAIL_HOST,
    auth: {
      user: MAIL_USERNAME,
      pass: MAIL_PASSWORD,
    },
  })
);

app.set('trust proxy', 1);

app.use(
  cors(),
  express.json(),
  express.urlencoded({ extended: true }),
  express.static(PUBLIC_DIR)
);

app.get('/verify', (req, res) => {
  let { token } = req.query;
  if (!token) return res.status(400).json({ error: 'Bad request' });
});

app.post('/verify', async (req, res) => {
  let { to, name } = req.body;
  if (!to || !name) {
    return res.status(400).json({ error: 'Bad Request' });
  }
  const baseUrl = 'http://' + req.headers['host'];
  const link = 'verify?token=' + uuid();
  const text = `Verfiy Your Email Address

Confirm that ${email} is your email address at:
\t  ${baseUrl}/${link}

If you didn't request this email, there's nothing to worry about -- you can safely ignore it.

Sincerely,
Ethereal Tech (${baseUrl})
Yangon, Myanmar(Burma), MM.`;
  const html = await ejs.renderFile(
    PRIVATE_DIR + '/template/account-verification.ejs',
    {
      baseUrl,
      link,
      name,
      email: to,
      year: new Date().getFullYear(),
    }
  );
  let mail = {
    from: MAIL_FROM_NAME + '<' + MAIL_FROM_ADDRESS + '>',
    to,
    subject: 'Confirm your email',
    html,
    text,
  };
  transporter.sendMail(mail, (err, result) => {
    if (err) {
      return res.json({
        error: err,
      });
    }
    return res.json({
      result,
    });
  });
  res.status(204).end();
});

app.post('/sendMail', (req, res) => {
  let { to, cc, bbc, subject, text, html } = req.body;
  if (!to || !subject || !(text || html))
    return res.status(400).json({ error: 'Bad Request' });
  let mail = {
    from: MAIL_FROM_NAME + '<' + MAIL_FROM_ADDRESS + '>',
    to,
    cc,
    bbc,
    subject,
    html,
    text,
  };
  transporter.sendMail(mail, (err, result) => {
    if (err) {
      return res.json({
        error: err,
      });
    }
    return res.json({
      result,
    });
  });
});

app.all('*', (req, res) =>
  res.status(404).json({
    error: 'Not found',
  })
);

app.listen(PORT);
