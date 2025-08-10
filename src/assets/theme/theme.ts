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
  components: {
    // Override Accordion component styling
    MuiAccordion: {
      styleOverrides: {
        root: {
          // Remove default spacing between accordions
          '&:not(:last-child)': {
            borderBottom: 0,
          },
          // Remove the default elevation/shadow
          boxShadow: 'none',
          // Remove the default border radius for all accordions
          borderRadius: 0,
          // Add border radius only to first and last accordion
          '&:first-of-type': {
            borderTopLeftRadius: '8px',  // Adjust radius as needed
            borderTopRightRadius: '8px'  // Adjust radius as needed
          },
          '&:last-of-type': {
            borderBottomLeftRadius: '8px',  // Adjust radius as needed
            borderBottomRightRadius: '8px'  // Adjust radius as needed
          },
          // Remove the pseudo-element used for elevation
          '&:before': {
            display: 'none',
          },
          // Remove margin when expanded to prevent gaps
          '&.Mui-expanded': {
            margin: 0,
          },
          // Optional: you can add a border if desired
          border: '1px solid rgba(0, 0, 0, 0.12)',
        }
      },
      defaultProps: {
        // Set default elevation to 0 to remove the shadow
        elevation: 0
      }
    },
    // Optionally style the summary part
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          '&.Mui-expanded': {
            minHeight: 48,
          },
          paddingBottom: '0px',
        },
        content: {
          '&.Mui-expanded': {
            margin: '12px 0 4px',
          }
        }
      }
    },
    // Style the details part
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          // Keep left, right, bottom padding but reduce top padding
          padding: '0px 16px 16px 16px', // Adjust these values as needed
          // Move content higher
          marginTop: '-8px',
        }
      }
    },
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
};