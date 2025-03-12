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
} from '@mui/material';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

export default function SaveGameDialog({ open, onClose, results, potValue, currency }) {
  const [title, setTitle] = useState('');
  const [saving, setSaving] = useState(false);
  const { currentUser } = useAuth();
  const db = getFirestore();

  const handleSave = async () => {
    if (!title.trim()) return;
    
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
      };

      await addDoc(collection(db, 'games'), gameData);
      setTitle('');
      onClose(true); // true indicates successful save
    } catch (error) {
      console.error('Error saving game:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="sm" fullWidth>
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
          />
          
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Game Summary:
          </Typography>
          <Typography variant="body2" gutterBottom>
            Total Pot: {currency.symbol}{potValue.toFixed(2)}
          </Typography>
          {results.playerResults.map((player, index) => (
            <Typography key={index} variant="body2" color={player.result > 0 ? 'success.main' : player.result < 0 ? 'error.main' : 'text.primary'}>
              {player.name}: {player.result > 0 ? '+' : ''}{currency.symbol}{player.result.toFixed(2)}
            </Typography>
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(false)}>Cancel</Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          disabled={!title.trim() || saving}
        >
          {saving ? 'Saving...' : 'Save Game'}
        </Button>
      </DialogActions>
    </Dialog>
  );
} 