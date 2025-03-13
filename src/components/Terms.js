import React from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Link,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Terms() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Terms and Conditions
          </Typography>
          
          <Typography variant="body1" paragraph>
            Last updated: {new Date().toLocaleDateString()}
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            1. Acceptance of Terms
          </Typography>
          <Typography variant="body1" paragraph>
            By accessing and using PokerPal, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use our service.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            2. Use of Service
          </Typography>
          <Typography variant="body1" paragraph>
            PokerPal is a free service designed to help poker players track and calculate game results. The service is provided "as is" without any warranties, express or implied.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            3. User Accounts
          </Typography>
          <Typography variant="body1" paragraph>
            You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            4. Data Storage
          </Typography>
          <Typography variant="body1" paragraph>
            We store your game data securely using Firebase. We do not share your personal information with third parties without your consent.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            5. Limitation of Liability
          </Typography>
          <Typography variant="body1" paragraph>
            PokerPal shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            6. Changes to Terms
          </Typography>
          <Typography variant="body1" paragraph>
            We reserve the right to modify these terms at any time. We will notify users of any material changes via the application or email.
          </Typography>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button
              variant="contained"
              onClick={() => navigate('/signup')}
              sx={{ mr: 2 }}
            >
              Back to Sign Up
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/')}
            >
              Back to Home
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
} 