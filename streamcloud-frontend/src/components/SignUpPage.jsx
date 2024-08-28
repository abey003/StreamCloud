import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';

const SignUpPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [videoLoaded, setVideoLoaded] = useState(false); // State to track if the video is loaded
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post('https://streamcloud-vsjc.onrender.com/auth/signup', { name, email, password });

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
      {/* Sign Up Box */}
      {videoLoaded && ( // Only render the sign-up box when the video is loaded
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
              zIndex: 1, // Ensure it's above the video
            }}
          >
            <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold', color: 'white', textAlign: 'center' }}>
              Sign Up
            </Typography>
            <form onSubmit={handleSignUp}>
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                sx={{ mb: 2 }}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <TextField
                label="Email"
                type="email"
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
              <TextField
                label="Confirm Password"
                type="password"
                variant="outlined"
                fullWidth
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
