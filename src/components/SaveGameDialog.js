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
} from '@mui/material';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

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
  const db = getFirestore();

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
          <Typography variant="body2" gutterBottom>
            Total Pot: {currency.symbol}{potValue.toFixed(2)}
          </Typography>
          <Typography variant="body2" gutterBottom>
            Coin Value: {currency.symbol}{coinValue}
          </Typography>
          <Typography variant="body2" gutterBottom>
            Buy-in Value: {buyInValue} chips
          </Typography>
          {results.playerResults.map((player, index) => (
            <Typography key={index} variant="body2" color={player.result > 0 ? 'success.main' : player.result < 0 ? 'error.main' : 'text.primary'}>
              {player.name}: {player.result > 0 ? '+' : ''}{currency.symbol}{player.result.toFixed(2)}
            </Typography>
          ))}
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