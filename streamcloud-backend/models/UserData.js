const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
        match: /^[A-Za-z][A-Za-z\s]*$/
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /.+\@.+\..+/
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    profilePhoto: {
        type: String, // Store Base64 string
    },
    resetToken: String,
    resetTokenExpiry: Date
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
