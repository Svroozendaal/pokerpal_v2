// App.js
import React, { useState, useEffect } from 'react';


import { Typography, Button, Grid2 } from '@mui/material';
import AppContainer from './components/AppContainer';
import SetupInputs from './components/SetupInputs';
import PlayerInput from './components/PlayerInput';
import TotalStackDisplay from './components/TotalStackDisplay';
import ResultsTable from './components/ResultsTable';
import PayoutsDisplay from './components/PayoutsDisplay';
import DiscrepancyModal from './components/DiscrepancyModal';
import ResultsDialog from './components/ResultsDialog';
import darkTheme from './theme';
import ResultsDisplay from './components/ResultsDisplay';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';


function App() {
  const [players, setPlayers] = useState([{ name: '', startStack: '', endStack: '' }]);
  const [coinValue, setCoinValue] = useState('');
  const [buyInValue, setBuyInValue] = useState('');
  const [results, setResults] = useState({ playerResults: [], payouts: [] });
  const [potValue, setPotValue] = useState(0);
  const [discrepancy, setDiscrepancy] = useState(0);
  const [showDiscrepancyModal, setShowDiscrepancyModal] = useState(false);
  const [totalStartingStack, setTotalStartingStack] = useState(0);
  const [totalEndingStack, setTotalEndingStack] = useState(0);
  const [showResultsDialog, setShowResultsDialog] = useState(false); // State to control results popup
  

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

  const addPlayer = () => setPlayers([...players, { name: '', startStack: buyInValue, endStack: '' }]);

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

    const playerResults = players.map((player) => {
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
    setShowResultsDialog(true); // Show results popup
  };




// -------------- Styling below -------------
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AppContainer>
        <Grid2 container direction="column" spacing={4}>
          <Grid2 item>
            <Typography variant="h4" align="center" gutterBottom>
              Poker Score Calculator
            </Typography>
            <Typography variant="subtitle1" align="center" gutterBottom>
              Enter player details, coin value, and starting/ending stacks to calculate payouts.
            </Typography>
          </Grid2>

          <Grid2 item>
            <SetupInputs
              coinValue={coinValue}
              setCoinValue={setCoinValue}
              buyInValue={buyInValue}
              setBuyInValue={setBuyInValue}
              totalStartingStack={totalStartingStack}
              totalEndingStack={totalEndingStack}
              calculatePayouts={calculatePayouts}
            />
          </Grid2>

          <Grid2 item>
            <Typography variant="h5" gutterBottom>
              Players
            </Typography>
            {players.map((player, index) => (
              <PlayerInput
                key={index}
                player={player}
                index={index}
                handlePlayerChange={handlePlayerChange}
                removePlayer={() => setPlayers(players.filter((_, i) => i !== index))}
                buyInValue={buyInValue}
              />
            ))}
            <Button variant="contained" color="primary" onClick={addPlayer} fullWidth>
              Add Player
            </Button>
          </Grid2>

          {results.playerResults && results.playerResults.length > 0 && (
            <Grid2 item>
              <ResultsDisplay results={results} potValue={potValue} />
            </Grid2>
          )}

          <DiscrepancyModal
            open={showDiscrepancyModal}
            onClose={() => setShowDiscrepancyModal(false)}
            discrepancy={discrepancy}
          />

                    {/* Results Popup */}
          <ResultsDialog
              open={showResultsDialog}
              onClose={() => setShowResultsDialog(false)}
              results={results}
              potValue={potValue}
            />

        </Grid2>
      </AppContainer>
    </ThemeProvider>
  );
}

export default App;
