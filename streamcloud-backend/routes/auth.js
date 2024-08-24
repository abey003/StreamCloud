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
        user: 'movies.cloud.streaming@gmail.com', // Replace with your email
        pass: 'Saar@2024'    // Replace with your email password
    }
});

// User Registration (Signup)
router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if the email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Hash the password before saving to the database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        if (error.code === 11000) { // Handle duplicate key error
            if (error.keyValue.email) {
                return res.status(400).json({ message: 'Email already exists' });
            }
        }
        res.status(500).json({ message: 'Server error during registration', error });
    }
});

// User Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Check if the password is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Create a JWT token
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

        res.json({ success: true, message: 'Login successful', token });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: 'Server error during login', error });
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
            from: 'movies.cloud.streaming@gmail.com',
            subject: 'Password Reset Request',
            text: `You requested a password reset. Please click on the following link to reset your password: ${resetUrl}`
        };
        await transporter.sendMail(mailOptions);

        res.json({ message: 'Password reset instructions sent to your email' });
    } catch (error) {
        console.error('Error during password reset request:', error);
        res.status(500).json({ message: 'Server error during password reset request', error: error.message });
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
