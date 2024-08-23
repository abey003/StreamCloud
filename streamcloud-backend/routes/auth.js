const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/UserData');
const router = express.Router();
const JWT_SECRET = 'your_jwt_secret'; // Use a strong secret in production

// Create a transporter for nodemailer
const transporter = nodemailer.createTransport({
    service: 'Gmail', // You can use other services
    auth: {
        user: 'your-email@gmail.com', // Replace with your email
        pass: 'your-email-password'    // Replace with your email password
    }
});

// Request Password Reset
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User with this email does not exist' });
        }

        // Generate a password reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetToken = resetToken;
        user.resetTokenExpiry = Date.now() + 3600000; // Token valid for 1 hour
        await user.save();

        // Send the password reset email
        const resetUrl = `http://yourdomain.com/reset-password/${resetToken}`;
        const mailOptions = {
            to: email,
            from: 'your-email@gmail.com',
            subject: 'Password Reset Request',
            text: `You requested a password reset. Please click on the following link to reset your password: ${resetUrl}`
        };
        await transporter.sendMail(mailOptions);

        res.json({ message: 'Password reset instructions sent to your email' });
    } catch (error) {
        console.error('Error during password reset request:', error);
        res.status(500).json({ message: 'Server error during password reset request', error });
    }
});

// Reset Password
router.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        // Find the user by reset token and check if the token has expired
        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() }
        });
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }

        // Hash the new password and save it
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.resetToken = undefined; // Clear the reset token
        user.resetTokenExpiry = undefined; // Clear the reset token expiry
        await user.save();

        res.json({ message: 'Password has been successfully reset' });
    } catch (error) {
        console.error('Error during password reset:', error);
        res.status(500).json({ message: 'Server error during password reset', error });
    }
});

module.exports = router;
