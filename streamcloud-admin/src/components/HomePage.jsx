import React, { useState, useEffect } from 'react';
import { Button, Card, CardMedia, Grid, Typography, CircularProgress, Box } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPosterIndex, setCurrentPosterIndex] = useState(0);
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
        .then((res) => {
          setMovies(movies.filter(movie => movie._id !== movieId));
        })
        .catch((error) => {
          console.error("Error deleting movie:", error);
        });
    }
  };

  const editMovie = (movie) => {
    navigate('/editmovie', { state: { movie } });
  };

  return (
    <div>
      {loading ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4, paddingTop: '64px' }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
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
                      height="250"
                      image={movie.moviePosterURL}
                      alt={movie.movieName}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: '1px',  // Adjusted to move the title higher
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
                          onClick={() => navigate('/addmovie', { state: { movie } })}
                        >
                          <EditOutlinedIcon />
                        </Button>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </>
      )}
    </div>
  );
};

export default HomePage;
