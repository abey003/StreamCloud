import React, { useState, useEffect } from 'react';
import { Button, Box, Typography, CircularProgress } from '@mui/material';
import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useLocation, useNavigate } from 'react-router-dom';

const WatchNowPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const movie = location.state?.movie;

  const [loading, setLoading] = useState(true);

  const handleBackClick = () => {
    navigate(-1);
  };

  useEffect(() => {
    // Simulate loading time (e.g., fetching data)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Adjust the duration as needed

    return () => clearTimeout(timer);
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4, paddingTop: '64px' }}>
      {movie ? (
        <Box 
          sx={{ 
            width: '80%', 
            maxWidth: '1200px', 
            margin: '0 auto', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            textAlign: 'center' 
          }}
        >
          {/* Back Button Above Movie Poster */}
          <Button 
            variant="outlined" 
            startIcon={<ArrowBackIosNewIcon />} 
            sx={{ mb: 2, alignSelf: 'flex-start' }}  
            onClick={() => navigate(-1)}
          >
            Back
          </Button>


          {/* Movie Title, Year, Genre */}
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'row', 
              alignItems: 'flex-start', 
              marginBottom: '20px',
              gap: '20px'
            }}
          >
            <img 
              src={movie.moviePosterURL} 
              alt={movie.movieName} 
              style={{ width: '300px', borderRadius: '8px' }}
            />
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'flex-start', 
                textAlign: 'left' 
              }}
            >
              <Typography variant='h4' sx={{ fontWeight:'bold', mb: '10px' }}>
                {movie.movieName}
              </Typography>
              <Typography variant='h6' sx={{ fontWeight:'bold', color:'green', mb: '10px' }}>
                {movie.movieReleaseYear}
              </Typography>
              <Typography variant='body1' sx={{ fontWeight:'bold' }}>
                {movie.genre}
              </Typography>
            </Box>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {/* Movie Embedded Video */}
              <Box
                sx={{
                  width: '100%',
                  height: '500px',
                  '& iframe': {
                    border: 'none',
                    boxShadow: 'none',
                  }
                }}
              >
                <iframe
                  src={movie.movieEmbeddedLink}
                  allowFullScreen
                  width="100%"
                  height="100%"
                  title={movie.movieName}
                />
              </Box>

              {/* Movie Synopsis */}
              <Box sx={{ mt: 4, textAlign: 'left' }}>
                <Typography variant='h5' sx={{ fontWeight: 'bold', mb: 2 }}>
                  Synopsis
                </Typography>
                <Typography variant='body1' sx={{ mb: 4 }}>
                  {movie.movieDescription}
                </Typography>

                {/* Movie Trailer in Iframe */}
              <Box sx={{ mt: 4, textAlign: 'left' }}>
                <Typography variant='h5' sx={{ fontWeight: 'bold', mb: 2 }}>
                  Trailer
                </Typography>
                <Box
                  sx={{
                    cursor: 'pointer',
                    display: 'inline-block',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: '0px 0px 10px rgba(0,0,0,0.2)',
                    width: '320px', 
                    height: '180px'
                  }}
                >
                  <iframe
                    src={movie.movieTrailer}
                    allowFullScreen
                    width="320"
                    height="180"
                    title={`${movie.movieName} Trailer`}
                    style={{ border: 'none' }}
                  />
                </Box>
              </Box>
              </Box>
            </>
          )}
        </Box>
      ) : (
        <Typography variant="h6">Movie not available</Typography>
      )}
    </Box>
  );
};

export default WatchNowPage;
