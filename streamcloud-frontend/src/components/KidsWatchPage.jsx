import React, { useState } from 'react';
import { Box, Typography, Card, CardMedia, Grid, IconButton } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ReactPlayer from 'react-player';

const KidsWatchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { show } = location.state || {};

  const [selectedEpisode, setSelectedEpisode] = useState(null);

  if (!show) {
    return <Typography variant='h5'>No show details available</Typography>;
  }

  const handleEpisodeClick = (episode) => {
    setSelectedEpisode(episode);
  };

  const handleCloseIframe = () => {
    setSelectedEpisode(null);
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '40px',
          marginTop: '70px',
          position: 'relative',
        }}
      >
        <IconButton
          sx={{
            position: 'absolute',
            left: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 1,
          }}
          onClick={() => navigate(-1)}
        >
          <ArrowBackIcon color='primary' />
        </IconButton>
        
        <CardMedia
          component="img"
          sx={{
            width: '300px',
            height: 'auto',
            objectFit: 'cover',
            borderRadius: '8px',
            marginRight: '20px',
          }}
          image={show.image}
          alt={show.title}
        />
        <Box>
          <Typography variant='h4' sx={{ marginBottom: '10px', fontWeight: 'bold' }}>
            {show.title}
          </Typography>
        </Box>
      </Box>

      {selectedEpisode && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center', // Center horizontally
            marginBottom: '20px',
          }}
        >
          <Box
            sx={{
              position: 'relative',
              width: '75%',
              height: 0,
              paddingTop: '42.1875%', // Aspect ratio for 75% width and 16:9 height
            }}
          >
            <ReactPlayer
              url={`https://www.youtube.com/watch?v=${selectedEpisode.link.split('v=')[1]}`}
              width="100%"
              height="100%"
              controls
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
              }}
            />
          </Box>
        </Box>
      )}

      <Typography variant='h6' sx={{ marginBottom: '20px', fontWeight: 'bold' }}>
        Episodes
      </Typography>
      <Grid container spacing={2}>
        {show.episodes.map((episode, index) => (
          <Grid item xs={12} sm={6} md={3} lg={3} key={episode._id}>
            <Card
              sx={{
                maxWidth: 400,
                margin: '0 auto',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform 0.4s ease, box-shadow 0.4s ease',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                },
              }}
              onClick={() => handleEpisodeClick(episode)}
            >
              <CardMedia
                component="img"
                sx={{
                  aspectRatio: '16/9',
                  objectFit: 'cover',
                }}
                image={episode.poster}
                alt={episode.title}
              />
              <Box sx={{ padding: '10px' }}>
                <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
                  Episode {index + 1}: {episode.title}
                </Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default KidsWatchPage;
