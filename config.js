const { resolve } = require('path');

exports.PORT = process.env.PORT || 5555;

exports.MAIL_HOST = process.env.MAIL_HOST;

exports.MAIL_PORT = process.env.MAIL_PORT;

exports.MAIL_USERNAME = process.env.MAIL_USERNAME;

exports.MAIL_PASSWORD = process.env.MAIL_PASSWORD;

exports.MAIL_FROM_ADDRESS = process.env.MAIL_FROM_ADDRESS;

exports.MAIL_FROM_NAME = process.env.MAIL_FROM_NAME;

exports.MAIL_ENCRYPTION = process.env.MAIL_ENCRYPTION;

exports.PRIVATE_DIR = resolve(process.cwd(), 'private');
