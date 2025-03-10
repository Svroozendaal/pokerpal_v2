import React from 'react';
import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ResultsDisplay from './ResultsDisplay'; // Import the reusable ResultsDisplay component

function ResultsDialog({ open, onClose, results, potValue, currency }) {
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: 'transparent',
          boxShadow: 'none',
          margin: {
            xs: 1, // 8px margin on mobile
            sm: 2  // 16px margin on tablet and up
          },
          width: {
            xs: 'calc(100% - 16px)', // full width minus 16px (8px on each side) on mobile
            sm: 'auto'  // default width on tablet and up
          }
        }
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        <ResultsDisplay 
          results={results} 
          potValue={potValue} 
          onClose={onClose}
          currency={currency}
        />
      </DialogContent>
    </Dialog>
  );
}

export default ResultsDialog;
