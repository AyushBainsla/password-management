const nodemailer = require('nodemailer');
const verificationCodes = require('../controllers/authController').verificationCodes; // Import this object

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

exports.sendVerificationEmail = async (email, code) => {
    try {
        // Validate email and code inputs
        if (!email || !code) {
            throw new Error("Email and verification code are required");
        }

        // Email message structure
        const message = {
            from: `"Password Manager" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Verify Your Email - Password Manager",
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.5;">
                    <h2>Verify Your Email</h2>
                    <p>Thank you for signing up! Please use the verification code below to complete your registration:</p>
                    <p style="font-size: 1.2em; font-weight: bold; color: #2C3E50;">${code}</p>
                    <p>If you didn’t request this, please ignore this email.</p>
                    <br>
                    <p>Best regards,</p>
                    <p>Password Manager Team</p>
                </div>
            `,
        };

        // Send the email
        await transporter.sendMail(message);

        // Store the verification code globally for later verification
        global.verificationCode = global.verificationCode || {}; // Ensure global object exists
        global.verificationCode[email] = code; // Store the code against the email
        console.log("Current verification codes:", global.verificationCode);

        console.log(`Verification email sent to ${email} with code: ${code}`);
        return true;
    } catch (error) {
        console.error("Failed to send verification email:", error.message);
        throw new Error(`Failed to send verification email: ${error.message}`);
    }
};
