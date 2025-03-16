import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  IconButton,
  Divider,
  Button,
  Snackbar,
  Stack,
  Tooltip,
  Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ShareIcon from '@mui/icons-material/Share';
import TelegramIcon from '@mui/icons-material/Telegram';
import { useAuth } from '../contexts/AuthContext';
import ShareWidget from './ShareWidget';

function ResultsDisplay({ results, potValue, onClose, currency = { symbol: '€', code: 'EUR' }, onSaveGame, gameId, hasUnsavedChanges }) {
  const { currentUser } = useAuth();
  
  // Use the currency from props, as it will always be the current selected currency
  const activeCurrency = currency;

  if (!results || !results.playerResults) {
    return <Typography>No results to display.</Typography>;
  }

  const formatPayoutsText = () => {
    const lines = [
      `PokerPal Results`,
      `Total Pot: ${activeCurrency.symbol}${potValue.toFixed(2)}`,
      '',
      'Results:',
      ...results.playerResults.map(player => 
        `${player.name}: ${activeCurrency.symbol}${player.result.toFixed(2)}`
      ),
      '',
      'Payouts:',
      ...(results.payouts.length > 0 ? 
        results.payouts.map(payout => {
          // Replace any existing currency symbols with the current one
          return payout.replace(/[€$£¥]?\d+\.\d+/, match => 
            `${activeCurrency.symbol}${parseFloat(match.replace(/[€$£¥]/, '')).toFixed(2)}`
          );
        })
        : ['No payouts necessary.']),
      '',
      `Calculate your poker payouts at ${window.location.origin}`
    ];
    return lines.join('\n');
  };

  const copyToClipboard = async (text) => {
    try {
      // Try the modern clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }

      // Fallback for mobile devices
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        document.execCommand('copy');
        textArea.remove();
        return true;
      } catch (error) {
        textArea.remove();
        return false;
      }
    } catch (error) {
      return false;
    }
  };

  const handleCopyToClipboard = async () => {
    const text = formatPayoutsText();
    const success = await copyToClipboard(text);
    setSnackbarMessage(success ? 'Copied to clipboard' : 'Failed to copy. Try sharing instead.');
    setSnackbarSeverity(success ? 'success' : 'error');
    setSnackbarOpen(true);
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(formatPayoutsText());
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleTelegramShare = () => {
    const text = encodeURIComponent(formatPayoutsText());
    window.open(`https://t.me/share/url?url=&text=${text}`, '_blank');
  };

  const handleShare = async () => {
    if (!currentUser) {
      setSnackbarMessage('Please log in to share your game');
      setSnackbarSeverity('info');
      setSnackbarOpen(true);
      return;
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'PokerPal Results',
          text: formatPayoutsText(),
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }
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

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h6">Results & Payouts</Typography>
          {onClose && (
            <IconButton 
              onClick={onClose}
              size="small"
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  color: 'text.primary',
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </Box>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Total Pot Value: {activeCurrency.symbol}{potValue.toFixed(2)}
        </Typography>

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
              {results.playerResults.map((player, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ py: 1 }}>{player.name}</TableCell>
                  <TableCell sx={{ py: 1 }}>{activeCurrency.symbol}{player.startingValue.toFixed(2)}</TableCell>
                  <TableCell sx={{ py: 1 }}>{activeCurrency.symbol}{player.endingValue.toFixed(2)}</TableCell>
                  <TableCell sx={{ py: 1 }}>{activeCurrency.symbol}{player.result.toFixed(2)}</TableCell>
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
            {results.payouts.length > 0 ? (
              results.payouts.map((payout, index) => (
                <Typography 
                  key={index}
                  variant="body2"
                  sx={{ mb: 1 }}
                >
                  {payout}
                </Typography>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No payouts necessary.
              </Typography>
            )}
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

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Card>
  );
}

export default ResultsDisplay;
