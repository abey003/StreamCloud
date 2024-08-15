import React from 'react';
import { Button, Box, Typography } from '@mui/material';
import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined';
import { useLocation, useNavigate } from 'react-router-dom';

const WatchNowPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const movie = location.state?.movie;

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4, paddingTop: '64px' }}>
      <Button 
        variant="contained" 
        onClick={handleBackClick} 
        sx={{ mb: 2, mx: 4, alignSelf: 'flex-start' }}
      >
        <ArrowBackIosOutlinedIcon />
      </Button>
      
      {movie ? (
        <Box 
          sx={{ 
            width: '80%', 
            maxWidth: '1200px', 
            margin: '0 auto', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'left',
            textAlign: 'center' 
          }}
        >
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
        </Box>
      ) : (
        <Typography variant="h6">Movie not available</Typography>
      )}
    </Box>
  );
};

export default WatchNowPage;
