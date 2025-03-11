import React from 'react';
import { Box, IconButton, Button } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';

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
        justifyContent: 'flex-end',
        gap: 2,
        p: 2,
        position: 'absolute',
        top: 0,
        right: 0,
        zIndex: 1000,
      }}
    >
      {currentUser ? (
        <Button
          variant="outlined"
          color="inherit"
          onClick={handleLogout}
          startIcon={<LogoutIcon />}
          size="small"
        >
          Logout
        </Button>
      ) : (
        <Button
          variant="outlined"
          color="inherit"
          onClick={() => navigate('/login')}
          size="small"
        >
          Login
        </Button>
      )}
      <IconButton onClick={toggleTheme} color="inherit">
        {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
    </Box>
  );
} 