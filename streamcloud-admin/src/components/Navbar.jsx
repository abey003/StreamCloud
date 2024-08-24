import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import Logo from '/logo.svg'

const Navbar = () => {
  return (
    <div>
        <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor:'black' }}>
        <Toolbar>
          <img
           src={Logo}
           height='30px'
          />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Stream Cloud Admin
          </Typography>
          <Link to='/'>
            <Button variant="outlined" sx={{ fontWeight:'bold', marginRight:'3px', color:'white' }}>Home</Button>
          </Link>
          <Link to='/addmovie'>
            <Button variant="contained" sx={{ fontWeight:'bold', marginRight:'3px', color:'white' }}><AddCircleOutlinedIcon /></Button> 
          </Link>
        </Toolbar>
      </AppBar>
    </Box>
    </div>
  )
}

export default Navbar