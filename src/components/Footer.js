import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Link, Divider } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';

function Footer() {
  const currentYear = new Date().getFullYear();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const show = window.scrollY > window.innerHeight;
      if (show !== isVisible) {
        setIsVisible(show);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.mode === 'light' 
          ? theme.palette.grey[100] 
          : theme.palette.grey[900],
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ fontSize: '0.8rem' }}
          >
            © {currentYear} PokerPal
          </Typography>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            <EmailIcon fontSize="small" color="action" sx={{ fontSize: '1rem' }} />
            <Link
              href="mailto:Pokerpalonline@gmail.com"
              color="text.secondary"
              underline="hover"
              sx={{ 
                typography: 'body2',
                fontSize: '0.8rem',
                '&:hover': {
                  color: 'primary.main'
                }
              }}
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