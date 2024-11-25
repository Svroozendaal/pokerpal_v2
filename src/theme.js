import { ThemeProvider, createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
    background: {  },
  },
  typography: {
    h1: {
      fontSize: '2rem', // Base font size
      '@media (min-width:600px)': {
        fontSize: '2.5rem', // Larger for medium screens
      },
      '@media (min-width:960px)': {
        fontSize: '3rem', // Larger for large screens
      },
    },

    h4: {
      fontSize: '1.8rem', // Base font size
      '@media (min-width:600px)': {
        fontSize: '2.3rem', // Larger for medium screens
      },
      '@media (min-width:960px)': {
        fontSize: '2.8rem', // Larger for large screens
      },
    },


    components: {
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            // Control the height of the entire TextField
            '& .MuiInputBase-input': {
              padding: '8px 10px', // Adjust padding inside the input box
            },
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            // Adjust the height here for input components globally
            height: '30px', // Set your desired height
          },
        },
      },
    },
  },
});

export default darkTheme;
