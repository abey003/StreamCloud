import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, CardMedia, Grid, Typography, CircularProgress, Box } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:3000/")
      .then((res) => {
        setMovies(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  const watchNow = (movie) => {
    console.log("Navigating to WatchNowPage with movie:", movie); // Debugging
    navigate('/watchnow', { state: { movie } });
  };

  return (
    <div>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      ) : (
        movies.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Typography variant="h6">No movies to show</Typography>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {movies.map((movie) => (
              <Grid item xs={4} key={movie._id}>
                <Card sx={{ maxWidth: 300, margin: '5% auto', textAlign: 'left', boxShadow: '5px' }}>
                  <CardContent>
                    <CardMedia
                      component="img"
                      height="300"
                      image={movie.moviePosterURL}
                      alt={movie.movieName}
                    />
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                      {movie.movieName}
                    </Typography>
                    <Typography sx={{ color: 'green', fontWeight: 'bold' }}>
                      {movie.movieLength}
                    </Typography>
                    <Button
                      variant="contained"
                      sx={{ fontWeight: 'bold', marginRight: '2px' }}
                      onClick={() => watchNow(movie)}
                    >
                      Watch Now
                    </Button>
                    <a href={movie.movieLink} target='_blank' rel="noopener noreferrer">
                      <Button
                        variant="contained"
                        sx={{ backgroundColor: 'black', fontWeight: 'bold' }}
                      >
                        Download
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )
      )}
    </div>
  );
};

export default HomePage;
