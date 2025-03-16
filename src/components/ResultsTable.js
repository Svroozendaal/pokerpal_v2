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
  Box,
  useTheme,
  useMediaQuery
} from '@mui/material';

function ResultsTable({ 
  results, 
  potValue, 
  currency = { symbol: '€', code: 'EUR' },
  showPotValue = true,
  elevation = 0
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const formatCurrency = (value) => {
    const absValue = Math.abs(value);
    const formattedValue = absValue.toFixed(2);
    return value < 0 ? `-${currency.symbol}${formattedValue}` : `${currency.symbol}${formattedValue}`;
  };

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
        <Table 
          size="small" 
          sx={{ 
            '& td, & th': { 
              fontSize: '0.875rem',
              px: isMobile ? 1 : 2,
              py: isMobile ? 0.5 : 1
            }
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell 
                sx={{ 
                  py: isMobile ? 0.5 : 1,
                  bgcolor: 'action.hover',
                  fontWeight: 600,
                  borderBottom: 2,
                  width: isMobile ? '35%' : '35%'
                }}
              >
                Name
              </TableCell>
              <TableCell 
                sx={{ 
                  py: isMobile ? 0.5 : 1,
                  bgcolor: 'action.hover',
                  fontWeight: 600,
                  borderBottom: 2,
                  width: isMobile ? '20%' : '20%'
                }}
              >
                Starting
              </TableCell>
              <TableCell 
                sx={{ 
                  py: isMobile ? 0.5 : 1,
                  bgcolor: 'action.hover',
                  fontWeight: 600,
                  borderBottom: 2,
                  width: isMobile ? '20%' : '20%'
                }}
              >
                Ending
              </TableCell>
              <TableCell 
                sx={{ 
                  py: isMobile ? 0.5 : 1,
                  bgcolor: 'action.hover',
                  fontWeight: 600,
                  borderBottom: 2,
                  width: isMobile ? '25%' : '25%'
                }}
              >
                Result
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results.playerResults.map((player, index) => (
              <TableRow key={index}>
                <TableCell sx={{ py: isMobile ? 0.5 : 1 }}>{player.name}</TableCell>
                <TableCell sx={{ py: isMobile ? 0.5 : 1 }}>{formatCurrency(player.startingValue)}</TableCell>
                <TableCell sx={{ py: isMobile ? 0.5 : 1 }}>{formatCurrency(player.endingValue)}</TableCell>
                <TableCell 
                  sx={{ 
                    py: isMobile ? 0.5 : 1,
                    color: player.result > 0 ? 'success.main' : player.result < 0 ? 'error.main' : 'text.primary',
                    fontWeight: player.result !== 0 ? 500 : 400
                  }}
                >
                  {player.result > 0 ? '+' : ''}{formatCurrency(player.result)}
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
