import { ThemeOptions } from '@mui/material/styles';
import { grey } from '@mui/material/colors';


// TODO: theme provider should replace index.css as a global styler

// You can also target specific components with component prop and globally override MUI components
export const themeOptions: ThemeOptions = {
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
};