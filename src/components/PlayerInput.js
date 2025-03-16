import React from 'react';
import { Grid, TextField, IconButton, Card, CardContent, Box } from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';

function PlayerInput({ player, index, handlePlayerChange, removePlayer, buyInValue }) {
  const handleStackChange = (field, value) => {
    // Ensure value is a number and not less than 0
    const newValue = Math.max(0, parseFloat(value) || 0);
    handlePlayerChange(index, field, newValue.toString());
  };

  const numberInputSx = {
    '& input[type=number]': {
      MozAppearance: 'textfield',
      '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
        WebkitAppearance: 'inner-spin-button',
        opacity: 1,
        margin: 0,
        height: '80%',
        position: 'absolute',
        top: '10%',
        right: 8,
        cursor: 'pointer',
        color: 'rgba(0, 0, 0, 0.54)',
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.04)'
        }
      }
    }
  };

  return (
    <Card sx={{ marginBottom: 0.5, boxShadow: 1 }}>
      <CardContent sx={{ py: 0.5, px: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: -0.5, marginRight: -0.5 }}>
          <IconButton 
            size="small"
            onClick={removePlayer}
            color="secondary"
            sx={{ p: 0.25 }}
          >
            <RemoveIcon fontSize="small" />
          </IconButton>
        </Box>
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              label="Name"
              value={player.name}
              onChange={(e) => handlePlayerChange(index, 'name', e.target.value)}
              variant="outlined"
              fullWidth
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid container spacing={1}>
              <Grid item xs={6} sx={{ position: 'relative' }}>
                <TextField
                  label="Starting Stack"
                  type="number"
                  value={player.startStack}
                  onChange={(e) => handleStackChange('startStack', e.target.value)}
                  variant="outlined"
                  fullWidth
                  size="small"
                  inputProps={{
                    step: buyInValue,
                    min: 0,
                    inputMode: 'numeric',
                    pattern: '[0-9]*'
                  }}
                  sx={numberInputSx}
                />
              </Grid>
              <Grid item xs={6} sx={{ position: 'relative' }}>
                <TextField
                  label="Ending Stack"
                  type="number"
                  value={player.endStack}
                  onChange={(e) => handleStackChange('endStack', e.target.value)}
                  variant="outlined"
                  fullWidth
                  size="small"
                  inputProps={{
                    step: buyInValue,
                    min: 0,
                    inputMode: 'numeric',
                    pattern: '[0-9]*'
                  }}
                  sx={numberInputSx}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default PlayerInput;
