import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, TextField, Typography, Avatar, IconButton, CircularProgress } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const SignUpPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null); // State for profile photo
  const [error, setError] = useState('');
  const [videoLoaded, setVideoLoaded] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!profilePhoto) {
      setError("Profile photo is required");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('profilePhoto', profilePhoto); // Append profile photo

      const response = await axios.post('https://streamcloud-vsjc.onrender.com/auth/signup', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 201) {
        console.log("User signed up successfully:", response.data);
        navigate('/login'); // Redirect to login page
      } else {
        setError(response.data.message || "Signup failed");
      }
    } catch (err) {
      console.error("Error signing up:", err);
      setError("Signup failed");
    }
  };

  const handleProfilePhotoChange = (e) => {
    setProfilePhoto(e.target.files[0]);
  };

  return (
    <Box sx={{ height: '100vh', width: '100vw', position: 'relative', overflow: 'hidden' }}>
      <video
        autoPlay
        loop
        muted
        playsInline
        src="./login_signup_bg.mp4"
        onLoadedData={() => setVideoLoaded(true)}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: -1,
        }}
      />
      {!videoLoaded && (
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CircularProgress />
        </Box>
      )}
      {videoLoaded && (
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              background: 'rgba(255, 255, 255, 0.3)',
              borderRadius: '10px',
              padding: '20px',
              width: '400px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              zIndex: 1,
            }}
          >
            <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold', color: 'white', textAlign: 'center' }}>
              Sign Up
            </Typography>
            <form onSubmit={handleSignUp}>
              {/* Profile Photo Avatar */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <input
                  accept="image/*"
                  id="profile-photo"
                  type="file"
                  style={{ display: 'none' }}
                  onChange={handleProfilePhotoChange}
                />
                <label htmlFor="profile-photo">
                  <IconButton component="span">
                    <Avatar
                      sx={{ width: 80, height: 80 }}
                      src={profilePhoto ? URL.createObjectURL(profilePhoto) : ''}
                    >
                      {!profilePhoto && <AccountCircleIcon sx={{ fontSize: 80 }} />}
                    </Avatar>
                  </IconButton>
                </label>
              </Box>
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                required
                sx={{ mb: 2 }}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <TextField
                label="Email"
                type="email"
                variant="outlined"
                fullWidth
                required
                sx={{ mb: 2 }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                required
                sx={{ mb: 2 }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <TextField
                label="Confirm Password"
                type="password"
                variant="outlined"
                fullWidth
                required
                sx={{ mb: 2 }}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                  {error}
                </Typography>
              )}
              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mb: 2 }}>
                Sign Up
              </Button>
            </form>
            <Typography variant="body2" sx={{ mt: 2 }}>
              Already have an account?{' '}
              <Link to="/login" style={{ textDecoration: 'none', color: 'green' }}>
                Login here
              </Link>
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default SignUpPage;
