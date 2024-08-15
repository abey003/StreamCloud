const mongoose = require('mongoose');

const MovieSchema = mongoose.Schema({
    movieName: String,
    moviePosterURL: String,
    movieEmbeddedLink: String,
    movieLink: String,
    movie3DLink: String,  // New field for 3D movie link
    movie3DEmbeddedLink: String,  // New field for 3D embedded link
    movieLength: String,
    movieLanguage: String,
    movieReleaseYear: Number,
    genre: String, // Add genre field if needed
    movieUploadedOn: {
        type: Date,
        default: Date.now
    }
});

const MovieData = mongoose.model("movie_detail", MovieSchema);
module.exports = MovieData;
