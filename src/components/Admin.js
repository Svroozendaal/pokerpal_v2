import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';
import { collection, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function Admin() {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [games, setGames] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch games
        const gamesQuery = query(collection(db, 'games'), orderBy('date', 'desc'));
        const gamesSnapshot = await getDocs(gamesQuery);
        const gamesData = gamesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date.toDate()
        }));
        setGames(gamesData);

        // Fetch users (if you have a users collection)
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const usersData = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteGame = async (gameId) => {
    if (!window.confirm('Are you sure you want to delete this game?')) return;
    
    try {
      await deleteDoc(doc(db, 'games', gameId));
      setGames(games.filter(game => game.id !== gameId));
    } catch (error) {
      console.error('Error deleting game:', error);
      setError('Failed to delete game');
    }
  };

  const handleViewGame = (game) => {
    setSelectedGame(game);
    setViewDialogOpen(true);
  };

  if (!currentUser) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">You must be logged in to access the admin page.</Alert>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <Typography variant="h5" gutterBottom sx={{ px: 3 }}>
        Admin Dashboard
      </Typography>

      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Games" />
          <Tab label="Users" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Pot Value</TableCell>
                  <TableCell>Players</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {games.map((game) => (
                  <TableRow key={game.id}>
                    <TableCell>{game.title}</TableCell>
                    <TableCell>{game.date.toLocaleDateString()}</TableCell>
                    <TableCell>{game.currency.symbol}{game.potValue.toFixed(2)}</TableCell>
                    <TableCell>{game.results.length}</TableCell>
                    <TableCell>
                      <Tooltip title="View Details">
                        <IconButton onClick={() => handleViewGame(game)}>
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton onClick={() => handleDeleteGame(game.id)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User ID</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Games Played</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{games.filter(game => game.userId === user.id).length}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Paper>

      {/* Game Details Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Game Details</DialogTitle>
        <DialogContent>
          {selectedGame && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedGame.title}
              </Typography>
              <Typography color="text.secondary" gutterBottom>
                Date: {selectedGame.date.toLocaleDateString()}
              </Typography>
              
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                Game Settings
              </Typography>
              <Typography>
                Pot Value: {selectedGame.currency.symbol}{selectedGame.potValue.toFixed(2)}
              </Typography>
              <Typography>
                Coin Value: {selectedGame.currency.symbol}{selectedGame.settings.coinValue}
              </Typography>
              <Typography>
                Buy-in Value: {selectedGame.settings.buyInValue} chips
              </Typography>

              <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                Player Results
              </Typography>
              {selectedGame.results.map((player, index) => (
                <Typography 
                  key={index}
                  color={player.result > 0 ? 'success.main' : player.result < 0 ? 'error.main' : 'text.primary'}
                >
                  {player.name}: {player.result > 0 ? '+' : ''}{selectedGame.currency.symbol}{player.result.toFixed(2)}
                </Typography>
              ))}

              <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                Payouts
              </Typography>
              {selectedGame.payouts.map((payout, index) => (
                <Typography key={index}>{payout}</Typography>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 