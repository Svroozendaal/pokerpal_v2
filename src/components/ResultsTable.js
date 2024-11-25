import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';

function ResultsTable({ results, potValue }) {
  return (
    <TableContainer component={Paper} style={{ marginTop: '20px' }}>
      <Typography variant="h6">Results</Typography>
      <Typography>Total Pot Value: €{potValue.toFixed(2)}</Typography>

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
          {results.map((player, index) => (
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
  );
}

export default ResultsTable;
