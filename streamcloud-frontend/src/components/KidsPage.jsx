import { Typography, CircularProgress, Card, CardMedia, CardContent, Grid, Box } from '@mui/material';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const KidsPage = () => {
  const [kidsShows, setKidsShows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKidsShows = async () => {
      try {
        const response = await axios.get('http://localhost:3000/kids');

        if (response.data.message === "No Shows Available") {
          setKidsShows([]);
        } else {
          setKidsShows(response.data);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching kids shows:", error);
        setLoading(false);
      }
    };

    fetchKidsShows();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '60px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ marginTop: '60px', padding: '20px' }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '20px' }}>
        Kids
      </Typography>
      {kidsShows.length === 0 ? (
        <Typography variant='h5'>No shows available</Typography>
      ) : (
        <Grid container spacing={3}>
          {kidsShows.map((show) => (
            <Grid item xs={12} sm={6} md={4} key={show._id}>
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
