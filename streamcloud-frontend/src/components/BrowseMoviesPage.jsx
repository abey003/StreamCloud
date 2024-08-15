// BrowseMoviesPage.js
import React, { useState, useEffect } from 'react';
import { Button, Card, CardMedia, Grid, Typography, CircularProgress, Box } from '@mui/material';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const BrowseMoviesPage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { genre } = useParams();

  useEffect(() => {
    axios.get(`https://streamcloud-lt16.onrender.com/movies${genre ? `/genre/${genre}` : ''}`)
      .then((res) => {
        setMovies(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, [genre]);

  const watchNow = (movie) => {
    navigate('/watchnow', { state: { movie } });
  };

  return (
    <div>
      {loading ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4, paddingTop: '64px' }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ padding: '20px' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '20px' }}>
            {genre ? `${genre.charAt(0).toUpperCase() + genre.slice(1)} Movies` : 'Browse Movies'}
          </Typography>
          <Grid container spacing={2}>
            {movies.map((movie) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={movie._id}>
                <Card
                  sx={{
                    maxWidth: 500,
                    margin: '0 auto',
                    textAlign: 'left',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'transform 0.4s ease, box-shadow 0.4s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                    },
                    '&:hover .card-buttons': {
                      opacity: 1,
                      transform: 'translateY(0)',
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="250"
                    image={movie.moviePosterURL}
                    alt={movie.movieName}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '100%',
                      padding: '10px',
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      opacity: 0,
                      transform: 'translateY(100%)',
                      transition: 'opacity 0.3s, transform 0.3s',
                      zIndex: 2,
                    }}
                    className="card-buttons"
                  >
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
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </div>
  );
};

export default BrowseMoviesPage;
