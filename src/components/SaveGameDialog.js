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
} from '@mui/material';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

// Initialize Firestore outside the component to avoid re-initialization
const db = getFirestore();

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
  const { currentUser } = useAuth();

  const handleClose = (saved = false) => {
    if (!saving) {
      setTitle('');
      onClose(saved);
    }
  };

  const handleSave = async () => {
    if (!title.trim() || saving) return;
    
    setSaving(true);
    try {
      // Prepare the data before the async operation
      const gameData = {
        title: title.trim(),
        date: new Date(),
        userId: currentUser.uid,
        potValue,
        currency,
        results: results.playerResults,
        payouts: results.payouts,
        settings: {
          coinValue,
          buyInValue,
          players: players.map(player => ({
            name: player.name,
            startStack: player.startStack,
            endStack: player.endStack
          }))
        }
      };

      // Single async operation
      await addDoc(collection(db, 'games'), gameData);
      handleClose(true);
    } catch (error) {
      console.error('Error saving game:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={() => handleClose(false)} 
      maxWidth="sm" 
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
            sx={{ mb: 2 }}
            disabled={saving}
          />
          
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Game Summary:
          </Typography>

          {/* Game Settings */}
          <Grid container spacing={1} sx={{ mb: 2 }}>
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

          {/* Player Results */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Player Results:
            </Typography>
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
  );
} 