import React, { useCallback } from 'react';
import { Grid, TextField, IconButton, Card, CardContent, Box } from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

function PlayerInput({ player, index, handlePlayerChange, removePlayer, buyInValue }) {
  const handleIncrement = useCallback((field) => {
    const currentValue = parseFloat(player[field]) || 0;
    const newValue = currentValue + parseFloat(buyInValue);
    handlePlayerChange(index, field, newValue);
  }, [index, player, buyInValue, handlePlayerChange]);

  const handleDecrement = useCallback((field) => {
    const currentValue = parseFloat(player[field]) || 0;
    const newValue = Math.max(0, currentValue - parseFloat(buyInValue));
    handlePlayerChange(index, field, newValue);
  }, [index, player, buyInValue, handlePlayerChange]);

  const StackInput = useCallback(({ field, label }) => (
    <Box sx={{ position: 'relative' }}>
      <TextField
        label={label}
        type="number"
        value={player[field]}
        onChange={(e) => handlePlayerChange(index, field, e.target.value)}
        variant="outlined"
        fullWidth
        size="small"
        sx={{
          '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
            WebkitAppearance: 'none',
            margin: 0
          },
          '& input[type=number]': {
            MozAppearance: 'textfield'
          }
        }}
      />
      <Box sx={{ 
        position: 'absolute', 
        right: 2, 
        top: '50%', 
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        pointerEvents: 'none'
      }}>
        <IconButton
          size="small"
          onClick={() => handleIncrement(field)}
          sx={{ 
            p: 0.3,
            padding: '0px',
            minWidth: '24px',
            minHeight: '0px',
            bgcolor: 'rgba(26, 38, 51, 0)',
            borderRadius: '0%',
            bgcolor: 'background.paper',
            '&:hover': {
              bgcolor: 'action.hover'
            },
            pointerEvents: 'auto'
          }}
        >
          <KeyboardArrowUpIcon sx={{ fontSize: '1rem' }} />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => handleDecrement(field)}
          sx={{ 
            p: 0.3,
            padding: '0px',
            minWidth: '24px',
            minHeight: '0px',
            bgcolor: 'rgba(26, 38, 51, 0)',
            borderRadius: '0%',
            bgcolor: 'background.paper',
            '&:hover': {
              bgcolor: 'action.hover'
            },
            pointerEvents: 'auto'
          }}
        >
          <KeyboardArrowDownIcon sx={{ fontSize: '1rem' }} />
        </IconButton>
      </Box>
    </Box>
  ), [handleIncrement, handleDecrement, player, index, handlePlayerChange]);

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
              placeholder={`Player ${index + 1}`}
              onChange={(e) => handlePlayerChange(index, 'name', e.target.value)}
              variant="outlined"
              fullWidth
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <StackInput
                  field="startStack"
                  label="Starting Stack"
                />
              </Grid>
              <Grid item xs={6}>
                <StackInput
                  field="endStack"
                  label="Ending Stack"
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default React.memo(PlayerInput);
