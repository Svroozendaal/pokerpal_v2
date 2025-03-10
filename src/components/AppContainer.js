import React from 'react';
import { Container, Box } from '@mui/material';

function AppContainer({ children }) {
  return (
    <Container 
      maxWidth="xl"
      sx={{
        maxWidth: {
          xs: '100%',
          md: '1200px',
        },
        px: {
          xs: 2,
          sm: 3,
          md: 4,
        },
      }}
    >
      <Box 
        py={3}
        sx={{
          py: {
            xs: 2,
            sm: 3,
            md: 4,
          },
        }}
      >
        {children}
      </Box>
    </Container>
  );
}

export default AppContainer;
