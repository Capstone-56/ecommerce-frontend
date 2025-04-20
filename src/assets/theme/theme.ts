import { ThemeOptions, ButtonPropsVariantOverrides } from '@mui/material/styles';
import { OverridableStringUnion } from '@mui/types';

// Extend ButtonPropsVariantOverrides to include custom variants
declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    primary: true;
    secondary: true;
  }
}
import { grey } from '@mui/material/colors';


// TODO: theme provider should replace index.css as a global styler

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
      // need an opinion on using default css vs MUI palette
      // color: 'black'
      color: grey['800']
    }
  },
  components: {
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
      variants: [
        {
          props: { variant: 'primary' },
          style: {
            backgroundColor: '#1a1a1a',
            color: '#fff',
            border: '1px solid #1a1a1a',
            '&:hover': {
              backgroundColor: '#333',
              borderColor: '#333',
            },
          },
        },
        {
          props: { variant: 'secondary' },
          style: {
            backgroundColor: '#fff',
            color: '#1a1a1a',
            border: '1px solid #1a1a1a',
            '&:hover': {
              backgroundColor: '#f5f5f5',
              borderColor: '#333',
            },
          },
        },
      ],
    },
  },
};