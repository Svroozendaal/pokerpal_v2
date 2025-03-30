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
  useMediaQuery,
  Card,
  CardContent,
  Grid
} from '@mui/material';

function ResultsTable({ 
  results, 
  potValue, 
  currency,
  showPotValue = true,
  elevation = 0
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const formatCurrency = (value) => {
    const absValue = Math.abs(value);
    const formattedValue = absValue.toFixed(2);
    const symbol = currency?.symbol || '$';
    return value < 0 ? `-${symbol}${formattedValue}` : `${symbol}${formattedValue}`;
  };

  return (
    <Card elevation={elevation} sx={{ mb: 2 }}>
      <CardContent>
        <Grid container spacing={2}>
          {/* Header */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Results
            </Typography>
          </Grid>

          {/* Pot Value */}
          {showPotValue && (
            <Grid item xs={12}>
              <Typography variant="subtitle1" color="text.secondary">
                Total Pot: {formatCurrency(potValue)}
              </Typography>
            </Grid>
          )}

          {/* Results Table */}
          <Grid item xs={12}>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Player</TableCell>
                    <TableCell align="right">Starting Value</TableCell>
                    <TableCell align="right">Ending Value</TableCell>
                    <TableCell align="right">Result</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {results.playerResults.map((player, index) => (
                    <TableRow key={index}>
                      <TableCell>{player.name}</TableCell>
                      <TableCell align="right">{formatCurrency(player.startingValue)}</TableCell>
                      <TableCell align="right">{formatCurrency(player.endingValue)}</TableCell>
                      <TableCell 
                        align="right"
                        sx={{ 
                          color: player.result > 0 ? 'success.main' : player.result < 0 ? 'error.main' : 'text.primary'
                        }}
                      >
                        {formatCurrency(player.result)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default ResultsTable;
