import React, { useState, useEffect } from 'react';
import { Button, Card, CardMedia, Grid, Typography, Box, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import DownloadIcon from '@mui/icons-material/Download';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

const BrowseMoviesPage = () => {
  const { genre } = useParams();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true); // New loading state
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true); // Start loading when API call is made
    axios.get(`https://streamcloud-lt16.onrender.com/movies/genre/${genre}`)
      .then((res) => {
        setMovies(res.data);
        setLoading(false); // Stop loading when data is fetched
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false); // Stop loading on error
      });
  }, [genre]);

  const watchNow = (movie) => {
    navigate('/watchnow', { state: { movie } });
  };

  const getDownloadLink = (link) => {
    const fileId = link.match(/\/d\/(.*?)\//)[1];
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  };

  return (
    <Box sx={{ padding: '70px', zIndex: 2 }}>
      {/* Always visible back button */}
      <Button 
        variant="outlined" 
        startIcon={<ArrowBackIosNewIcon />} 
        sx={{ marginBottom: '20px' }} 
        onClick={() => navigate(-1)}
      >
        Back
      </Button>

      <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '20px' }}>
        {genre.charAt(0).toUpperCase() + genre.slice(1)} Movies
      </Typography>

      {loading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 'calc(100vh - 70px)', // Adjust height to fit remaining space
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
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
                  <a href={getDownloadLink(movie.movieLink)} target="_blank" rel="noopener noreferrer">
                    <Button
                      variant="contained"
                      sx={{ backgroundColor: 'black', fontWeight: 'bold' }}
                    >
                      <DownloadIcon />
                    </Button>
                  </a>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default BrowseMoviesPage;
