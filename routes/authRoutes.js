const express = require('express');
const router = express.Router();
const { googleSignIn, emailSignUp, verifyEmail } = require('../controllers/authController');

router.post('/signup', emailSignUp);
router.post('/verify-email', verifyEmail);
router.post('/google-signin', googleSignIn);

module.exports = router;
