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
          where('userId', '==', currentUser.uid)
        );
        
        const querySnapshot = await getDocs(q);
        console.log('Query snapshot:', querySnapshot.size, 'games found');
        
        const gamesData = querySnapshot.docs
          .map(doc => {
            const data = doc.data();
            console.log('Game data:', { id: doc.id, title: data.title });
            return {
              id: doc.id,
              ...data,
              date: data.date.toDate()
            };
          })
          .sort((a, b) => b.date - a.date); // Sort in memory instead of using orderBy
        
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
            <DialogTitle>
              <Typography 
                variant="h4" 
                align="center"
                sx={{
                  mb: 2,
                  background: 'linear-gradient(45deg, #1f957d 30%, #2ab094 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0px 2px 4px rgba(0,0,0,0.1)',
                  fontWeight: 700,
                }}
              >
                PokerPal
              </Typography>
              <Typography variant="h6" align="center">
                {selectedGame.title}
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Total Pot Value: {selectedGame.currency.symbol}{selectedGame.potValue.toFixed(2)}
                </Typography>
              </Box>

              <TableContainer>
                <Table size="small" sx={{ '& td, & th': { fontSize: '0.875rem' } }}>
                  <TableHead>
                    <TableRow>
                      <TableCell 
                        sx={{ 
                          py: 1,
                          bgcolor: 'action.hover',
                          fontWeight: 600,
                          borderBottom: 2,
                          width: '35%'
                        }}
                      >
                        Name
                      </TableCell>
                      <TableCell 
                        sx={{ 
                          py: 1,
                          bgcolor: 'action.hover',
                          fontWeight: 600,
                          borderBottom: 2,
                          width: '20%'
                        }}
                      >
                        Starting
                      </TableCell>
                      <TableCell 
                        sx={{ 
                          py: 1,
                          bgcolor: 'action.hover',
                          fontWeight: 600,
                          borderBottom: 2,
                          width: '20%'
                        }}
                      >
                        Ending
                      </TableCell>
                      <TableCell 
                        sx={{ 
                          py: 1,
                          bgcolor: 'action.hover',
                          fontWeight: 600,
                          borderBottom: 2,
                          width: '25%'
                        }}
                      >
                        Result
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedGame.results.map((player, index) => (
                      <TableRow key={index}>
                        <TableCell sx={{ py: 1 }}>{player.name}</TableCell>
                        <TableCell sx={{ py: 1 }}>{selectedGame.currency.symbol}{player.startingValue.toFixed(2)}</TableCell>
                        <TableCell sx={{ py: 1 }}>{selectedGame.currency.symbol}{player.endingValue.toFixed(2)}</TableCell>
                        <TableCell sx={{ py: 1 }}>{selectedGame.currency.symbol}{player.result.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ mt: 3, mb: 2 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontSize: '1.1rem', 
                    fontWeight: 600,
                    color: 'primary.main',
                    mb: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  💰 Payouts
                </Typography>
                <Box sx={{ 
                  bgcolor: 'background.paper', 
                  p: 2, 
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider'
                }}>
                  {selectedGame.payouts.map((payout, index) => (
                    <Typography 
                      key={index}
                      variant="body2"
                      sx={{ mb: 1 }}
                    >
                      {payout}
                    </Typography>
                  ))}
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mt: 3, mb: 2 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontSize: '1.1rem', 
                    fontWeight: 600,
                    color: 'primary.main',
                    mb: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  ⚙️ Game Settings
                </Typography>
                <Box sx={{ 
                  bgcolor: 'background.paper', 
                  p: 2, 
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider'
                }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Coin Value: {selectedGame.currency.symbol}{selectedGame.settings.coinValue}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Buy-in Value: {selectedGame.settings.buyInValue} chips
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Date: {selectedGame.date.toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>
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