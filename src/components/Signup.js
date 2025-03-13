import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Link,
  Alert,
  FormControlLabel,
  Checkbox,
  Divider
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (!acceptedTerms) {
      return setError('Please accept the Terms and Conditions');
    }

    if (password !== passwordConfirm) {
      return setError('Passwords do not match');
    }

    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    try {
      setError('');
      setLoading(true);
      await signup(email, password, displayName);
      navigate('/');
    } catch (error) {
      setError('Failed to create an account. ' + error.message);
    }
    setLoading(false);
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Create Account
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Display Name"
              required
              fullWidth
              margin="normal"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              disabled={loading}
            />
            <TextField
              label="Email"
              type="email"
              required
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <TextField
              label="Password"
              type="password"
              required
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              helperText="Password must be at least 6 characters"
              disabled={loading}
            />
            <TextField
              label="Confirm Password"
              type="password"
              required
              fullWidth
              margin="normal"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              disabled={loading}
            />
            
            <FormControlLabel
              control={
                <Checkbox
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  disabled={loading}
                />
              }
              label={
                <Typography variant="body2">
                  I accept the{' '}
                  <Link href="/terms" target="_blank">
                    Terms and Conditions
                  </Link>
                </Typography>
              }
              sx={{ mt: 2 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading || !acceptedTerms}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Button>

            <Divider sx={{ my: 2 }}>or</Divider>

            <Box sx={{ textAlign: 'center' }}>
              <Link 
                component="button"
                variant="body2"
                onClick={() => navigate('/login')}
                disabled={loading}
              >
                Already have an account? Log In
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
} 