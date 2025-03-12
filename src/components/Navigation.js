import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  IconButton,
  useTheme,
  Typography,
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
  const [isHovered, setIsHovered] = useState(false);

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
      elevation={0}
      sx={{
        background: 'rgba(13, 25, 35, 0.7)',
        backdropFilter: 'blur(8px)',
        height: '48px',
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar 
        sx={{ 
          minHeight: '48px !important',
          justifyContent: 'space-between',
          px: 2
        }}
      >
        <Box 
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          sx={{ 
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            minWidth: '200px'
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              left: 0,
              opacity: isHovered ? 0 : 1,
              transition: 'opacity 0.3s ease',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <img 
              src="/images/Pokerpal_logo512.png" 
              alt="Logo" 
              style={{ 
                height: '24px',
                width: 'auto',
                marginRight: '8px'
              }} 
            />
          </Box>

          <Box
            sx={{
              position: 'absolute',
              left: 0,
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 0.3s ease',
              display: 'flex',
              gap: 2,
            }}
          >
            {currentUser ? (
              <>
                <Button
                  color="inherit"
                  size="small"
                  startIcon={<AccountCircleIcon />}
                  onClick={() => navigate('/account')}
                >
                  Account
                </Button>
                <Button
                  color="inherit"
                  size="small"
                  startIcon={<HistoryIcon />}
                  onClick={() => navigate('/history')}
                >
                  History
                </Button>
                <Button
                  color="inherit"
                  size="small"
                  startIcon={<LogoutIcon />}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button
                color="inherit"
                size="small"
                startIcon={<LoginIcon />}
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
            )}
          </Box>
        </Box>

        <Typography
          variant="h6"
          component="div"
          onClick={() => navigate('/')}
          sx={{
            position: 'absolute',
            left: '50%',
            fontSize: '2rem',
            transform: 'translateX(-50%)',
            background: 'linear-gradient(45deg, #1f957d 30%, #2ab094 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 700,
            cursor: 'pointer',
            '&:hover': {
              opacity: 0.8,
            },
          }}
        >
          PokerPal
        </Typography>

        <IconButton 
          onClick={toggleTheme} 
          color="inherit"
          size="small"
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