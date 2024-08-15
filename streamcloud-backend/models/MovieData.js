const mongoose = require('mongoose');

const MovieSchema = mongoose.Schema({
    movieName: String,
    moviePosterURL: String,
    movieEmbeddedLink: String,
    movieLink: String,
    movie3DLink: String,
    movie3DEmbeddedLink: String, 
    movieLength: String,
    movieLanguage: String,
    movieReleaseYear: Number,
    genre: String,
    movieUploadedOn: {
        type: Date,
        default: Date.now
    }
});

const MovieData = mongoose.model("movie_detail", MovieSchema);
module.exports = MovieData;
