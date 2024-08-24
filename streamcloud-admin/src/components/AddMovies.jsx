import React, { useState, useEffect } from 'react';
import { Button, TextField, Typography, Grid } from '@mui/material';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const AddMovies = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [movie, setMovie] = useState({
    movieName: '',
    moviePosterURL: '',
    movieEmbeddedLink: '',
    movieLink: '',
    movieDescription: '',
    movieTrailer: '',    
    movieLength: '',
    movieLanguage: '',
    movieReleaseYear: '',
    genre: '', 
  });

  useEffect(() => {
    if (location.state && location.state.movie) {
      setMovie(location.state.movie);
    }
  }, [location.state]);

  const handleChange = (e) => {
    setMovie({
      ...movie,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (movie._id) {
        await axios.put(`http://localhost:3000/updatemovie/${movie._id}`, movie);
        alert('Movie updated successfully!');
      } else {
        await axios.post('http://localhost:3000/addmovie', movie);
        alert('Movie added successfully!');
      }
      navigate('/');
    } catch (error) {
      console.error('There was an error saving the movie!', error);
      alert('Error in saving the movie.');
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div>
      <Typography variant="h4" sx={{ marginBottom: '20px', textAlign: 'center', fontWeight: 'bold' }}>
        {movie._id ? 'Edit Movie' : 'Add a New Movie'}
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={8}>
            <TextField
              fullWidth
              label="Movie Name"
              name="movieName"
              value={movie.movieName}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={8}>
            <TextField
              fullWidth
              label="Poster URL"
              name="moviePosterURL"
              value={movie.moviePosterURL}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={8}>
            <TextField
              fullWidth
              label="Embedded Link"
              name="movieEmbeddedLink"
              value={movie.movieEmbeddedLink}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={8}>
            <TextField
              fullWidth
              label="Download Link"
              name="movieLink"
              value={movie.movieLink}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={8}>
            <TextField
              fullWidth
              label="Movie Description"
              name="movieDescription"
              value={movie.movieDescription}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={8}>
            <TextField
              fullWidth
              label="Movie Trailer Link"
              name="movieTrailer"
              value={movie.movieTrailer}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={8}>
            <TextField
              fullWidth
              label="Length"
              name="movieLength"
              value={movie.movieLength}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={8}>
            <TextField
              fullWidth
              label="Language"
              name="movieLanguage"
              value={movie.movieLanguage}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={8}>
            <TextField
              fullWidth
              label="Release Year"
              name="movieReleaseYear"
              type="number"
              value={movie.movieReleaseYear}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={8}>
            <TextField
              fullWidth
              label="Genre"
              name="genre"
              value={movie.genre}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={8} sx={{ textAlign: 'center' }}>
            <Button type="submit" variant="contained" color="primary">
              {movie._id ? 'Update Movie' : 'Add Movie'}
            </Button>
            <Button 
              variant="outlined" 
              color="secondary" 
              sx={{ marginLeft: '10px' }}
              onClick={handleBack}
            >
              Back
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default AddMovies;
