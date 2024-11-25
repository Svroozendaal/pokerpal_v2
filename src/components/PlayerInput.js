import React from 'react';
import { Grid, TextField, Button, Card, CardContent, Typography } from '@mui/material';

function PlayerInput({ player, index, handlePlayerChange, removePlayer }) {
  return (
    <Card sx={{ marginBottom: 2, boxShadow: 2 }}>
      <CardContent>
        <Typography variant="subtitle1" sx={{ marginBottom: 1 }}>
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              label="Name"
              value={player.name}
              onChange={(e) => handlePlayerChange(index, 'name', e.target.value)}
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Starting Stack"
                  type="number"
                  value={player.startStack}
                  onChange={(e) => handlePlayerChange(index, 'startStack', parseFloat(e.target.value))}
                  variant="outlined"
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Ending Stack"
                  type="number"
                  value={player.endStack}
                  onChange={(e) => handlePlayerChange(index, 'endStack', parseFloat(e.target.value))}
                  variant="outlined"
                  fullWidth
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={12}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={removePlayer}
              fullWidth
              sx={{ height: '100%' }}
            >
              Remove
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default PlayerInput;
