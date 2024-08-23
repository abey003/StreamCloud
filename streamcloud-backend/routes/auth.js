const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/UserData');

const router = express.Router();
const JWT_SECRET = 'your_jwt_secret'; // Use a strong secret in production

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
    const { email, password } = req.body; // Updated to email

    try {
        // Find the user by email
        const user = await User.findOne({ email }); // Updated to email
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' }); // Updated message
        }

        // Check if the password is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' }); // Updated message
        }

        // Create a JWT token
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

        res.json({ success: true, message: 'Login successful', token });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: 'Server error during login', error });
    }
});

module.exports = router;
