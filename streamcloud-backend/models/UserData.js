const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
        match: /^[A-Za-z][A-Za-z\s]*$/ // Name should start with an alphabet and only contain alphabets and spaces
    },
    email: {
        type: String,
        required: true,
        unique: true, // Email should remain unique
        match: /.+\@.+\..+/ // Basic email validation
    },
    password: {
        type: String,
        required: true,
        minlength: 6 // Minimum length for password
    },
    resetToken: String,
    resetTokenExpiry: Date
}, { timestamps: true }); // Add timestamps for createdAt and updatedAt fields

const User = mongoose.model('User', userSchema);

module.exports = User;
