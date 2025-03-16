import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  CircularProgress,
  Alert,
  Button,
  IconButton,
} from '@mui/material';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ResultsDisplay from './ResultsDisplay';

export default function GameView() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
      <Box sx={{ mt: 12, mb: 4, position: 'relative' }}>
        <IconButton 
          onClick={() => navigate('/')} 
          sx={{ 
            position: 'absolute', 
            top: -48, 
            left: -8,
            zIndex: 1 
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        
        <ResultsDisplay
          results={game}
          potValue={game.potValue}
          currency={game.currency}
          gameId={game.id}
          hasUnsavedChanges={false}
        />
      </Box>
    </Container>
  );
} 