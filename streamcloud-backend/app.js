const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

const movieModel = require('./models/MovieData');
const authRoutes = require('./routes/auth');  // Import the auth routes

app.use(cors());
app.use(express.json());

require('./connections/connection');

// Use auth routes
app.use('/auth', authRoutes);  // Prefix all auth routes with /auth

// Movie routes
app.get('/', async (req, res) => {
    try {
        const data = await movieModel.find();
        res.send(data);
    } catch (error) {
        res.send("Error in getting data");
    }
});

app.get('/movies/recent', async (req, res) => {
    try {
        const movies = await movieModel.find().sort({ movieUploadedOn: -1 }).limit(4);
        res.json(movies);
    } catch (error) {
        console.error("Error fetching movies:", error);
        res.status(500).json({ message: 'Error fetching movies', error });
    }
});

app.post('/addmovie', async (req, res) => {
    try {
        const newMovie = new movieModel(req.body);
        await newMovie.save();
        res.send("Movie added successfully!");
    } catch (error) {
        res.status(500).send("Error in adding movie");
    }
});

app.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await movieModel.findByIdAndDelete(id);
        res.send("Movie deleted successfully!");
    } catch (error) {
        res.status(500).send("Error in deleting movie");
    }
});

app.get('/movie/:id', async (req, res) => {
    try {
        const movie = await movieModel.findById(req.params.id);
        if (!movie) return res.status(404).json({ message: 'Movie not found' });
        res.json(movie);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.put('/updatemovie/:id', async (req, res) => {
    try {
        const movie = await movieModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!movie) return res.status(404).json({ message: 'Movie not found' });
        res.json(movie);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/movies/after/:date', async (req, res) => {
    try {
        const date = new Date(req.params.date);
        const movies = await movieModel.find({ movieUploadedOn: { $gte: date } });
        res.json(movies);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/movies/genres', async (req, res) => {
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

app.get('/movies/genre/:genre', async (req, res) => {
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

// Kids show routes
app.post('/addKidsShow', async (req, res) => {
    try {
      const newKidsShow = new KidsShow(req.body);
      await newKidsShow.save();
      res.send("Kids show added successfully!");
    } catch (error) {
      console.error("Error in adding kids show:", error.message);
      res.status(500).send("Error in adding kids show: " + error.message);
    }
  });

app.put('/updateKidsShow/:id', async (req, res) => {
    try {
        const kidsShow = await KidsShow.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!kidsShow) return res.status(404).json({ message: 'Kids show not found' });
        res.json(kidsShow);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Route to fetch all kids shows
app.get('/kidsShows', async (req, res) => {
    try {
        const kidsShows = await KidsShow.find();
        if (kidsShows.length === 0) {
            return res.status(200).json({ message: "No Shows Available" });
        }
        res.json(kidsShows);
    } catch (error) {
        console.error("Error fetching kids shows:", error);
        res.status(500).json({ message: 'Error fetching kids shows', error });
    }
});


app.listen(PORT, () => {
    console.log("Server is running on port", PORT);
});
