import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Container, Typography, Box, IconButton, Avatar, CircularProgress } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

const AccountPage = () => {
  const [userData, setUserData] = useState({ name: '', email: '', password: '', profilePhoto: '' });
  const [originalData, setOriginalData] = useState({ name: '', email: '', password: '', profilePhoto: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingPassword, setEditingPassword] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [profilePhotoFile, setProfilePhotoFile] = useState(null); // State for the selected file
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail');

  const isLoggedIn = !!localStorage.getItem('isLoggedIn');

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  useEffect(() => {
    if (!userEmail) {
      setError('User email not found. Please log in again.');
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/auth/account/email/${userEmail}`);
        setUserData(response.data);
        setOriginalData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load user data');
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userEmail]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
    setHasChanges(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhotoFile(file);
      setHasChanges(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (userData.password && userData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      const updatedData = {};

      Object.keys(userData).forEach((key) => {
        if (userData[key] !== originalData[key] || (key === 'password' && userData[key])) {
          updatedData[key] = userData[key];
        }
      });

      if (updatedData.password) {
        updatedData.password = await axios.post(`http://localhost:3000/auth/encrypt-password`, { password: updatedData.password });
      }

      // Handle profile photo update
      if (profilePhotoFile) {
        const formData = new FormData();
        formData.append('profilePhoto', profilePhotoFile);
        formData.append('name', userData.name);
        formData.append('email', userData.email);
        formData.append('password', userData.password);

        await axios.put(`http://localhost:3000/auth/account/email/${userEmail}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        setSuccess('Profile updated successfully');
      } else {
        await axios.put(`http://localhost:3000/auth/account/email/${userEmail}`, updatedData);
        setSuccess('Profile updated successfully');
      }

      setOriginalData(userData);
      setHasChanges(false);
      if (updatedData.email) {
        localStorage.setItem('userEmail', updatedData.email);
      }
    } catch (error) {
      console.error('Error updating user data:', error);
      setError('Failed to update profile');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ marginTop: '80px', position: 'relative' }}>
      <Box display="flex" alignItems="center" mb={2}>
        <Button 
          variant="outlined" 
          startIcon={<ArrowBackIosNewIcon />} 
          sx={{ mb: 2 }}  
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
        <Typography variant="h4" sx={{ flexGrow: 0.5, textAlign: 'center' }}>
          Account Details
        </Typography>
      </Box>
      {loading ? (
        <Box mt={4} textAlign="center">
          <CircularProgress />
        </Box>
      ) : (
        <Box mt={4} mb={2} textAlign="center">
          <Box display="flex" flexDirection="column" alignItems="center">
            <input
              accept="image/*"
              type="file"
              style={{ display: 'none' }}
              id="profile-photo-upload"
              onChange={handleFileChange}
            />
            <label htmlFor="profile-photo-upload">
              <IconButton component="span">
                <Avatar
                  src={userData.profilePhoto}
                  alt="Profile Photo"
                  sx={{ width: 100, height: 100, margin: 'auto' }}
                />
              </IconButton>
            </label>
          </Box>
          {error && <Typography color="error">{error}</Typography>}
          {success && <Typography color="primary">{success}</Typography>}
          <form onSubmit={handleSubmit}>
            <TextField
              label="Name"
              name="name"
              value={userData.name}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <Box mt={2} mb={2} display="flex" alignItems="center">
              <TextField
                label="Email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                fullWidth
                margin="normal"
                disabled={!editingEmail}
              />
              <IconButton
                style={{ marginLeft: 8 }}
                onClick={() => setEditingEmail(!editingEmail)}
              >
                <EditIcon />
              </IconButton>
            </Box>
            <Box mt={2} mb={2} display="flex" alignItems="center">
              <TextField
                label="New Password"
                name="password"
                value={userData.password}
                onChange={handleChange}
                type="password"
                fullWidth
                margin="normal"
                disabled={!editingPassword}
              />
              <IconButton
                style={{ marginLeft: 8 }}
                onClick={() => setEditingPassword(!editingPassword)}
              >
                <EditIcon />
              </IconButton>
            </Box>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!hasChanges}
            >
              Update Profile
            </Button>
          </form>
        </Box>
      )}
    </Container>
  );
};

export default AccountPage;
