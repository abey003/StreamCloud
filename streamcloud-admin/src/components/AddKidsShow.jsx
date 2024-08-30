import React, { useState, useEffect } from 'react';
import { Button, TextField, Typography, Grid, Box } from '@mui/material';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const AddKidsShow = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [kidsShow, setKidsShow] = useState({
    title: '',
    image: '',
    episodes: [
      { title: '', synopsis: '', link: '', poster: '' }
    ]
  });

  useEffect(() => {
    if (location.state && location.state.kidsShow) {
      setKidsShow(location.state.kidsShow);
    }
  }, [location.state]);

  const handleChange = (e, episodeIndex) => {
    const { name, value } = e.target;
    const updatedEpisodes = [...kidsShow.episodes];
    updatedEpisodes[episodeIndex][name] = value;
    setKidsShow({ ...kidsShow, episodes: updatedEpisodes });
  };

  const handleAddEpisode = () => {
    setKidsShow({
      ...kidsShow,
      episodes: [...kidsShow.episodes, { title: '', synopsis: '', link: '', poster: '' }]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedEpisodes = kidsShow.episodes.map(episode => ({
      ...episode,
      poster: episode.poster || kidsShow.image
    }));

    const updatedKidsShow = { ...kidsShow, episodes: updatedEpisodes };

    try {
      if (kidsShow._id) {
        await axios.put(`http://localhost:3000/updateKidsShow/${kidsShow._id}`, updatedKidsShow);
        alert('Kids Show updated successfully!');
      } else {
        await axios.post('http://localhost:3000/addKidsShow', updatedKidsShow);
        alert('Kids Show added successfully!');
      }
      navigate('/');
    } catch (error) {
      console.error('There was an error saving the kids show!', error);
      alert('Error in saving the kids show: ' + error.message);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '10vh',
        marginTop: "60px",
        padding: '20px'
      }}
    >
      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '600px' }}>
        <Typography variant="h4" sx={{ marginBottom: '20px', textAlign: 'center', fontWeight: 'bold' }}>
          {kidsShow._id ? 'Edit Kids Show' : 'Add a New Kids Show'}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Show Title"
              name="title"
              value={kidsShow.title}
              onChange={(e) => setKidsShow({ ...kidsShow, title: e.target.value })}
              required
              sx={{ marginBottom: 2 }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Show Image URL"
              name="image"
              value={kidsShow.image}
              onChange={(e) => setKidsShow({ ...kidsShow, image: e.target.value })}
              required
              sx={{ marginBottom: 2 }}
            />
          </Grid>

          {kidsShow.episodes.map((episode, episodeIndex) => (
            <div key={episodeIndex} style={{ marginRight: '10%' }}>
              <Typography variant="h6" sx={{ marginTop: '20px', textAlign: 'center' }}>
                Episode {episodeIndex + 1}
              </Typography>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Episode Title"
                  name="title"
                  value={episode.title}
                  onChange={(e) => handleChange(e, episodeIndex)}
                  required
                  sx={{ marginBottom: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Episode Synopsis"
                  name="synopsis"
                  value={episode.synopsis}
                  onChange={(e) => handleChange(e, episodeIndex)}
                  required
                  sx={{ marginBottom: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Episode Link"
                  name="link"
                  value={episode.link}
                  onChange={(e) => handleChange(e, episodeIndex)}
                  required
                  sx={{ marginBottom: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Episode Poster URL"
                  name="poster"
                  value={episode.poster}
                  onChange={(e) => handleChange(e, episodeIndex)}
                  sx={{ marginBottom: 2 }}
                />
              </Grid>
            </div>
          ))}

          <Grid item xs={12} sx={{ textAlign: 'center', marginBottom: '20px' }}>
            <Button variant="contained" color="primary" onClick={handleAddEpisode}>
              Add Episode
            </Button>
          </Grid>

          <Grid item xs={12} sx={{ textAlign: 'center', marginTop: '20px' }}>
            <Button type="submit" variant="contained" color="primary">
              {kidsShow._id ? 'Update Kids Show' : 'Add Kids Show'}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              sx={{ marginLeft: '10px' }}
              onClick={handleBack}
            >
              Back
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default AddKidsShow;
