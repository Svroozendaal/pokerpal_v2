import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
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
  Collapse,
  IconButton,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

function GameRow({ game }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{game.title}</TableCell>
        <TableCell>{game.date.toLocaleDateString()}</TableCell>
        <TableCell>{game.currency.symbol}{game.potValue.toFixed(2)}</TableCell>
        <TableCell>
          {game.results.map((player, index) => (
            <div key={index}>
              {player.name}: {game.currency.symbol}{player.result.toFixed(2)}
            </div>
          ))}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Game Settings
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Coin Value</TableCell>
                    <TableCell>Buy-in Value</TableCell>
                    <TableCell>Players</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{game.currency.symbol}{game.settings.coinValue}</TableCell>
                    <TableCell>{game.settings.buyInValue} chips</TableCell>
                    <TableCell>
                      {game.settings.players.map((player, index) => (
                        <div key={index}>
                          {player.name}: {player.startStack} → {player.endStack} chips
                        </div>
                      ))}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <Typography variant="h6" gutterBottom component="div" sx={{ mt: 2 }}>
                Payouts
              </Typography>
              {game.payouts.map((payout, index) => (
                <Typography key={index} variant="body2">
                  {payout}
                </Typography>
              ))}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function GameHistory() {
  const [games, setGames] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchGames = async () => {
      if (!currentUser) return;
      
      const gamesRef = collection(db, 'games');
      const q = query(gamesRef, where('userId', '==', currentUser.uid));
      const querySnapshot = await getDocs(q);
      
      const gamesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate()
      }));
      
      setGames(gamesData.sort((a, b) => b.date - a.date));
    };

    fetchGames();
  }, [currentUser]);

  if (!currentUser) return null;

  return (
    <Box sx={{ width: '100%', mt: 2, p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Game History
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ width: '50px' }} />
              <TableCell>Title</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Pot</TableCell>
              <TableCell>Results</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {games.map((game) => (
              <GameRow key={game.id} game={game} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
} 