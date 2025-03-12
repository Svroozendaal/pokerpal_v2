import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

export default function Account() {
  const { currentUser } = useAuth();

  return (
    <Container maxWidth="md" sx={{ mt: 12 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Account Settings
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Typography variant="body1">
            Email: {currentUser?.email}
          </Typography>
          {/* More account settings will be added here */}
        </Box>
      </Paper>
    </Container>
  );
} 