import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Divider,
  Button,
  CircularProgress,
} from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import TelegramIcon from '@mui/icons-material/Telegram';

const db = getFirestore();

export default function GameView() {
  const { gameId } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const gameDoc = await getDoc(doc(db, 'games', gameId));
        if (gameDoc.exists()) {
          setGame({ id: gameDoc.id, ...gameDoc.data() });
        } else {
          setError('Game not found');
        }
      } catch (error) {
        console.error('Error fetching game:', error);
        setError('Error loading game');
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [gameId]);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `PokerPal Game: ${game.title}`,
          text: `Check out this poker game on PokerPal!`,
          url: url,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      // You could add a snackbar notification here
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(`Check out this poker game on PokerPal! ${window.location.href}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleTelegramShare = () => {
    const text = encodeURIComponent(`Check out this poker game on PokerPal! ${window.location.href}`);
    window.open(`https://t.me/share/url?url=&text=${text}`, '_blank');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          {game.title}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          {game.date.toDate().toLocaleDateString()}
        </Typography>

        <Box sx={{ my: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" gutterBottom>
                Game Summary
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Total Pot:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" align="right">
                    {game.currency.symbol}{game.potValue.toFixed(2)}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Coin Value:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" align="right">
                    {game.currency.symbol}{game.settings.coinValue}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Buy-in Value:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" align="right">
                    {game.settings.buyInValue} chips
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="h6" gutterBottom>
                Player Results
              </Typography>
              {game.results.map((player, index) => (
                <Typography 
                  key={index} 
                  variant="body2" 
                  color={player.result > 0 ? 'success.main' : player.result < 0 ? 'error.main' : 'text.primary'}
                  sx={{ mb: 0.5 }}
                >
                  {player.name}: {player.result > 0 ? '+' : ''}{game.currency.symbol}{player.result.toFixed(2)}
                </Typography>
              ))}
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          Payouts
        </Typography>
        {game.payouts.map((payout, index) => (
          <Typography key={index} variant="body2" sx={{ mb: 0.5 }}>
            {payout}
          </Typography>
        ))}

        <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<ShareIcon />}
            onClick={handleShare}
          >
            Share
          </Button>
          <Button
            variant="outlined"
            startIcon={<ContentCopyIcon />}
            onClick={handleCopyLink}
          >
            Copy Link
          </Button>
          <Button
            variant="outlined"
            startIcon={<WhatsAppIcon />}
            onClick={handleWhatsAppShare}
            color="success"
          >
            WhatsApp
          </Button>
          <Button
            variant="outlined"
            startIcon={<TelegramIcon />}
            onClick={handleTelegramShare}
            color="info"
          >
            Telegram
          </Button>
        </Box>
      </Paper>
    </Box>
  );
} 