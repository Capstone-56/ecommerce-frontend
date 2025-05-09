import { ThemeOptions } from '@mui/material/styles';
import { grey } from '@mui/material/colors';

/*
  * This file contains the theme options for the MUI theme.
  * You can override the default MUI theme here.
  * This file should be used to define the theme options for repetitive, global elements such as text, buttons, color palette, etc.
*/

// You can also target specific components with component prop and globally override MUI components
export const themeOptions: ThemeOptions = {
  breakpoints: {
    values: {
      xs: 0,
      sm: 576,
      md: 768,
      lg: 992,
      xl: 1200,
    },
  },
  // components: {
  //   // override components here
  // },

  // e.g. This block changes all typography to have font-family "Inter", and all h1 has font-weight 700
  // We can also define custom variants, see https://mui.com/material-ui/customization/typography/#variants
  typography: {
    fontFamily: 'Inter',
    h1: {
      fontWeight: 700,
      color: grey['800']
    }
  },
  palette: {
    // Define primary and secondary colours here
    // you can define colours of element by specifying colour = primary/secondary
    // colours can also be used in sx prop such as sx={{ color: 'primary.main' }}
    primary: {
      light: '#d1c1ff', // light colour
      main: '#4F61FF', // main colour
      dark: '#1f40fb', // hover colour
      contrastText: '#fff', // text colour
    },
    secondary: {
      main: '#262626',
      dark: '#000',
      contrastText: '#fff',
    },
  },
  components: {
    // Define global styles for buttons here:
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 500,
          fontFamily: 'inherit',
          fontSize: '1rem',
          padding: '0.4rem 1.3rem',
        },
      },
    },
  },
};