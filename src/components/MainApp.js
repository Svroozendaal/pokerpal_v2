import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button, Box } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import AppContainer from './AppContainer';
// Import all your existing components and functionality

export default function MainApp() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  }

  return (
    <>
      <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1000 }}>
        <Button
          variant="outlined"
          color="inherit"
          onClick={handleLogout}
          startIcon={<LogoutIcon />}
        >
          Logout
        </Button>
      </Box>
      
      {/* Your existing app content goes here */}
      <AppContainer>
        {/* Copy your existing App.js content here */}
      </AppContainer>
    </>
  );
} 