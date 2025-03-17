import React from 'react';
import { Box } from '@mui/material';
import Footer from './Footer';
import GoogleAd from './GoogleAd';

function AppContainer({ children }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Box
        component="main"
        sx={{
          flex: '1 0 auto',
          p: { xs: 2, sm: 3 },
          width: '100%',
          maxWidth: '1400px',
          mx: 'auto',
        }}
      >
        {children}
        <GoogleAd />
      </Box>
      <Footer />
    </Box>
  );
}

export default AppContainer;
