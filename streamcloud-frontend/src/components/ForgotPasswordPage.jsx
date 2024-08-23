import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [videoLoaded, setVideoLoaded] = useState(false); // State to track if the video is loaded
  const navigate = useNavigate();

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://streamcloud-lt16.onrender.com/auth/forgot-password', { email });

      if (response.status === 200) {
        setMessage('Password reset instructions sent to your email.');
        setEmail(''); // Clear email field
      } else {
        setError('Failed to send password reset instructions.');
      }
    } catch (err) {
      console.error('Error resetting password:', err);
      setError('Failed to send password reset instructions.');
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
      {/* Forgot Password Form */}
      {videoLoaded && (
        <Box sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Box sx={{ background: 'rgba(255, 255, 255, 0.3)', borderRadius: '10px', padding: '20px', width: '400px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', backdropFilter: 'blur(10px)' }}>
            <Typography variant="h4" sx={{ mb: 2, textAlign: 'center', fontWeight: 'bold' }}>
              Forgot Password
            </Typography>
            <form onSubmit={handlePasswordReset}>
              <TextField
                label="Email"
                type="email"
                variant="outlined"
                fullWidth
                sx={{ mb: 2 }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {message && (
                <Typography color="success.main" sx={{ mb: 2 }}>
                  {message}
                </Typography>
              )}
              {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                  {error}
                </Typography>
              )}
              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mb: 2 }}>
                Send Reset Instructions
              </Button>
              <Button
                onClick={() => navigate('/login')}
                variant="outlined"
                color="primary"
                fullWidth
              >
                Back to Login
              </Button>
            </form>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ForgotPasswordPage;
