import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, TextField, Typography, CircularProgress } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [videoLoaded, setVideoLoaded] = useState(false); // State to track if the video is loaded
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://streamcloud-vsjc.onrender.com/auth/login', { email, password });

      if (response.status === 200 && response.data.success) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userId', response.data.userId); // Ensure correct ID
        localStorage.setItem('userEmail', email); // Store email
        setIsLoggedIn(true);
        navigate('/', { replace: true });
      } else {
        setError('Wrong email or password');
      }
    } catch (err) {
      setError('Wrong email or password');
    }
  };

  return (
    <Box sx={{ height: '100vh', width: '100vw', position: 'relative', overflow: 'hidden' }}>
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        src="./login_signup_bg.mp4"
        onLoadedData={() => setVideoLoaded(true)} // Set videoLoaded to true when the video is loaded
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
      {/* Loading Indicator */}
      {!videoLoaded && (
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1,
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
          }}
        >
          <CircularProgress color="primary" />
        </Box>
      )}
      {/* Login Form */}
      {videoLoaded && ( // Only render the login box when the video is loaded
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
              background: 'rgba(255, 255, 255, 0.3)', // Glass effect background
              borderRadius: '10px',
              padding: '20px',
              width: '400px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Shadow for depth
              backdropFilter: 'blur(10px)', // Glass effect blur
              border: '1px solid rgba(255, 255, 255, 0.2)', // Optional border
            }}
          >
            <Typography variant="h4" sx={{ mb: 2, textAlign: 'center', fontWeight: 'bold', color: 'white' }}>
              Login
            </Typography>
            <form onSubmit={handleLogin}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                sx={{ mb: 2 }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                sx={{ mb: 2 }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                  {error}
                </Typography>
              )}
              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mb: 2 }}>
                Login
              </Button>
            </form>
            <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
              Don't have an account?{' '}
              <Link to="/signup" style={{ textDecoration: 'none', color: 'green' }}>
                Sign up
              </Link>
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default LoginPage;
