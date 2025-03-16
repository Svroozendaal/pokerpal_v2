import React, { useState } from 'react';
import { Box, IconButton, Tooltip, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ShareIcon from '@mui/icons-material/Share';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import TelegramIcon from '@mui/icons-material/Telegram';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function ShareWidget({ 
  gameId, 
  results, 
  potValue, 
  currency, 
  onSavePrompt,
  hasUnsavedChanges 
}) {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const getShareUrl = () => {
    if (!gameId) return '';
    return `${window.location.origin}/game/${gameId}`;
  };

  const getShareText = () => {
    // Title and total pot
    let shareText = `PokerPal Results\n`;
    shareText += `Total Pot: ${currency.symbol}${potValue.toFixed(2)}\n\n`;

    // Player results section
    shareText += `Results:\n`;
    results.playerResults.forEach(player => {
      const sign = player.result > 0 ? '+' : '';
      shareText += `${player.name}: ${sign}${currency.symbol}${player.result.toFixed(2)}\n`;
    });

    // Payouts section
    if (results.payouts && results.payouts.length > 0) {
      shareText += `\nPayouts:\n`;
      results.payouts.forEach(payout => {
        shareText += `${payout}\n`;
      });
    }

    // Add game link if available
    const url = getShareUrl();
    if (url) {
      shareText += `\nCheck out the full game: ${url}`;
    }

    return shareText;
  };

  const handleShare = async (platform = null) => {
    if (!currentUser) {
      setLoginDialogOpen(true);
      return;
    }

    if (hasUnsavedChanges) {
      onSavePrompt();
      return;
    }

    const shareText = getShareText();

    try {
      switch (platform) {
        case 'whatsapp':
          window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
          break;
        case 'telegram':
          window.open(`https://t.me/share/url?url=${encodeURIComponent(getShareUrl())}&text=${encodeURIComponent(shareText)}`, '_blank');
          break;
        case 'clipboard':
          await navigator.clipboard.writeText(shareText);
          setSnackbarMessage('Results copied to clipboard!');
          setSnackbarSeverity('success');
          setSnackbarOpen(true);
          break;
        default:
          if (navigator.share) {
            await navigator.share({
              title: 'PokerPal Game Results',
              text: shareText,
              url: getShareUrl(),
            });
          } else {
            await navigator.clipboard.writeText(shareText);
            setSnackbarMessage('Results copied to clipboard!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
          }
      }
    } catch (error) {
      console.error('Error sharing:', error);
      setSnackbarMessage('Failed to share results');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleLogin = () => {
    setLoginDialogOpen(false);
    navigate('/login');
  };

  return (
    <>
      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
        <Tooltip title="Copy to Clipboard">
          <IconButton 
            onClick={() => handleShare('clipboard')}
            size="small"
            color="primary"
          >
            <ContentCopyIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Share">
          <IconButton 
            onClick={() => handleShare()}
            size="small"
            color="primary"
          >
            <ShareIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Share on WhatsApp">
          <IconButton 
            onClick={() => handleShare('whatsapp')}
            size="small"
            color="primary"
          >
            <WhatsAppIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Share on Telegram">
          <IconButton 
            onClick={() => handleShare('telegram')}
            size="small"
            color="primary"
          >
            <TelegramIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Login Dialog */}
      <Dialog
        open={loginDialogOpen}
        onClose={() => setLoginDialogOpen(false)}
      >
        <DialogTitle>Sign in to Share</DialogTitle>
        <DialogContent>
          Please sign in to share your game results. Signing in allows you to save your games and share them with others.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLoginDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleLogin} variant="contained" color="primary">
            Sign In
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
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
    </>
  );
}

export default ShareWidget; 