import React, { useState, useEffect } from 'react';
import { Typography, CircularProgress, Card, CardMedia, Grid, Box } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const KidsPage = () => {
  const [kidsShows, setKidsShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchKidsShows = async () => {
      try {
        const response = await axios.get('https://streamcloud-vsjc.onrender.com/kids');

        if (response.data.message === "No Shows Available") {
          setKidsShows([]);
        } else {
          // Sort the shows alphabetically by title
          const sortedShows = response.data.sort((a, b) => a.title.localeCompare(b.title));
          setKidsShows(sortedShows);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching kids shows:", error);
        setLoading(false);
      }
    };

    fetchKidsShows();
  }, []);

  const handleCardClick = (show) => {
    navigate('/kidswatch', { state: { show } });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ marginTop: '60px', padding: '20px' }}>
      {kidsShows.length === 0 ? (
        <Typography variant='h5'>No shows available</Typography>
      ) : (
        <Grid container spacing={3}>
          {kidsShows.map((show) => (
            <Grid item xs={12} sm={6} md={3} key={show._id}>
              <Card
                sx={{
                  maxWidth: 500,
                  margin: '0 auto',
                  textAlign: 'left',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'transform 0.4s ease, box-shadow 0.4s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                  },
                }}
                onClick={() => handleCardClick(show)}
              >
                <CardMedia
                  component="img"
                  sx={{
                    aspectRatio: '16/9',
                    objectFit: 'cover',
                  }}
                  image={show.image}
                  alt={show.title}
                />
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default KidsPage;
