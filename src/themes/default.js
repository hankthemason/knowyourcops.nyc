import { createMuiTheme } from '@material-ui/core/styles';

export const DefaultTheme = createMuiTheme({
  palette: {
    primary: {
      light: '#ABCDEF',
      main: '#456789',
      dark: '#123456',
    },
    background: {
    	default: '#ffffff',
    	secondary: '#a3cef1'
    }
  },
  typography: {
  	fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  }
});