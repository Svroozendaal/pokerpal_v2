import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

function DiscrepancyModal({ open, onClose, discrepancy, currency = { symbol: '€', code: 'EUR' } }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Stack Discrepancy Detected</DialogTitle>
      <DialogContent>
        <Typography>
          There is a discrepancy of {currency.symbol}{Math.abs(discrepancy).toFixed(2)} between the total starting and ending stacks.
          Please check the values and try again.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DiscrepancyModal;
