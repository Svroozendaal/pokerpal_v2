import React, { useCallback, useState, useRef } from 'react';
import { Grid, TextField, IconButton, Card, CardContent, Box } from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

function PlayerInput({ player, index, handlePlayerChange, removePlayer, buyInValue }) {
  const [localValue, setLocalValue] = useState({
    startStack: player.startStack,
    endStack: player.endStack
  });
  const timeoutRef = useRef(null);

  const handleStackChange = useCallback((field, value) => {
    setLocalValue(prev => ({ ...prev, [field]: value }));
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      handlePlayerChange(index, field, value);
    }, 500);
  }, [index, handlePlayerChange]);

  const handleIncrement = useCallback((field) => {
    const currentValue = parseFloat(localValue[field]) || 0;
    const newValue = currentValue + parseFloat(buyInValue);
    setLocalValue(prev => ({ ...prev, [field]: newValue }));
    handlePlayerChange(index, field, newValue);
  }, [index, localValue, buyInValue, handlePlayerChange]);

  const handleDecrement = useCallback((field) => {
    const currentValue = parseFloat(localValue[field]) || 0;
    const newValue = Math.max(0, currentValue - parseFloat(buyInValue));
    setLocalValue(prev => ({ ...prev, [field]: newValue }));
    handlePlayerChange(index, field, newValue);
  }, [index, localValue, buyInValue, handlePlayerChange]);

  // Clean up timeout on unmount
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Update local value when prop changes
  React.useEffect(() => {
    setLocalValue({
      startStack: player.startStack,
      endStack: player.endStack
    });
  }, [player.startStack, player.endStack]);

  const StackInput = useCallback(({ field, label }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <TextField
        label={label}
        type="number"
        value={localValue[field]}
        onChange={(e) => handleStackChange(field, e.target.value)}
        fullWidth
        size="small"
        inputProps={{
          step: buyInValue,
          min: 0
        }}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <IconButton
          size="small"
          onClick={() => handleIncrement(field)}
          sx={{ padding: 0 }}
        >
          <KeyboardArrowUpIcon />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => handleDecrement(field)}
          sx={{ padding: 0 }}
        >
          <KeyboardArrowDownIcon />
        </IconButton>
      </Box>
    </Box>
  ), [localValue, handleStackChange, handleIncrement, handleDecrement, buyInValue]);

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              label="Name"
              value={player.name}
              onChange={(e) => handlePlayerChange(index, 'name', e.target.value)}
              fullWidth
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <StackInput
              field="startStack"
              label="Starting Stack"
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <StackInput
              field="endStack"
              label="Ending Stack"
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <IconButton onClick={() => removePlayer(index)} color="error">
              <RemoveIcon />
            </IconButton>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default React.memo(PlayerInput);
