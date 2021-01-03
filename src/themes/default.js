import { createMuiTheme } from '@material-ui/core/styles';

export const DefaultTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#456789',
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