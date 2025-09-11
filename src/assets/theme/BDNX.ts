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
          border: "1px solid #e2e8f0",
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
      primary: "#535353",
      secondary: "#acb3d6ff",
    },
    primary: {
      main: "#de7850",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#acb3d6ff",
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
