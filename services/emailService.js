const nodemailer = require('nodemailer');
const transporter = require('../config/nodemailerConfig');

async function sendOTPEmail(email, otp) {
  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP email sent to ${email}`);
  } catch (error) {
    console.error('Error sending OTP email:', error);
  }
}

module.exports = {
  sendOTPEmail,
};
