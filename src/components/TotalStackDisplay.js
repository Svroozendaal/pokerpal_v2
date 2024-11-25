import React from 'react';
import { Box, Typography } from '@mui/material';

function TotalStackDisplay({ totalStartingStack, totalEndingStack }) {
  return (
    <Box>
      <Typography variant="body2" color="text.secondary">
        Total Starting Pot: {totalStartingStack}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Total Ending Pot: {totalEndingStack}
      </Typography>
    </Box>
  );
}

export default TotalStackDisplay;
