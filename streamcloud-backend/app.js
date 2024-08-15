const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Import the movieModel from MovieData.js
const movieModel = require('./models/MovieData');

app.use(cors());
app.use(express.json());

require('./connections/connection');

// Fetch all movies
app.get('/', async (req, res) => {
    try {
        const data = await movieModel.find();
        res.send(data);
    } catch (error) {
        res.send("Error in getting data");
    }
});

// Get the top 4 recently added movies
app.get('/movies/recent', async (req, res) => {
    try {
        const movies = await movieModel.find().sort({ movieUploadedOn: -1 }).limit(4);
        res.json(movies);
    } catch (error) {
        console.error("Error fetching movies:", error); // Log the error to the console
        res.status(500).json({ message: 'Error fetching movies', error });
    }
});

// Add a new movie
app.post('/addmovie', async (req, res) => {
    try {
        const newMovie = new movieModel(req.body);
        await newMovie.save();
        res.send("Movie added successfully!");
    } catch (error) {
        res.status(500).send("Error in adding movie");
    }
});

// Delete a movie by ID
app.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await movieModel.findByIdAndDelete(id);
        res.send("Movie deleted successfully!");
    } catch (error) {
        res.status(500).send("Error in deleting movie");
    }
});

// Get a specific movie by ID
app.get('/movie/:id', async (req, res) => {
    try {
        const movie = await movieModel.findById(req.params.id);
        if (!movie) return res.status(404).json({ message: 'Movie not found' });
        res.json(movie);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update a movie by ID
app.put('/updatemovie/:id', async (req, res) => {
    try {
        const movie = await movieModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!movie) return res.status(404).json({ message: 'Movie not found' });
        res.json(movie);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Filter movies by upload date (on or after a specific date)
app.get('/movies/after/:date', async (req, res) => {
    try {
        const date = new Date(req.params.date);
        const movies = await movieModel.find({ movieUploadedOn: { $gte: date } });
        res.json(movies);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Fetch all movies by genre and group them
app.get('/movies/genres', async (req, res) => {
    try {
        const genres = [
            'action', 'adventure', 'sci-fi', 'comedy', 'horror', 
            'animation', 'biography', 'documentary', 'romance', 
            'fantasy', 'thriller', 'crime'
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
        console.error("Error fetching movies by genres:", error); // Log the error to the console
        res.status(500).json({ message: 'Error fetching movies by genres', error });
    }
});

app.listen(PORT, () => {
    console.log("Server is running on port", PORT);
});
