import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

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
    <Box sx={{ width: '100%', mt: 2 }}>
      <Typography variant="h5" gutterBottom>
        Game History
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Pot</TableCell>
              <TableCell>Players</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {games.map((game) => (
              <TableRow key={game.id}>
                <TableCell>{game.title}</TableCell>
                <TableCell>{game.date.toLocaleDateString()}</TableCell>
                <TableCell>{game.currency}{game.pot}</TableCell>
                <TableCell>
                  {Object.entries(game.results).map(([player, amount]) => (
                    <div key={player}>
                      {player}: {game.currency}{amount}
                    </div>
                  ))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
} 