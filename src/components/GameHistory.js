import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Divider,
  Snackbar,
  Alert,
} from '@mui/material';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import ShareIcon from '@mui/icons-material/Share';
import VisibilityIcon from '@mui/icons-material/Visibility';

export default function GameHistory() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [resultsDialogOpen, setResultsDialogOpen] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGames = async () => {
      if (!currentUser) {
        setError('Please log in to view your game history');
        setLoading(false);
        return;
      }
      
      try {
        console.log('Fetching games for user:', currentUser.uid);
        const gamesRef = collection(db, 'games');
        const q = query(
          gamesRef,
          where('userId', '==', currentUser.uid),
          orderBy('date', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        console.log('Query snapshot:', querySnapshot.size, 'games found');
        
        const gamesData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          console.log('Game data:', { id: doc.id, title: data.title });
          return {
            id: doc.id,
            ...data,
            date: data.date.toDate()
          };
        });
        
        setGames(gamesData);
      } catch (error) {
        console.error('Error fetching games:', error);
        setError(`Failed to load games: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [currentUser]);

  const handleRowClick = (game) => {
    setSelectedGame(game);
    setResultsDialogOpen(true);
  };

  const handleShare = async (gameId, e) => {
    e.stopPropagation();
    if (!currentUser) {
      setError('You must be logged in to share games');
      return;
    }

    try {
      const shareUrl = `${window.location.origin}/game/${gameId}`;
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

  const handleViewGame = (gameId, e) => {
    e.stopPropagation();
    navigate(`/game/${gameId}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 12 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 12, p: 3 }}>
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
        {!currentUser && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/login')}
            sx={{ mt: 2 }}
          >
            Log In
          </Button>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', mt: 12, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Game History
      </Typography>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Pot</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {games.map((game) => (
              <TableRow
                key={game.id}
                hover
                onClick={() => handleRowClick(game)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell>{game.title}</TableCell>
                <TableCell>{game.date.toLocaleDateString()}</TableCell>
                <TableCell>{game.currency.symbol}{game.potValue.toFixed(2)}</TableCell>
                <TableCell align="right">
                  <Tooltip title={currentUser ? "Share game" : "Login to share"}>
                    <span>
                      <IconButton
                        size="small"
                        onClick={(e) => handleShare(game.id, e)}
                        disabled={!currentUser}
                      >
                        <ShareIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Tooltip title="View game">
                    <IconButton
                      size="small"
                      onClick={(e) => handleViewGame(game.id, e)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Results Dialog */}
      <Dialog
        open={resultsDialogOpen}
        onClose={() => setResultsDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedGame && (
          <>
            <DialogTitle>{selectedGame.title}</DialogTitle>
            <DialogContent>
              <Grid container spacing={4} sx={{ mt: 1 }}>
                {/* Game Summary */}
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Game Summary
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>
                      Total Pot: {selectedGame.currency.symbol}{selectedGame.potValue.toFixed(2)}
                    </Typography>
                    <Typography>
                      Coin Value: {selectedGame.currency.symbol}{selectedGame.settings.coinValue}
                    </Typography>
                    <Typography>
                      Buy-in Value: {selectedGame.settings.buyInValue} chips
                    </Typography>
                  </Box>
                </Grid>

                {/* Player Results */}
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Player Results
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {selectedGame.results.map((player, index) => (
                      <Typography
                        key={index}
                        color={player.result > 0 ? 'success.main' : player.result < 0 ? 'error.main' : 'text.primary'}
                      >
                        {player.name}: {player.result > 0 ? '+' : ''}{selectedGame.currency.symbol}{player.result.toFixed(2)}
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
                    {selectedGame.payouts.map((payout, index) => (
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
                    {selectedGame.settings.players.map((player, index) => (
                      <Typography key={index}>
                        {player.name}: {player.startStack} → {player.endStack} chips
                      </Typography>
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setResultsDialogOpen(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

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
    </Box>
  );
} 