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
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ShareIcon from '@mui/icons-material/Share';
import TelegramIcon from '@mui/icons-material/Telegram';

function ResultsDisplay({ results, potValue, onClose, currency = { symbol: '€', code: 'EUR' } }) {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
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
    <Card sx={{ marginTop: 0, boxShadow: 3 }}>
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
                  sx={{ 
                    mb: index < results.payouts.length - 1 ? 0.5 : 0,
                    fontWeight: 500
                  }}
                >
                  {payout}
                </Typography>
              ))
            ) : (
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                No payouts necessary.
              </Typography>
            )}
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Tooltip title="Copy to clipboard">
            <Button
              size="small"
              startIcon={<ContentCopyIcon />}
              onClick={handleCopyToClipboard}
              variant="outlined"
            >
              Copy
            </Button>
          </Tooltip>
          <Tooltip title="Share via WhatsApp">
            <Button
              size="small"
              startIcon={<WhatsAppIcon />}
              onClick={handleWhatsAppShare}
              variant="outlined"
              color="success"
            >
              WhatsApp
            </Button>
          </Tooltip>
          <Tooltip title="Share via Telegram">
            <Button
              size="small"
              startIcon={<TelegramIcon />}
              onClick={handleTelegramShare}
              variant="outlined"
              color="info"
            >
              Telegram
            </Button>
          </Tooltip>
          {navigator.share && (
            <Tooltip title="Share">
              <Button
                size="small"
                startIcon={<ShareIcon />}
                onClick={handleShare}
                variant="outlined"
                color="secondary"
              >
                Share
              </Button>
            </Tooltip>
          )}
        </Stack>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={2000}
          onClose={() => setSnackbarOpen(false)}
          message={snackbarMessage}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />
      </CardContent>
    </Card>
  );
}

export default ResultsDisplay;
