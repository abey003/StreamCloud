const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/UserData');
const multer = require('multer');
const path = require('path'); 

const router = express.Router();
const JWT_SECRET = 'your_jwt_secret'; // Use a strong secret in production

// Create a transporter for nodemailer
const transporter = nodemailer.createTransport({
    service: 'Gmail', // You can use other services
    auth: {
        user: 'Replace with your email', // Replace with your email
        pass: 'Replace with your email password'    // Replace with your email password
    }
});

// Setup Multer to store files in memory
const storage = multer.memoryStorage(); // No need for diskStorage

const upload = multer({ storage: storage });

// User Registration (Signup)
router.post('/signup', upload.single('profilePhoto'), async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        let profilePhotoBase64 = null;

        if (req.file) {
            // Convert image file to Base64 string
            console.log("Profile photo received:", req.file);
            profilePhotoBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
        }

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            profilePhoto: profilePhotoBase64
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error("Error during registration:", error);
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
            return res.status(400).json({ message: 'Email not found' });
        }

        // Generate a password reset token
        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        await user.save();

        // Send email with the reset link
        const resetURL = `http://localhost:3000/reset-password/${resetToken}`;
        const mailOptions = {
            to: email,
            from: 'no-reply@yourdomain.com',
            subject: 'Password Reset',
            text: `You are receiving this email because you (or someone else) have requested to reset your password. Please make a PUT request to the following link to reset your password:\n\n${resetURL}\n\nIf you did not request this, please ignore this email.\n`
        };

        await transporter.sendMail(mailOptions);

        res.json({ message: 'Password reset link sent to your email' });
    } catch (error) {
        console.error("Error during password reset request:", error);
        res.status(500).json({ message: 'Server error during password reset request', error });
    }
});

// Reset Password
router.put('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        // Find the user by reset token and check if the token is expired
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Password reset token is invalid or has expired' });
        }

        // Hash the new password and update user
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.json({ message: 'Password has been updated successfully' });
    } catch (error) {
        console.error("Error during password reset:", error);
        res.status(500).json({ message: 'Server error during password reset', error });
    }
});

// Get User Account Details
router.get('/account/email/:email', async (req, res) => {
    const { email } = req.params;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Exclude password and sensitive information from the response
        const { name, email: userEmail, profilePhoto } = user;
        res.json({ name, email: userEmail, profilePhoto });
    } catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).json({ message: 'Server error fetching user data', error });
    }
});

// Update User Account Details
router.put('/account/email/:email', upload.single('profilePhoto'), async (req, res) => {
    const { email } = req.params;
    const { name, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (name) user.name = name;
        if (password) user.password = await bcrypt.hash(password, 10);

        if (req.file) {
            const profilePhotoBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
            user.profilePhoto = profilePhotoBase64;
        }

        await user.save();
        res.json({ message: 'User account updated successfully' });
    } catch (error) {
        console.error("Error updating user account:", error);
        res.status(500).json({ message: 'Server error updating user account', error });
    }
});

module.exports = router;
