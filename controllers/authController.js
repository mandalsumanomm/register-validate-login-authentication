const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { sendOTPEmail } = require('../services/emailService');
const { generateOTP } = require('../services/authService');

const register = async (req, res) => {
  try {
    const { email, username, password, confirmPassword, roles } = req.body;

    if (!email || !username || !password || !confirmPassword || !roles) {
      return res.status(400).send('All fields are required');
    }

    if (password !== confirmPassword) {
      return res.status(400).send('Passwords do not match');
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpExpires = Date.now() + 10 * 60 * 1000;

    const user = new User({
      email,
      username,
      password: hashedPassword,
      roles,
      otp,
      otpExpires,
    });

    await user.save();
    await sendOTPEmail(email, otp);

    res.status(201).send('User registered successfully. Check your email for the OTP.');
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).send('Invalid or expired OTP');
    }

    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.send('OTP verified successfully');
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const loginWithEmailAndPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).send('Invalid email or password');
    }

    const token = jwt.sign({ email: user.email, roles: user.roles }, process.env.JWT_SECRET);

    res.json({ token });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = { register, verifyOTP, loginWithEmailAndPassword };
