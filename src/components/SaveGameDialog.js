import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  CircularProgress,
  Grid,
  Divider,
  Snackbar,
  Alert,
} from '@mui/material';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';

export default function SaveGameDialog({ 
  open, 
  onClose, 
  results, 
  potValue, 
  currency,
  coinValue,
  buyInValue,
  players
}) {
  const [title, setTitle] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { currentUser } = useAuth();

  const handleClose = (saved = false) => {
    if (!saving) {
      setTitle('');
      setError(null);
      setSuccess(false);
      onClose(saved);
    }
  };

  const validateData = () => {
    if (!title.trim()) {
      setError('Please enter a title for the game');
      return false;
    }
    if (!results.playerResults || results.playerResults.length === 0) {
      setError('No player results to save');
      return false;
    }
    if (!currentUser) {
      setError('You must be logged in to save games');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateData() || saving) return;
    
    setSaving(true);
    setError(null);
    
    try {
      console.log('Starting save operation...');
      
      // Prepare the data before the async operation
      const gameData = {
        title: title.trim(),
        date: serverTimestamp(), // Use server timestamp instead of client date
        userId: currentUser.uid,
        potValue: Number(potValue), // Ensure number type
        currency,
        results: results.playerResults.map(player => ({
          ...player,
          result: Number(player.result) // Ensure number type
        })),
        payouts: results.payouts,
        settings: {
          coinValue: Number(coinValue), // Ensure number type
          buyInValue: Number(buyInValue), // Ensure number type
          players: players.map(player => ({
            name: player.name || 'Anonymous',
            startStack: Number(player.startStack) || 0,
            endStack: Number(player.endStack) || 0
          }))
        }
      };

      console.log('Data prepared:', gameData);

      // Single async operation with increased timeout
      const savePromise = addDoc(collection(db, 'games'), gameData);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Save operation timed out')), 30000) // Increased timeout to 30 seconds
      );

      console.log('Starting Firestore operation...');
      const docRef = await Promise.race([savePromise, timeoutPromise]);
      console.log('Save successful, document ID:', docRef.id);
      
      setSuccess(true);
      handleClose(true);
    } catch (error) {
      console.error('Error saving game:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      
      setError(error.message === 'Save operation timed out' 
        ? 'Save operation took too long. Please try again.'
        : `Failed to save game: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Dialog 
        open={open} 
        onClose={() => handleClose(false)} 
        maxWidth="md" 
        fullWidth
        disableEscapeKeyDown={saving}
        disableBackdropClick={saving}
      >
        <DialogTitle>Save Game Results</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3, mt: 1 }}>
            <TextField
              autoFocus
              label="Game Title"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Friday Night Game"
              sx={{ mb: 3 }}
              disabled={saving}
              error={!!error}
              helperText={error}
            />
            
            <Grid container spacing={4}>
              {/* Left Column - Game Summary */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ mb: 2 }}>
                  Game Summary
                </Typography>
                
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Total Pot:
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" align="right">
                      {currency.symbol}{potValue.toFixed(2)}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Coin Value:
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" align="right">
                      {currency.symbol}{coinValue}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Buy-in Value:
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" align="right">
                      {buyInValue} chips
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>

              {/* Vertical Divider for MD screens and up */}
              <Grid item md={0} sx={{ display: { xs: 'none', md: 'block' } }}>
                <Divider orientation="vertical" />
              </Grid>

              {/* Horizontal Divider for XS screens */}
              <Grid item xs={12} sx={{ display: { xs: 'block', md: 'none' } }}>
                <Divider sx={{ my: 2 }} />
              </Grid>

              {/* Right Column - Player Results */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ mb: 2 }}>
                  Player Results
                </Typography>
                <Box>
                  {results.playerResults.map((player, index) => (
                    <Typography 
                      key={index} 
                      variant="body2" 
                      color={player.result > 0 ? 'success.main' : player.result < 0 ? 'error.main' : 'text.primary'}
                      sx={{ mb: 0.5 }}
                    >
                      {player.name}: {player.result > 0 ? '+' : ''}{currency.symbol}{player.result.toFixed(2)}
                    </Typography>
                  ))}
                </Box>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => handleClose(false)}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            variant="contained" 
            disabled={!title.trim() || saving}
            startIcon={saving && <CircularProgress size={20} color="inherit" />}
          >
            {saving ? 'Saving...' : 'Save Game'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={success} 
        autoHideDuration={3000} 
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Game saved successfully!
        </Alert>
      </Snackbar>
    </>
  );
} 