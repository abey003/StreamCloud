import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import Logo from '/logo.svg';

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="fixed" sx={{ backgroundColor: 'black' }}>
          <Toolbar>
            <img src={Logo} height='30px' alt="Logo" />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Stream Cloud
            </Typography>
            {isLoggedIn && (
              <>
                <Link to='/'>
                  <Button variant="outlined" sx={{ fontWeight: 'bold', marginRight: '3px', color: 'white' }}>
                    Home
                  </Button>
                </Link>
                <Button
                  variant="contained"
                  sx={{ fontWeight: 'bold', marginRight: '3px', color: 'white' }}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            )}
          </Toolbar>
        </AppBar>
      </Box>
    </div>
  );
};

export default Navbar;
