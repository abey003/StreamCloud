// routes/movies.js
const express = require('express');
const router = express.Router();

const movieModel = require('../models/MovieData');

// Get all movies
router.get('/', async (req, res) => {
    try {
        const data = await movieModel.find();
        res.send(data);
    } catch (error) {
        res.status(500).send("Error in getting data");
    }
});

// Get recent movies
router.get('/recent', async (req, res) => {
    try {
        const movies = await movieModel.find().sort({ movieUploadedOn: -1 }).limit(4);
        res.json(movies);
    } catch (error) {
        console.error("Error fetching movies:", error);
        res.status(500).json({ message: 'Error fetching movies', error });
    }
});

// Add a new movie
router.post('/', async (req, res) => { // Changed from /addmovie to /
    try {
        const newMovie = new movieModel(req.body);
        await newMovie.save();
        res.send("Movie added successfully!");
    } catch (error) {
        res.status(500).send("Error in adding movie");
    }
});

// Delete a movie by ID
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await movieModel.findByIdAndDelete(id);
        res.send("Movie deleted successfully!");
    } catch (error) {
        res.status(500).send("Error in deleting movie");
    }
});

// Get a movie by ID
router.get('/:id', async (req, res) => {
    try {
        const movie = await movieModel.findById(req.params.id);
        if (!movie) return res.status(404).json({ message: 'Movie not found' });
        res.json(movie);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update a movie by ID
router.put('/:id', async (req, res) => { // Changed from /updatemovie/:id to /:id
    try {
        const movie = await movieModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!movie) return res.status(404).json({ message: 'Movie not found' });
        res.json(movie);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get movies after a certain date
router.get('/after/:date', async (req, res) => {
    try {
        const date = new Date(req.params.date);
        const movies = await movieModel.find({ movieUploadedOn: { $gte: date } });
        res.json(movies);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get movies by genres
router.get('/genres', async (req, res) => {
    try {
        const genres = [
            'Action', 'Adventure', 'Sci-fi', 'Comedy', 'Horror', 
            'Animation', 'Biography', 'Documentary', 'Romance', 
            'Fantasy', 'Thriller', 'Crime'
        ];

        const moviesByGenre = {};

        for (const genre of genres) {
            const movies = await movieModel.find({ genre }).sort({ movieUploadedOn: -1 }).limit(4);
            if (movies.length > 0) {
                moviesByGenre[genre] = movies;
            }
        }

        res.json(moviesByGenre);
    } catch (error) {
        console.error("Error fetching movies by genres:", error);
        res.status(500).json({ message: 'Error fetching movies by genres', error });
    }
});

// Get movies by a specific genre
router.get('/genre/:genre', async (req, res) => {
    try {
        const movies = await movieModel.find({ genre: req.params.genre });
        if (!movies || movies.length === 0) {
            return res.status(404).json({ message: 'No movies found for this genre' });
        }
        res.json(movies);
    } catch (error) {
        console.error("Error fetching movies by genre:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
