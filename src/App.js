// App.js
import React, { useState, useEffect } from 'react';
import { Typography, Button, Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import AppContainer from './components/AppContainer';
import SetupInputs from './components/SetupInputs';
import PlayerInput from './components/PlayerInput';
import DiscrepancyModal from './components/DiscrepancyModal';
import ResultsDialog from './components/ResultsDialog';
import { darkTheme, lightTheme } from './theme';
import ResultsDisplay from './components/ResultsDisplay';
import ThemeToggle from './components/ThemeToggle';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';
import Login from './components/Login';
import Signup from './components/Signup';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [players, setPlayers] = useState([
    { name: '', startStack: '1000', endStack: '' },
    { name: '', startStack: '1000', endStack: '' },
    { name: '', startStack: '1000', endStack: '' }
  ]);
  const [coinValue, setCoinValue] = useState('0.01');
  const [buyInValue, setBuyInValue] = useState('1000');
  const [results, setResults] = useState({ playerResults: [], payouts: [] });
  const [potValue, setPotValue] = useState(0);
  const [discrepancy, setDiscrepancy] = useState(0);
  const [showDiscrepancyModal, setShowDiscrepancyModal] = useState(false);
  const [totalStartingStack, setTotalStartingStack] = useState(0);
  const [totalEndingStack, setTotalEndingStack] = useState(0);
  const [showResultsDialog, setShowResultsDialog] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState({ code: 'EUR', symbol: '€', name: 'Euro' });
  

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
      setDiscrepancy(discrepancy * parseFloat(coinValue));
      setShowDiscrepancyModal(true);
      return true;
    }
    return false;
  };

  const calculatePayouts = () => {
    if (checkStackDiscrepancy()) return;

    const totalPot = totalEndingStack * parseFloat(coinValue);
    setPotValue(totalPot);

    const playerResults = players.map((player, index) => {
      const startingValue = parseFloat(player.startStack) * parseFloat(coinValue);
      const endingValue = parseFloat(player.endStack) * parseFloat(coinValue);
      const result = endingValue - startingValue;
      return { 
        ...player, 
        name: player.name.trim() || `Player ${index + 1}`,
        startingValue, 
        endingValue, 
        result 
      };
    });

    const payouts = [];
    const winnersCopy = playerResults.filter(player => player.result > 0)
      .map(winner => ({ ...winner, remainingResult: winner.result }));
    const losersCopy = playerResults.filter(player => player.result < 0)
      .map(loser => ({ ...loser, remainingResult: loser.result }));

    winnersCopy.forEach(winner => {
      losersCopy.forEach(loser => {
        const amountToPay = Math.min(winner.remainingResult, Math.abs(loser.remainingResult));
        if (amountToPay > 0) {
          payouts.push(`${loser.name} should pay ${winner.name} ${selectedCurrency.symbol}${amountToPay.toFixed(2)}`);
          winner.remainingResult -= amountToPay;
          loser.remainingResult += amountToPay;
        }
      });
    });

    setResults({ playerResults, payouts, currency: selectedCurrency });
    setShowResultsDialog(true);
  };

  const handleCurrencyChange = (newCurrency) => {
    setSelectedCurrency(newCurrency);
  };

// -------------- Styling below -------------
  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/*"
              element={
                <AppContainer>
                  <ThemeToggle isDarkMode={isDarkMode} toggleTheme={() => setIsDarkMode(!isDarkMode)} />
                  <Grid container direction="column" spacing={4}>
                    <Grid item>
                      <Typography 
                        variant="h4" 
                        align="center" 
                        gutterBottom
                        sx={{
                          mb: 1,
                          background: 'linear-gradient(45deg, #1f957d 30%, #2ab094 90%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          textShadow: '0px 2px 4px rgba(0,0,0,0.1)',
                          fontWeight: 700,
                        }}
                      >
                        PokerPal
                      </Typography>
                      <Typography 
                        variant="subtitle1" 
                        align="center" 
                        gutterBottom
                        sx={{
                          maxWidth: '600px',
                          mx: 'auto',
                          opacity: 0.9,
                        }}
                      >
                        Enter player details, coin value, and starting/ending stacks to calculate payouts.
                      </Typography>
                    </Grid>

                    <Grid item>
                      <Grid container spacing={4}>
                        {/* Setup Section */}
                        <Grid item xs={12} md={4}>
                          <Box sx={{ 
                            position: { md: 'sticky' },
                            top: { md: 24 },
                            height: 'fit-content',
                            zIndex: 1
                          }}>
                            <SetupInputs
                              coinValue={coinValue}
                              setCoinValue={setCoinValue}
                              buyInValue={buyInValue}
                              setBuyInValue={setBuyInValue}
                              totalStartingStack={totalStartingStack}
                              totalEndingStack={totalEndingStack}
                              calculatePayouts={calculatePayouts}
                              selectedCurrency={selectedCurrency}
                              onCurrencyChange={handleCurrencyChange}
                            />
                          </Box>
                        </Grid>

                        {/* Players Section */}
                        <Grid item xs={12} md={8}>
                          <Box>
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
                            <Button 
                              variant="contained" 
                              color="primary" 
                              onClick={addPlayer} 
                              fullWidth
                              sx={{ 
                                mt: 1,
                                mb: 2
                              }}
                            >
                              Add Player
                            </Button>
                          </Box>
                        </Grid>
                      </Grid>
                    </Grid>

                    {/* Results Section */}
                    {results.playerResults && results.playerResults.length > 0 && (
                      <Grid item>
                        <ResultsDisplay 
                          results={results} 
                          potValue={potValue} 
                          currency={selectedCurrency}
                        />
                      </Grid>
                    )}

                    <DiscrepancyModal
                      open={showDiscrepancyModal}
                      onClose={() => setShowDiscrepancyModal(false)}
                      discrepancy={discrepancy}
                      currency={selectedCurrency}
                    />

                    <ResultsDialog
                      open={showResultsDialog}
                      onClose={() => setShowResultsDialog(false)}
                      results={results}
                      potValue={potValue}
                      currency={selectedCurrency}
                    />
                  </Grid>
                </AppContainer>
              }
            />
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
