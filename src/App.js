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
import NavBar from './components/NavBar';
import Account from './components/Account';
import History from './components/History';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Signup from './components/Signup';

function MainContent() {
  const [players, setPlayers] = useState([]);
  const [buyIn, setBuyIn] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [showDiscrepancyModal, setShowDiscrepancyModal] = useState(false);
  const [discrepancyAmount, setDiscrepancyAmount] = useState(0);

  return (
    <Box sx={{ width: '100%', maxWidth: 800, margin: '0 auto', p: 2 }}>
      <DiscrepancyModal
        open={showDiscrepancyModal}
        onClose={() => setShowDiscrepancyModal(false)}
        discrepancyAmount={discrepancyAmount}
      />
      <ResultsDialog
        open={showResults}
        onClose={() => setShowResults(false)}
        players={players}
      />
      <SetupInputs
        buyIn={buyIn}
        setBuyIn={setBuyIn}
        players={players}
        setPlayers={setPlayers}
        setShowResults={setShowResults}
        setShowDiscrepancyModal={setShowDiscrepancyModal}
        setDiscrepancyAmount={setDiscrepancyAmount}
      />
    </Box>
  );
}

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const theme = isDarkMode ? darkTheme : lightTheme;

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <AppContainer>
            <NavBar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
            <Routes>
              <Route path="/" element={<MainContent />} />
              <Route path="/account" element={<Account />} />
              <Route path="/history" element={<History />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </AppContainer>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
