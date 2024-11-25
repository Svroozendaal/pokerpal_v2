import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
} from '@mui/material';
import ResultsDisplay from './ResultsDisplay'; // Import the reusable ResultsDisplay component

function ResultsDialog({ open, onClose, results, potValue }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Button onClick={onClose} color="secondary">
            Close
          </Button>
        </Box>
      </DialogTitle>
      <DialogContent>
        {/* Reuse ResultsDisplay Component */}
        <ResultsDisplay results={results} potValue={potValue} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ResultsDialog;
