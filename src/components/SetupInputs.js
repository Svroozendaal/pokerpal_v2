import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Typography,
  Card,
  CardContent,
  Button,
  IconButton,
  Grid,
  Select,
  MenuItem,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const currencies = [
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
  { code: 'SEK', symbol: 'kr', name: 'Swedish Krona' },
  { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone' },
  { code: 'DKK', symbol: 'kr', name: 'Danish Krone' },
];

function SetupInputs({
  coinValue,
  setCoinValue,
  buyInValue,
  setBuyInValue,
  totalStartingStack,
  totalEndingStack,
  calculatePayouts,
  onNewGame,
  hasUnsavedChanges,
  gameTitle,
  setGameTitle,
  selectedCurrency,
  onCurrencyChange,
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [newGameDialogOpen, setNewGameDialogOpen] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const stacksEqual = totalStartingStack === totalEndingStack;

  const handleNewGameClick = () => {
    setNewGameDialogOpen(true);
  };

  const handleNewGameConfirm = () => {
    setNewGameDialogOpen(false);
    if (onNewGame) {
      onNewGame();
    }
  };

  const handleSignIn = () => {
    navigate('/login');
  };

  return (
    <>
      <Card
        sx={{
          boxShadow: 3,
          transition: '0.3s',
          ...(isCollapsed && isSticky && { maxHeight: '80px', overflow: 'hidden' }),
        }}
      >
        <CardContent>
          {/* Title and Collapse Button */}
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" gutterBottom>
              Setup Inputs
            </Typography>
            <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
              {isCollapsed ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
            </IconButton>
          </Box>

          {/* Collapsible Section */}
          {!isCollapsed && (
            <Box>
              <Grid container spacing={2}>
                {/* Game Title Input - Only for logged in users */}
                {currentUser && (
                  <Grid item xs={12}>
                    <TextField
                      label="Game Title"
                      placeholder="Enter a name for your game"
                      variant="outlined"
                      value={gameTitle}
                      onChange={(e) => setGameTitle(e.target.value)}
                      fullWidth
                      size="small"
                      sx={{ mb: 1 }}
                    />
                  </Grid>
                )}

                <Grid item xs={12}>
                  <Grid container spacing={1}>
                    <Grid item xs={8}>
                      <TextField
                        label="Coin Value"
                        type="number"
                        variant="outlined"
                        value={coinValue}
                        onChange={(e) => setCoinValue(parseFloat(e.target.value))}
                        fullWidth
                        size="small"
                        inputProps={{
                          step: 0.01
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              {selectedCurrency.symbol}
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& input[type=number]::-webkit-inner-spin-button': {
                            opacity: 1,
                            position: 'absolute',
                            right: 4,
                            height: '100%',
                            width: 20,
                            cursor: 'pointer',
                          },
                          '& input[type=number]::-webkit-outer-spin-button': {
                            opacity: 1,
                            position: 'absolute',
                            right: 4,
                            height: '100%',
                            width: 20,
                            cursor: 'pointer',
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Select
                        value={selectedCurrency.code}
                        onChange={(e) => {
                          const currency = currencies.find(c => c.code === e.target.value);
                          onCurrencyChange(currency);
                        }}
                        size="small"
                        fullWidth
                      >
                        {currencies.map((currency) => (
                          <MenuItem key={currency.code} value={currency.code}>
                            {currency.code}
                          </MenuItem>
                        ))}
                      </Select>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Buy-in Value (chips)"
                    type="number"
                    variant="outlined"
                    value={buyInValue}
                    onChange={(e) => setBuyInValue(parseFloat(e.target.value))}
                    fullWidth
                    size="small"
                    sx={{
                      '& input[type=number]::-webkit-inner-spin-button': {
                        opacity: 1,
                        position: 'absolute',
                        right: 4,
                        height: '100%',
                        width: 20,
                        cursor: 'pointer',
                      },
                      '& input[type=number]::-webkit-outer-spin-button': {
                        opacity: 1,
                        position: 'absolute',
                        right: 4,
                        height: '100%',
                        width: 20,
                        cursor: 'pointer',
                      },
                    }}
                  />
                </Grid>
              </Grid>
              <Box mt={2}>
                <Typography variant="body2" color="text.secondary">
                  Enter the coin value and buy-in chips for the setup.
                </Typography>
              </Box>
            </Box>
          )}

          {/* Total Stacks and Submit Button */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt={isCollapsed ? 0 : 2}
          >
            <Typography variant="body2" color="text.secondary">
              Total Starting Pot: <strong>{totalStartingStack}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Ending Pot: <strong>{totalEndingStack}</strong>
            </Typography>
          </Box>

          <Box mt={2} display="flex" gap={2}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              disabled={!stacksEqual}
              onClick={calculatePayouts}
              sx={{
                opacity: stacksEqual ? 1 : 0.5,
                transition: 'opacity 0.3s',
              }}
            >
              Calculate
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleNewGameClick}
              sx={{ minWidth: '120px' }}
            >
              New Game
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* New Game Dialog */}
      <Dialog
        open={newGameDialogOpen}
        onClose={() => setNewGameDialogOpen(false)}
        aria-labelledby="new-game-dialog-title"
      >
        <DialogTitle id="new-game-dialog-title">
          {currentUser ? "Start New Game?" : "Sign in to Save Games"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {currentUser
              ? hasUnsavedChanges
                ? "Would you like to save the current game before starting a new one?"
                : "Are you sure you want to start a new game? This will clear all current settings."
              : "Sign in to save your games and access them later. Starting a new game will clear all current settings."}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewGameDialogOpen(false)} color="primary">
            Cancel
          </Button>
          {currentUser ? (
            <>
              {hasUnsavedChanges && (
                <Button onClick={() => setNewGameDialogOpen(false)} color="primary">
                  Save First
                </Button>
              )}
              <Button onClick={handleNewGameConfirm} color="secondary">
                Start New Game
              </Button>
            </>
          ) : (
            <>
              <Button onClick={handleNewGameConfirm} color="secondary">
                Continue Without Saving
              </Button>
              <Button onClick={handleSignIn} color="primary" variant="contained">
                Sign In
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}

export default SetupInputs;
