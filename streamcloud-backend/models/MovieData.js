const mongoose = require('mongoose');

const MovieSchema = mongoose.Schema({
    movieName: String,
    moviePosterURL: String,
    movieEmbeddedLink: String,
    movieLink: String,
    movieDescription: String,
    movieTrailer: String,
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
