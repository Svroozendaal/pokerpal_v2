import React from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  IconButton,
  useTheme,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HistoryIcon from '@mui/icons-material/History';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

export default function Navigation({ isDarkMode, toggleTheme }) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <AppBar 
      position="fixed" 
      color="inherit" 
      elevation={1}
      sx={{
        backgroundColor: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {currentUser ? (
            <>
              <Button
                color="inherit"
                startIcon={<AccountCircleIcon />}
                onClick={() => navigate('/account')}
              >
                Account
              </Button>
              <Button
                color="inherit"
                startIcon={<HistoryIcon />}
                onClick={() => navigate('/history')}
              >
                History
              </Button>
              <Button
                color="inherit"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <Button
              color="inherit"
              startIcon={<LoginIcon />}
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
          )}
        </Box>
        
        <IconButton 
          onClick={toggleTheme} 
          color="inherit"
          sx={{
            ml: 2,
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
        >
          {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
} 