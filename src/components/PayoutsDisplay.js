import React from 'react';
import { Typography } from '@mui/material';

function PayoutsDisplay({ payouts }) {
  return (
    <div>
      <Typography variant="h6" style={{ marginTop: '20px' }}>Payouts</Typography>
      {payouts.length > 0 ? (
        payouts.map((payout, index) => (
          <Typography key={index}>{payout}</Typography>
        ))
      ) : (
        <Typography>No payouts necessary.</Typography>
      )}
    </div>
  );
}

export default PayoutsDisplay;
