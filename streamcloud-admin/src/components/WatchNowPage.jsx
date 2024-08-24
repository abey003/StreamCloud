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
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
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
            width: '99%',
            height: '570px',
            '& iframe': {
              border: 'none',
              boxShadow: 'none',
            }
          }}
        >
          <Typography variant='h5' sx={{ fontWeight:'bold', textAlign:'center' }}>
            {movie.movieName}
          </Typography>
          <Typography variant='body2' sx={{ fontWeight:'bold', textAlign:'center', color:'green' }}>
            {movie.movieLength}
          </Typography>
          <iframe
            src={movie.movieEmbeddedLink}
            allowFullScreen
            width="100%"
            height="100%"
            title={movie.movieName}
          />
        </Box>
      ) : (
        <Typography variant="h6">Movie not available</Typography>
      )}
    </Box>
  );
};

export default WatchNowPage;
