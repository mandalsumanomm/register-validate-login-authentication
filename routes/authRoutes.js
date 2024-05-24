const express = require('express');
const { register, verifyOTP, loginWithEmailAndPassword } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/verify-otp', verifyOTP);
router.post('/login', loginWithEmailAndPassword);

module.exports = router;
