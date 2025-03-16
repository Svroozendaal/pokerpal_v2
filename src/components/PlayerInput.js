import React from 'react';
import { Grid, TextField, IconButton, Card, CardContent, Box } from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';

function PlayerInput({ player, index, handlePlayerChange, removePlayer, buyInValue }) {
  const handleStackChange = (field, value) => {
    handlePlayerChange(index, field, value);
  };

  const StackInput = ({ field, label, value }) => (
    <TextField
      label={label}
      type="number"
      value={value}
      onChange={(e) => handleStackChange(field, e.target.value)}
      variant="outlined"
      fullWidth
      size="small"
      inputProps={{
        step: buyInValue
      }}
    />
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
