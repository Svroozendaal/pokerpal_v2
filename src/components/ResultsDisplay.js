import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
} from '@mui/material';

function ResultsDisplay({ results, potValue }) {
  if (!results || !results.playerResults) {
    return <Typography>No results to display.</Typography>;
  }

  return (
    <Card sx={{ marginTop: 4, boxShadow: 3 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Results & Payouts</Typography>
        </Box>
        <Typography variant="subtitle1" gutterBottom>
          Total Pot Value: €{potValue.toFixed(2)}
        </Typography>

        <TableContainer component={Paper} style={{ marginTop: '20px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Starting (€)</TableCell>
                <TableCell>Ending (€)</TableCell>
                <TableCell>Result (€)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {results.playerResults.map((player, index) => (
                <TableRow key={index}>
                  <TableCell>{player.name}</TableCell>
                  <TableCell>{player.startingValue.toFixed(2)}</TableCell>
                  <TableCell>{player.endingValue.toFixed(2)}</TableCell>
                  <TableCell>{player.result.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography variant="h6" style={{ marginTop: '20px' }}>
          Payouts
        </Typography>
        {results.payouts.length > 0 ? (
          results.payouts.map((payout, index) => (
            <Typography key={index}>{payout}</Typography>
          ))
        ) : (
          <Typography>No payouts necessary.</Typography>
        )}
      </CardContent>
    </Card>
  );
}

export default ResultsDisplay;
