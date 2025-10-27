import { createTheme, ThemeOptions } from "@mui/material/styles";

const commonSettings: Partial<ThemeOptions> = {
  typography: {
    fontFamily: "Inter, sans-serif",
    fontSize: 14,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
  },
  shape: {
    borderRadius: 6, // checks out to be ~ 0.375rem
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow:
            "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 8,
          padding: "10px 24px",
        },
        contained: {
          boxShadow:
            "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
          "&:hover": {
            boxShadow:
              "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
          },
        },
      },
    },
    // Override Accordion component styling
    MuiAccordion: {
      styleOverrides: {
        root: {
          // Remove default spacing between accordions
          "&:not(:last-child)": {
            borderBottom: 0,
          },
          // Remove the default elevation/shadow
          boxShadow: "none",
          // Remove the default border radius for all accordions
          borderRadius: 0,
          // Add border radius only to first and last accordion
          "&:first-of-type": {
            borderTopLeftRadius: "8px", // Adjust radius as needed
            borderTopRightRadius: "8px", // Adjust radius as needed
          },
          "&:last-of-type": {
            borderBottomLeftRadius: "8px", // Adjust radius as needed
            borderBottomRightRadius: "8px", // Adjust radius as needed
          },
          // Remove the pseudo-element used for elevation
          "&:before": {
            display: "none",
          },
          // Remove margin when expanded to prevent gaps
          "&.Mui-expanded": {
            margin: 0,
          },
          // Optional: you can add a border if desired
          border: "1px solid rgba(0, 0, 0, 0.12)",
        },
      },
      defaultProps: {
        // Set default elevation to 0 to remove the shadow
        elevation: 0,
      },
    },
    // Optionally style the summary part
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          "&.Mui-expanded": {
            minHeight: 48,
          },
          paddingBottom: "0px",
        },
        content: {
          "&.Mui-expanded": {
            margin: "12px 0 4px",
          },
        },
      },
    },
    // Style the details part
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          // Keep left, right, bottom padding but reduce top padding
          padding: "0px 16px 16px 16px", // Adjust these values as needed
          // Move content higher
          marginTop: "-8px",
        },
      },
    },
  },
};

// Light Theme
export const lightTheme = createTheme({
  ...commonSettings,
  palette: {
    mode: "light",
    background: {
      default: "#ffffff",
      paper: "#ffffff",
    },
    text: {
      primary: "#2b2b2bff",
      secondary: "#737373",
    },
    primary: {
      main: "#DD5548",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#737373",
      contrastText: "#ffffff",
    },
    divider: "#ececff",
  },
});

// Dark Theme
export const darkTheme = createTheme({
  ...commonSettings,
  palette: {
    mode: "dark",
    background: {
      default: "#353535",
      paper: "#444444",
    },
    text: {
      primary: "#ebebeb",
      secondary: "#9fa0ff",
    },
    primary: {
      main: "#7174ff",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#444444",
      contrastText: "#ebebeb",
    },
    divider: "#5e5e5e",
  },
});
