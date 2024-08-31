import React, { useState, useEffect } from 'react';
import { Button, Card, CardMedia, Grid, Typography, CircularProgress, Box } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [kidsShows, setKidsShows] = useState([]);
  const [loadingMovies, setLoadingMovies] = useState(true);
  const [loadingShows, setLoadingShows] = useState(true);
  const [errorMovies, setErrorMovies] = useState(false);
  const [errorShows, setErrorShows] = useState(false);
  const [currentPosterIndex, setCurrentPosterIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch movies
    axios.get("http://localhost:3000/movies")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setMovies(res.data);
        } else {
          setErrorMovies(true);
        }
        setLoadingMovies(false);
      })
      .catch((error) => {
        console.error("Error fetching movies:", error);
        setErrorMovies(true);
        setLoadingMovies(false);
      });

    // Fetch kids shows
    axios.get("http://localhost:3000/kids")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setKidsShows(res.data);
        } else {
          setErrorShows(true);
        }
        setLoadingShows(false);
      })
      .catch((error) => {
        console.error("Error fetching kids shows:", error);
        setErrorShows(true);
        setLoadingShows(false);
      });
  }, []);

  useEffect(() => {
    if (movies.length > 0) {
      const interval = setInterval(() => {
        setCurrentPosterIndex((prevIndex) => (prevIndex + 1) % movies.slice(0, 5).length);
      }, 5000); // Change background and title every 5 seconds

      return () => clearInterval(interval);
    }
  }, [movies]);

  const deleteMovie = (movieId) => {
    const confirmed = window.confirm("Are you sure you want to delete this movie?");
    
    if (confirmed) {
      axios.delete(`http://localhost:3000/delete/${movieId}`)
        .then(() => {
          setMovies(movies.filter(movie => movie._id !== movieId));
        })
        .catch((error) => {
          console.error("Error deleting movie:", error);
        });
    }
  };

  const editMovie = (movie) => {
    navigate('/addmovie', { state: { movie } });
  };

  const deleteKidsShow = (showId) => {
    const confirmed = window.confirm("Are you sure you want to delete this kids show?");
    
    if (confirmed) {
      axios.delete(`http://localhost:3000/deletekidsshow/${showId}`)
        .then(() => {
          setKidsShows(kidsShows.filter(show => show._id !== showId));
        })
        .catch((error) => {
          console.error("Error deleting kids show:", error);
        });
    }
  };

  const editKidsShow = (show) => {
    navigate('/addkidsshow', { state: { kidsShow: show } });
  };

  return (
    <div style={{ marginTop: '60px' }}>
      {/* Movies Section */}
      {loadingMovies ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4, paddingTop: '64px' }}>
          <CircularProgress />
        </Box>
      ) : errorMovies || !Array.isArray(movies) || movies.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6">Movies not available</Typography>
        </Box>
      ) : (
        <Box sx={{ padding: '20px', zIndex: 2, position: 'relative', backgroundColor: '#fff' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '20px' }}>
            Movies
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
                    sx={{
                      aspectRatio: '16/9',
                      objectFit: 'cover',
                    }}
                    image={movie.moviePosterURL}
                    alt={movie.movieName}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: '1px',
                      left: 0,
                      width: '100%',
                      padding: '10px',
                      color: 'white',
                      textAlign: 'left',
                      zIndex: 1,
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {movie.movieName}
                    </Typography>
                  </Box>
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
                      sx={{ marginRight: '2px', backgroundColor: 'red' }}
                      onClick={() => deleteMovie(movie._id)}
                    >
                      <DeleteOutlineOutlinedIcon />
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => editMovie(movie)}
                    >
                      <EditOutlinedIcon />
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Kids Shows Section */}
      {loadingShows ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4, paddingTop: '64px' }}>
          <CircularProgress />
        </Box>
      ) : errorShows || !Array.isArray(kidsShows) || kidsShows.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6">No Shows Available</Typography>
        </Box>
      ) : (
        <Box sx={{ padding: '20px', zIndex: 2, position: 'relative', backgroundColor: '#fff', marginTop: '20px' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '20px' }}>
            Kids
          </Typography>
          <Grid container spacing={2}>
            {kidsShows.map((show) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={show._id}>
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
                    sx={{
                      aspectRatio: '16/9',
                      objectFit: 'cover',
                    }}
                    image={show.image}
                    alt={show.showTitle}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: '1px',
                      left: 0,
                      width: '100%',
                      padding: '10px',
                      color: 'white',
                      textAlign: 'left',
                      zIndex: 1,
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {show.showTitle}
                    </Typography>
                  </Box>
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
                      sx={{ marginRight: '2px', backgroundColor: 'red' }}
                      onClick={() => deleteKidsShow(show._id)}
                    >
                      <DeleteOutlineOutlinedIcon />
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => editKidsShow(show)}
                    >
                      <EditOutlinedIcon />
                    </Button>
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

export default HomePage;
