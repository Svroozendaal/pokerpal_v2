import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  IconButton,
} from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

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

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100); // Adjust based on when you want it to collapse
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const stacksEqual = totalStartingStack === totalEndingStack;

  return (
    <Box sx={{ position: 'sticky', top: 0, zIndex: 1000 }}>
      <Card
        sx={{
          maxWidth: 600,
          margin: 'auto',
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
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Coin Value (€)"
                    type="number"
                    variant="outlined"
                    value={coinValue}
                    onChange={(e) => setCoinValue(parseFloat(e.target.value))}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Buy-in Value (chips)"
                    type="number"
                    variant="outlined"
                    value={buyInValue}
                    onChange={(e) => setBuyInValue(parseFloat(e.target.value))}
                    fullWidth
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
    </Box>
  );
}

export default SetupInputs;
