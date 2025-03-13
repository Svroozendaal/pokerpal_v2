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
import Navigation from './components/Navigation';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Signup from './components/Signup';
import SaveGameDialog from './components/SaveGameDialog';
import GameHistory from './components/GameHistory';
import Account from './components/Account';
import GameView from './components/GameView';
import Admin from './components/Admin';
import Terms from './components/Terms';

function MainContent({ isDarkMode, setIsDarkMode, ...props }) {
  const { currentUser } = useAuth();
  
  return (
    <>
      <Box sx={{ mt: 7 }}> {/* Reduced margin top for smaller navbar */}
        <Grid container direction="column" spacing={4}>
          <Grid item>
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
                  <SetupInputs {...props} />
                </Box>
              </Grid>

              {/* Players Section */}
              <Grid item xs={12} md={8}>
                <Box>
                  {props.players.map((player, index) => (
                    <PlayerInput
                      key={index}
                      player={player}
                      index={index}
                      handlePlayerChange={props.handlePlayerChange}
                      removePlayer={() => props.setPlayers(props.players.filter((_, i) => i !== index))}
                      buyInValue={props.buyInValue}
                    />
                  ))}
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={props.addPlayer} 
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
          {props.results.playerResults && props.results.playerResults.length > 0 && (
            <Grid item>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <ResultsDisplay 
                  results={props.results} 
                  potValue={props.potValue} 
                  currency={props.selectedCurrency}
                />
                {currentUser && (
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => props.setShowSaveDialog(true)}
                    sx={{ alignSelf: 'center', mt: 2 }}
                  >
                    Save This Game
                  </Button>
                )}
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>

      <DiscrepancyModal
        open={props.showDiscrepancyModal}
        onClose={() => props.setShowDiscrepancyModal(false)}
        discrepancy={props.discrepancy}
        currency={props.selectedCurrency}
      />

      <ResultsDialog
        open={props.showResultsDialog}
        onClose={() => props.setShowResultsDialog(false)}
        results={props.results}
        potValue={props.potValue}
        currency={props.selectedCurrency}
      />

      <SaveGameDialog
        open={props.showSaveDialog}
        onClose={(saved) => {
          props.setShowSaveDialog(false);
          if (saved) {
            // Optionally show a success message or redirect to history
          }
        }}
        results={props.results}
        potValue={props.potValue}
        currency={props.selectedCurrency}
        coinValue={props.coinValue}
        buyInValue={props.buyInValue}
        players={props.players}
      />
    </>
  );
}

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
  const [showSaveDialog, setShowSaveDialog] = useState(false);

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

  const mainProps = {
    players,
    setPlayers,
    coinValue,
    setCoinValue,
    buyInValue,
    setBuyInValue,
    results,
    potValue,
    selectedCurrency,
    showDiscrepancyModal,
    setShowDiscrepancyModal,
    discrepancy,
    showResultsDialog,
    setShowResultsDialog,
    handlePlayerChange,
    addPlayer,
    calculatePayouts,
    handleCurrencyChange,
    totalStartingStack,
    totalEndingStack,
    showSaveDialog,
    setShowSaveDialog,
  };

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <Navigation isDarkMode={isDarkMode} toggleTheme={() => setIsDarkMode(!isDarkMode)} />
          <Routes>
            <Route path="/" element={
              <AppContainer>
                <MainContent 
                  isDarkMode={isDarkMode} 
                  setIsDarkMode={setIsDarkMode}
                  {...mainProps}
                />
              </AppContainer>
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/history" element={<GameHistory />} />
            <Route path="/account" element={<Account />} />
            <Route path="/game/:gameId" element={<GameView />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
