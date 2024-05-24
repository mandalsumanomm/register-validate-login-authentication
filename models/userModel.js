const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  roles: [String],
  otp: String,
  otpExpires: Date,
});

module.exports = mongoose.model('User', userSchema);
