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
      maxWidth="lg" 
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: 'transparent',
          boxShadow: 'none',
          margin: {
            xs: 1, // 8px margin on mobile
            sm: 2,  // 16px margin on tablet and up
            md: 4
          },
          width: {
            xs: 'calc(100% - 16px)', // full width minus 16px (8px on each side) on mobile
            sm: 'calc(100% - 32px)',
            md: 'calc(100% - 64px)',
            lg: '90%',
            xl: '80%'
          },
          maxWidth: {
            xs: '100%',
            sm: '600px',
            md: '800px',
            lg: '1000px',
            xl: '1200px'
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
