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
} from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

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
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const stacksEqual = totalStartingStack === totalEndingStack;

  return (
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
                        setSelectedCurrency(currency);
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

        <Box mt={2}>
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
        </Box>
      </CardContent>
    </Card>
  );
}

export default SetupInputs;
