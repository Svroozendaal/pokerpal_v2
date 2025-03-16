import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import ShareWidget from './ShareWidget';
import ResultsTable from './ResultsTable';

function ResultsDisplay({ 
  results, 
  potValue, 
  onClose, 
  currency = { symbol: '€', code: 'EUR' }, 
  onSaveGame,
  gameId,
  hasUnsavedChanges
}) {
  const { currentUser } = useAuth();

  const formatPayoutText = (payout) => {
    return payout;
  };

  return (
    <Card sx={{ position: 'relative', overflow: 'visible' }}>
      <CardContent sx={{ py: 2 }}>
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

        <ResultsTable 
          results={results}
          potValue={potValue}
          currency={currency}
          showPotValue={true}
          elevation={0}
        />

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
            {results.payouts.map((payout, index) => (
              <Typography 
                key={index}
                variant="body2"
                sx={{ mb: 1 }}
              >
                {formatPayoutText(payout)}
              </Typography>
            ))}
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <ShareWidget
            gameId={gameId}
            results={results}
            potValue={potValue}
            currency={currency}
            onSavePrompt={onSaveGame}
            hasUnsavedChanges={hasUnsavedChanges}
          />
        </Box>
      </CardContent>
    </Card>
  );
}

export default ResultsDisplay;
