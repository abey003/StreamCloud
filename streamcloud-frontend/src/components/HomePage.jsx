import React, { useState, useEffect } from 'react';
import { Button, Card, CardMedia, Grid, Typography, CircularProgress, Box } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [moviesByGenre, setMoviesByGenre] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentPosterIndex, setCurrentPosterIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("https://streamcloud-lt16.onrender.com/movies/genres")
      .then((res) => {
        setMoviesByGenre(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching movies by genres:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (Object.keys(moviesByGenre).length > 0) {
      const firstGenre = Object.keys(moviesByGenre)[0];
      const interval = setInterval(() => {
        setCurrentPosterIndex((prevIndex) => (prevIndex + 1) % Math.min(moviesByGenre[firstGenre].length, 5));
      }, 5000); // Change background and title every 5 seconds

      return () => clearInterval(interval);
    }
  }, [moviesByGenre]);

  const watchNow = (movie) => {
    navigate('/watchnow', { state: { movie } });
  };

  const viewMoviesByGenre = (genre) => {
    navigate(`/movies/genre/${genre}`);
  };

  const firstGenre = Object.keys(moviesByGenre).length > 0 ? Object.keys(moviesByGenre)[0] : null;
  const mostRecentMovies = firstGenre ? moviesByGenre[firstGenre] : [];

  return (
    <div>
      {loading ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4, paddingTop: '64px' }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {firstGenre && (
            <Box
              sx={{
                height: '80vh',
                marginTop: '64px',
                position: 'relative',
                backgroundImage: `url(${mostRecentMovies[currentPosterIndex].moviePosterURL})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
                display: 'flex',
                alignItems: 'flex-end',
                padding: '20px',
                color: 'white',
                textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
                zIndex: 1,
                overflow: 'hidden',
                transition: 'background-image 1s ease-in-out',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(to top, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0))',
                  zIndex: 2,
                },
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 'bold', zIndex: 3 }}>
                {mostRecentMovies[currentPosterIndex].movieName}
              </Typography>
            </Box>
          )}

          {Object.keys(moviesByGenre).map((genre) => (
            <Box key={genre} sx={{ padding: '20px', zIndex: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '20px', cursor: 'pointer' }} onClick={() => viewMoviesByGenre(genre)}>
                {genre.charAt(0).toUpperCase() + genre.slice(1)} Movies
              </Typography>
              <Grid container spacing={2}>
                {moviesByGenre[genre].map((movie) => (
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
                          zIndex: 2
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
          ))}
        </>
      )}
    </div>
  );
};

export default HomePage;
