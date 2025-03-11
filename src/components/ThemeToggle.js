import React from 'react';
import { Box, IconButton, Button } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';

export default function ThemeToggle({ isDarkMode, toggleTheme }) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        position: 'fixed',
        top: 16,
        right: 16,
        zIndex: 1001,
      }}
    >
      {currentUser ? (
        <Button
          variant="outlined"
          color="inherit"
          onClick={handleLogout}
          startIcon={<LogoutIcon />}
          size="small"
          sx={{ backgroundColor: 'background.paper' }}
        >
          Logout
        </Button>
      ) : (
        <Button
          variant="outlined"
          color="inherit"
          onClick={() => navigate('/login')}
          startIcon={<LoginIcon />}
          size="small"
          sx={{ backgroundColor: 'background.paper' }}
        >
          Login
        </Button>
      )}
      <IconButton 
        onClick={toggleTheme} 
        color="inherit"
        sx={{
          backgroundColor: 'background.paper',
          '&:hover': {
            backgroundColor: 'action.hover',
          },
        }}
      >
        {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
    </Box>
  );
} 