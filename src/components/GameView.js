import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Button,
  Grid,
  Divider,
  IconButton,
  Tooltip,
  Snackbar,
} from '@mui/material';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShareIcon from '@mui/icons-material/Share';

export default function GameView() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shareSuccess, setShareSuccess] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const gameDoc = await getDoc(doc(db, 'games', gameId));
        if (!gameDoc.exists()) {
          setError('Game not found');
          return;
        }
        setGame({
          id: gameDoc.id,
          ...gameDoc.data(),
          date: gameDoc.data().date.toDate()
        });
      } catch (error) {
        console.error('Error fetching game:', error);
        setError('Failed to load game');
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [gameId]);

  const handleShare = async () => {
    if (!currentUser) {
      setError('You must be logged in to share games');
      return;
    }

    try {
      const shareUrl = window.location.href;
      if (navigator.share) {
        await navigator.share({
          title: 'PokerPal Game',
          text: 'Check out this poker game on PokerPal!',
          url: shareUrl
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setShareSuccess(true);
      }
    } catch (error) {
      console.error('Failed to share:', error);
      setError('Failed to share game');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 12, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 12 }}>
          <Alert severity="error">{error}</Alert>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/')}
            sx={{ mt: 2 }}
          >
            Back to Home
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 12, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <IconButton onClick={() => navigate('/')} sx={{ mr: 2 }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
              {game.title}
            </Typography>
            <Tooltip title={currentUser ? "Share game" : "Login to share"}>
              <span>
                <IconButton 
                  onClick={handleShare}
                  disabled={!currentUser}
                >
                  <ShareIcon />
                </IconButton>
              </span>
            </Tooltip>
          </Box>

          <Typography color="text.secondary" gutterBottom>
            Date: {game.date.toLocaleDateString()}
          </Typography>

          <Grid container spacing={4} sx={{ mt: 2 }}>
            {/* Game Summary */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Game Summary
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography>
                  Total Pot: {game.currency.symbol}{game.potValue.toFixed(2)}
                </Typography>
                <Typography>
                  Coin Value: {game.currency.symbol}{game.settings.coinValue}
                </Typography>
                <Typography>
                  Buy-in Value: {game.settings.buyInValue} chips
                </Typography>
              </Box>
            </Grid>

            {/* Player Results */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Player Results
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {game.results.map((player, index) => (
                  <Typography
                    key={index}
                    color={player.result > 0 ? 'success.main' : player.result < 0 ? 'error.main' : 'text.primary'}
                  >
                    {player.name}: {player.result > 0 ? '+' : ''}{game.currency.symbol}{player.result.toFixed(2)}
                  </Typography>
                ))}
              </Box>
            </Grid>

            {/* Payouts */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Payouts
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {game.payouts.map((payout, index) => (
                  <Typography key={index}>{payout}</Typography>
                ))}
              </Box>
            </Grid>

            {/* Player Stacks */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Player Stacks
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {game.settings.players.map((player, index) => (
                  <Typography key={index}>
                    {player.name}: {player.startStack} → {player.endStack} chips
                  </Typography>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {/* Share Success Snackbar */}
      <Snackbar
        open={shareSuccess}
        autoHideDuration={3000}
        onClose={() => setShareSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Game link copied to clipboard!
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      {error && (
        <Snackbar
          open={!!error}
          autoHideDuration={3000}
          onClose={() => setError(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      )}
    </Container>
  );
} 