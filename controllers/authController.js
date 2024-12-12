const User = require('../models/userModel');
const emailService = require('../services/emailService');
const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const jwt = require('jsonwebtoken');
// Temporary in-memory storage for verification codes (use Redis or a database in production)
const verificationCode = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit code

exports.emailSignUp = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword });
        await emailService.sendVerificationEmail(user.email, verificationCode);
        res.status(200).json({ message: 'Sign-up successful, verification email sent' });
    } catch (error) {
        next(error);
    }
};

exports.verifyEmail = async (req, res) => {
    const { email, code } = req.body;

    if (!email || !code) {
        return res.status(400).json({ message: "Email and code are required" });
    }
    console.log("Verify request received:", req.body);

    // Check if the code matches
    if (global.verificationCode && global.verificationCode[email] === code) {
        // Code matches, remove it to prevent reuse
        delete global.verificationCode[email];

        return res.status(200).json({ message: "Email verified successfully" });
    }
    console.log("Stored verification codes:", global.verificationCode);
    console.log("Checking for email:", email, "with code:", code);


    return res.status(400).json({ message: "Invalid or expired verification code" });
};

exports.googleSignIn = async (req, res, next) => {
    try {
        const { token } = req.body;
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const { email, name, sub: googleId } = ticket.getPayload();

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({ name, email, googleId, emailVerified: true });
        }

        const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Google Sign-In successful', token: jwtToken });
    } catch (error) {
        next(error);
    }
};