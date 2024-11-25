import React from 'react';
import { Container, Box } from '@mui/material';

function AppContainer({ children }) {
  return (
    <Container maxWidth="sm">
      <Box p={3}>
        {children}
      </Box>
    </Container>
  );
}

export default AppContainer;
