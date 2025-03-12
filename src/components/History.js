import React from 'react';
import { Container, Typography, Paper } from '@mui/material';

export default function History() {
  return (
    <Container maxWidth="md" sx={{ mt: 12 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Game History
        </Typography>
        <Typography variant="body1">
          Your game history will appear here soon.
        </Typography>
      </Paper>
    </Container>
  );
} 