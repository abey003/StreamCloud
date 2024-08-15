const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Import the movieModel from MovieData.js
const movieModel = require('./models/MovieData');

app.use(cors());
app.use(express.json());

require('./connections/connection');

// // Fetch all movies
// app.get('/', async (req, res) => {
//     try {
//         const data = await movieModel.find();
//         res.send(data);
//     } catch (error) {
//         res.send("Error in getting data");
//     }
// });

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

// Filter movies by genre and get the top 4 most recent
app.get('/movies/genre/:genre', async (req, res) => {
    try {
        const genre = req.params.genre;
        const movies = await movieModel.find({ genre: genre }).sort({ movieUploadedOn: -1 }).limit(4);
        res.json(movies);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get the top 4 recently added movies
app.get('/movies/recent', async (req, res) => {
    try {
      // Fetch recent movies from database
      const movies = await Movie.find().sort({ movieUploadedOn: -1 }).limit(4);
      res.json(movies);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching movies', error });
    }
  });

app.listen(PORT, () => {
    console.log("Server is running on port", PORT);
});
