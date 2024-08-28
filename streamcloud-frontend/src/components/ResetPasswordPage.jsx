import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [videoLoaded, setVideoLoaded] = useState(false); // State to track if the video is loaded
  const navigate = useNavigate();
  const { token } = useParams(); // Extract the token from the URL

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(`https://streamcloud-vsjc.onrender.com/auth/reset-password/${token}`, { password });

      if (response.status === 200) {
        setMessage('Password has been successfully reset.');
        setPassword('');
        setConfirmPassword('');
        // Optionally, redirect to login after a delay
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError('Failed to reset password.');
      }
    } catch (err) {
      console.error('Error resetting password:', err);
      setError('Failed to reset password.');
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
      {/* Reset Password Form */}
      {videoLoaded && (
        <Box sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Box sx={{ background: 'rgba(255, 255, 255, 0.3)', borderRadius: '10px', padding: '20px', width: '400px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', backdropFilter: 'blur(10px)' }}>
            <Typography variant="h4" sx={{ mb: 2, textAlign: 'center', fontWeight: 'bold' }}>
              Reset Password
            </Typography>
            <form onSubmit={handleResetPassword}>
              <TextField
                label="New Password"
                type="password"
                variant="outlined"
                fullWidth
                sx={{ mb: 2 }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <TextField
                label="Confirm New Password"
                type="password"
                variant="outlined"
                fullWidth
                sx={{ mb: 2 }}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                Reset Password
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

export default ResetPasswordPage;
