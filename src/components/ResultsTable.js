import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box
} from '@mui/material';

function ResultsTable({ 
  results, 
  potValue, 
  currency = { symbol: '€', code: 'EUR' },
  showPotValue = true,
  elevation = 0
}) {
  return (
    <>
      {showPotValue && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Total Pot Value: {currency.symbol}{potValue.toFixed(2)}
          </Typography>
        </Box>
      )}

      <TableContainer component={Paper} elevation={elevation}>
        <Table size="small" sx={{ '& td, & th': { fontSize: '0.875rem' } }}>
          <TableHead>
            <TableRow>
              <TableCell 
                sx={{ 
                  py: 1,
                  bgcolor: 'action.hover',
                  fontWeight: 600,
                  borderBottom: 2,
                  width: '35%'
                }}
              >
                Name
              </TableCell>
              <TableCell 
                sx={{ 
                  py: 1,
                  bgcolor: 'action.hover',
                  fontWeight: 600,
                  borderBottom: 2,
                  width: '20%'
                }}
              >
                Starting
              </TableCell>
              <TableCell 
                sx={{ 
                  py: 1,
                  bgcolor: 'action.hover',
                  fontWeight: 600,
                  borderBottom: 2,
                  width: '20%'
                }}
              >
                Ending
              </TableCell>
              <TableCell 
                sx={{ 
                  py: 1,
                  bgcolor: 'action.hover',
                  fontWeight: 600,
                  borderBottom: 2,
                  width: '25%'
                }}
              >
                Result
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results.playerResults.map((player, index) => (
              <TableRow key={index}>
                <TableCell sx={{ py: 1 }}>{player.name}</TableCell>
                <TableCell sx={{ py: 1 }}>{currency.symbol}{player.startingValue.toFixed(2)}</TableCell>
                <TableCell sx={{ py: 1 }}>{currency.symbol}{player.endingValue.toFixed(2)}</TableCell>
                <TableCell 
                  sx={{ 
                    py: 1,
                    color: player.result > 0 ? 'success.main' : player.result < 0 ? 'error.main' : 'text.primary',
                    fontWeight: player.result !== 0 ? 500 : 400
                  }}
                >
                  {player.result > 0 ? '+' : ''}{currency.symbol}{player.result.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default ResultsTable;
