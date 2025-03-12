import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

export default function Account() {
  const { currentUser } = useAuth();

  if (!currentUser) return null;

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Account Details
        </Typography>
        <Typography>
          Email: {currentUser.email}
        </Typography>
        <Typography>
          Account created: {new Date(currentUser.metadata.creationTime).toLocaleDateString()}
        </Typography>
        <Typography>
          Last sign in: {new Date(currentUser.metadata.lastSignInTime).toLocaleDateString()}
        </Typography>
      </Paper>
    </Box>
  );
} 