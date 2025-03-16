import React from 'react';
import { Box, Container, Typography, Link, Divider } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.mode === 'light' 
          ? theme.palette.grey[100] 
          : theme.palette.grey[900],
      }}
    >
      <Divider sx={{ mb: 3 }} />
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
          >
            © {currentYear} PokerPal. All rights reserved.
          </Typography>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <EmailIcon fontSize="small" color="action" />
            <Link
              href="mailto:Pokerpalonline@gmail.com"
              color="text.secondary"
              underline="hover"
              sx={{ typography: 'body2' }}
            >
              Pokerpalonline@gmail.com
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer; 