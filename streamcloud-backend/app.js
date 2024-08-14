const express = require('express');
const cors = require('cors');
const app = new express();
app.use(cors());
const PORT = 3000
const movieModel = require('./models/MovieData');

app.use(express.json());

require('./connections/connection');

app.get('/', async (req, res) => {
    try {
        const data = await movieModel.find();
        res.send(data);
    } catch(error) {
        res.send("Error in getting data");
    }
})

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

// Get a specific movie by ID
app.get('/movie/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    res.json(movie);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put('/updatemovie/:id', async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    res.json(movie);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


app.listen(PORT, () => {
    console.log("Server is running");
})