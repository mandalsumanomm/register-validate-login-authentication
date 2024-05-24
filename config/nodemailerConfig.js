const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

transporter.verify(function (error, success) {
  if (error) {
    console.log('Error with transporter configuration:', error);
  } else {
    console.log('Server is ready to take our messages');
  }
});

module.exports = transporter;
