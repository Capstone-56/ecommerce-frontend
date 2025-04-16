import React from "react";
import { KeyboardCommandKey, Trolley, Person } from "@mui/icons-material";
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  Toolbar,
  Typography,
} from "@mui/material";

import { grey, red } from "@mui/material/colors";

const menus = ["Home", "Products", "Categories", "About"];

const LogoStyle = {
  minHeight: "48px",
  minWidth: "48px",
  mr: 1,
  color: grey[900],
  display: {
    xs: "none",
    md: "flex",
  },
};

const TitleStyling = {
  fontWeight: "700",
  fontSize: "20px",
  textDecoration: "none",
  color: grey[900],
  "&:hover": {
    color: grey[900],
  },
};

// Navigation Buttons
const ButtonStyling = {
  color: grey[900],
  "&:hover": {
    backgroundColor: red,
  },
};

const Navbar: React.FC = () => {
  return (
    <AppBar position="static">
      <Container maxWidth={false} disableGutters>
        <Toolbar
          sx={{ backgroundColor: grey[50], justifyContent: "space-between" }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <IconButton disableRipple>
              <KeyboardCommandKey sx={{ ...LogoStyle }} />
            </IconButton>
            <Typography variant="h1" noWrap sx={{ ...TitleStyling }}>
              Company name
            </Typography>
          </Box>

          <Box>
            {menus.map((menuItem) => (
              <Button
                key={menuItem}
                onClick={() => console.log(`${menuItem} clicked!`)}
                sx={{ ...ButtonStyling }}
              >
                {menuItem}
              </Button>
            ))}
          </Box>

          <Box>
            <IconButton size="large">
              <Trolley />
            </IconButton>
            <IconButton size="large">
              <Person />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
