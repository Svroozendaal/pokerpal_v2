import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

function DiscrepancyModal({ open, onClose, discrepancy }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Stack Discrepancy</DialogTitle>
      <DialogContent>
        <Typography>
          The starting and ending stacks are not equal. Discrepancy: €
          {Math.abs(discrepancy).toFixed(2)}. Adjust values before calculating.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          OK, Adjust Values
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DiscrepancyModal;
