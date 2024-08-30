const mongoose = require('mongoose');

const episodeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  synopsis: { type: String, required: true },
  link: { type: String, required: true },
  poster: { type: String, required: false } // Assuming poster is optional
});

const kidsShowSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  episodes: [episodeSchema]
});

module.exports = mongoose.model('KidsShow', kidsShowSchema);
