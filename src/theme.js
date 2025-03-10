import { createTheme } from '@mui/material/styles';

const baseTheme = {
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 700,
    },
    h2: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 600,
    },
    h3: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 600,
    },
    h4: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 600,
      fontSize: '2rem',
      letterSpacing: '-0.5px',
    },
    h5: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 600,
    },
    h6: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 600,
    },
    subtitle1: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 500,
      fontSize: '1.1rem',
      lineHeight: 1.5,
      letterSpacing: '0.15px',
    },
    body1: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 400,
    },
    body2: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 400,
    },
    button: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 500,
      textTransform: 'none',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
};

export const darkTheme = createTheme({
  ...baseTheme,
  components: {
    ...baseTheme.components,
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.23)',
            },
          },
        },
      },
    },
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#1f957d',
      light: '#2ab094',
      dark: '#1a7c68',
    },
    secondary: {
      main: '#e9474c',
      light: '#f06b6f',
      dark: '#d13a3f',
    },
    background: {
      default: '#0d1923',
      paper: '#1a2633',
    },
    text: {
      primary: '#f7f5e3',
      secondary: 'rgba(247, 245, 227, 0.7)',
    },
    divider: 'rgba(247, 245, 227, 0.12)',
  },
});

export const lightTheme = createTheme({
  ...baseTheme,
  components: {
    ...baseTheme.components,
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
              borderColor: 'rgba(13, 25, 35, 0.3)',
            },
          },
        },
      },
    },
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#1f957d',
      light: '#2ab094',
      dark: '#1a7c68',
    },
    secondary: {
      main: '#e9474c',
      light: '#f06b6f',
      dark: '#d13a3f',
    },
    background: {
      default: '#f7f5e3',
      paper: '#ffffff',
    },
    text: {
      primary: '#0d1923',
      secondary: 'rgba(13, 25, 35, 0.6)',
    },
    divider: 'rgba(13, 25, 35, 0.12)',
  },
});
