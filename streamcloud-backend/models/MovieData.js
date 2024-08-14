const mongoose = require('mongoose');
const MovieSchema = mongoose.Schema({
    movieName:String,
    moviePosterURL:String,
    movieEmbeddedLink:String,
    movieLink:String,
    movieLength:String,
    movieLanguage:String,
    movieReleaseYear:Number
})

const MovieData = mongoose.mongoose.model("movie_detail",MovieSchema);
module.exports = MovieData