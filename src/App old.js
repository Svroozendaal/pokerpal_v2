// App.js
import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

function App() {
  const [players, setPlayers] = useState([{ name: '', startStack: '', endStack: '' }]);
  const [coinValue, setCoinValue] = useState('');
  const [buyInValue, setBuyInValue] = useState('');
  const [results, setResults] = useState([]);
  const [potValue, setPotValue] = useState(0);
  const [discrepancy, setDiscrepancy] = useState(0);
  const [showDiscrepancyModal, setShowDiscrepancyModal] = useState(false);
  const [totalStartingStack, setTotalStartingStack] = useState(0);
  const [totalEndingStack, setTotalEndingStack] = useState(0);

  useEffect(() => {
    const totalStarting = players.reduce((acc, player) => acc + (parseFloat(player.startStack) || 0), 0);
    const totalEnding = players.reduce((acc, player) => acc + (parseFloat(player.endStack) || 0), 0);
    setTotalStartingStack(totalStarting);
    setTotalEndingStack(totalEnding);
  }, [players]);

  const handlePlayerChange = (index, field, value) => {
    const newPlayers = [...players];
    newPlayers[index][field] = value;
    setPlayers(newPlayers);
  };

  const addPlayer = () => {
    setPlayers([...players, { name: '', startStack: buyInValue, endStack: '' }]);
  };

  const removePlayer = (index) => {
    setPlayers(players.filter((_, i) => i !== index));
  };

  const checkStackDiscrepancy = () => {
    const discrepancy = totalStartingStack - totalEndingStack;
    if (discrepancy !== 0) {
      setDiscrepancy(discrepancy * coinValue);
      setShowDiscrepancyModal(true);
      return true;
    }
    return false;
  };

  const calculatePayouts = () => {
    if (checkStackDiscrepancy()) return;

    const totalPot = totalEndingStack * coinValue;
    setPotValue(totalPot);

    const playerResults = players.map(player => {
      const startingValue = player.startStack * coinValue;
      const endingValue = player.endStack * coinValue;
      const result = endingValue - startingValue;
      return { ...player, startingValue, endingValue, result };
    });

    const payouts = [];
    const winners = playerResults.filter(player => player.result > 0);
    const losers = playerResults.filter(player => player.result < 0);

    winners.forEach(winner => {
      losers.forEach(loser => {
        const amountToPay = Math.min(winner.result, Math.abs(loser.result));
        if (amountToPay > 0) {
          payouts.push(`${loser.name} should pay ${winner.name} €${amountToPay.toFixed(2)}`);
          winner.result -= amountToPay;
          loser.result += amountToPay;
        }
      });
    });

    setResults({ playerResults, payouts });
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" align="center" gutterBottom>
        Poker Score Calculator
      </Typography>
      <Typography variant="subtitle1" align="center" gutterBottom>
        Enter player details, coin value, and starting/ending stacks to calculate payouts.
      </Typography>

      <Box mb={3}>
        <TextField
          label="Coin Value (€)"
          type="number"
          variant="outlined"
          value={coinValue}
          onChange={(e) => setCoinValue(parseFloat(e.target.value))}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Buy-in Value (chips)"
          type="number"
          variant="outlined"
          value={buyInValue}
          onChange={(e) => setBuyInValue(parseFloat(e.target.value))}
          fullWidth
          margin="normal"
        />
      </Box>

      <Typography variant="h5" gutterBottom>
        Players
      </Typography>

      {players.map((player, index) => (
        <Box key={index} display="flex" alignItems="center" mb={2}>
          <TextField
            label="Name"
            value={player.name}
            onChange={(e) => handlePlayerChange(index, 'name', e.target.value)}
            margin="dense"
          />
          <TextField
            label="Starting Stack"
            type="number"
            value={player.startStack}
            onChange={(e) => handlePlayerChange(index, 'startStack', parseFloat(e.target.value))}
            margin="dense"
          />
          <TextField
            label="Ending Stack"
            type="number"
            value={player.endStack}
            onChange={(e) => handlePlayerChange(index, 'endStack', parseFloat(e.target.value))}
            margin="dense"
          />
          <Button variant="outlined" color="secondary" onClick={() => removePlayer(index)}>
            Remove
          </Button>
        </Box>
      ))}

      <Button variant="contained" color="primary" onClick={addPlayer} fullWidth>
        Add Player
      </Button>

      <Box mt={3}>
        <Typography>Total Starting Pot: {totalStartingStack}</Typography>
        <Typography>Total Ending Pot: {totalEndingStack}</Typography>
      </Box>

      <Button variant="contained" color="primary" onClick={calculatePayouts} fullWidth>
        Calculate
      </Button>

      {results.playerResults && (
        <Box mt={4}>
          <Typography variant="h6">Results</Typography>
          <Typography>Total Pot Value: €{potValue.toFixed(2)}</Typography>

          <TableContainer component={Paper}>
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

          <Typography variant="h6" mt={2}>
            Payouts
          </Typography>
          {results.payouts.length > 0 ? (
            results.payouts.map((payout, index) => <Typography key={index}>{payout}</Typography>)
          ) : (
            <Typography>No payouts necessary.</Typography>
          )}
        </Box>
      )}

      <Dialog open={showDiscrepancyModal} onClose={() => setShowDiscrepancyModal(false)}>
        <DialogTitle>Stack Discrepancy</DialogTitle>
        <DialogContent>
          <Typography>
            The starting and ending stacks are not equal. Discrepancy: €
            {Math.abs(discrepancy).toFixed(2)}. Adjust values before calculating.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDiscrepancyModal(false)} color="primary">
            OK, Adjust Values
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default App;
