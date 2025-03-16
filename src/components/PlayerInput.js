import React from 'react';
import { Grid, TextField, IconButton, Card, CardContent, Box } from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

function PlayerInput({ player, index, handlePlayerChange, removePlayer, buyInValue }) {
  const handleStackChange = (field, value) => {
    // Ensure value is a number and not less than 0
    const newValue = Math.max(0, parseFloat(value) || 0);
    handlePlayerChange(index, field, newValue.toString());
  };

  const handleIncrement = (field) => {
    const currentValue = parseFloat(player[field]) || 0;
    handleStackChange(field, currentValue + parseFloat(buyInValue));
  };

  const handleDecrement = (field) => {
    const currentValue = parseFloat(player[field]) || 0;
    handleStackChange(field, currentValue - parseFloat(buyInValue));
  };

  const numberInputSx = {
    '& input[type=number]': {
      MozAppearance: 'textfield',
      '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
        opacity: 1,
        position: 'absolute',
        right: 4,
        height: '100%',
        width: 20,
        cursor: 'pointer',
      }
    }
  };

  const StackInput = ({ field, label, value }) => (
    <Box sx={{ position: 'relative' }}>
      <TextField
        label={label}
        type="number"
        value={value}
        onChange={(e) => handleStackChange(field, e.target.value)}
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
      <Box sx={{ 
        position: 'absolute', 
        right: 2, 
        top: '50%', 
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: '2px'
      }}>
        <IconButton
          size="small"
          onClick={() => handleIncrement(field)}
          sx={{ 
            p: 0.3,
            minWidth: '24px',
            minHeight: '24px',
            bgcolor: 'background.paper',
            '&:hover': {
              bgcolor: 'action.hover'
            }
          }}
        >
          <AddCircleOutlineIcon sx={{ fontSize: '1rem' }} />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => handleDecrement(field)}
          sx={{ 
            p: 0.3,
            minWidth: '24px',
            minHeight: '24px',
            bgcolor: 'background.paper',
            '&:hover': {
              bgcolor: 'action.hover'
            }
          }}
        >
          <RemoveCircleOutlineIcon sx={{ fontSize: '1rem' }} />
        </IconButton>
      </Box>
    </Box>
  );

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
              <Grid item xs={6}>
                <StackInput
                  field="startStack"
                  label="Starting Stack"
                  value={player.startStack}
                />
              </Grid>
              <Grid item xs={6}>
                <StackInput
                  field="endStack"
                  label="Ending Stack"
                  value={player.endStack}
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
