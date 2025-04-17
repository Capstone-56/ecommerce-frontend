import React, { useState } from "react";
import { KeyboardCommandKey, Menu as MenuIcon } from "@mui/icons-material";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Menu,
  Toolbar,
  Typography,
  MenuItem,
  Paper,
} from "@mui/material";

import { Link as RouterLink } from "react-router-dom";

import { grey } from "@mui/material/colors";

// Should move to another file
// const menus = ["Home", "Products", "Categories", "About"];
const menus = [
  { name: "Home", route: "/" },
  { name: "Products", route: "/products" },
  { name: "Categories", route: "/" },
  { name: "About", route: "/about" },
];

const LogoStyle = {
  minHeight: "48px",
  minWidth: "48px",
  color: grey[900],
  display: {
    xs: "none",
    md: "flex",
  },
};

const TitleStyling = {
  fontSize: { xs: "32px", md: "24px" },
  color: grey[900],
  "&:hover": {
    color: grey[900],
  },
};

// Navigation Buttons
const ButtonStyling = {
  color: grey[900],
  "&:hover": {
    backgroundColor: "none",
  },
};

const Navbar: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // basically anchor is HTML element where mouse click happened
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static">
      <Paper>
        <Toolbar
          sx={{
            backgroundColor: grey[50],
            justifyContent: { md: "space-evenly", xs: "space-between" },
            px: 2,
          }}
        >
          {/* Nav Menu on < md (uses MUI Menu component) */}
          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              alignItems: "center",
            }}
          >
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              onClick={handleMenuOpen}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={!!anchorEl}
              onClose={handleMenuClose}
            >
              {menus.map((menuItem) => (
                <MenuItem>
                  <Typography
                    component={RouterLink}
                    variant="body1"
                    to={menuItem.route}
                    sx={{ color: grey[900] }}
                  >
                    {menuItem.name}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Company Name - Logo */}
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
              BDNX
            </Typography>
          </Box>

          {/* Nav Menu on > md */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              flexDirection: "row",
              gap: 1,
            }}
          >
            {menus.map((menuItem) => (
              <Button
                key={menuItem.name}
                component={RouterLink}
                to={menuItem.route}
                sx={{ ...ButtonStyling }}
                disableTouchRipple
              >
                <Typography
                  textTransform="none"
                  variant="subtitle1"
                  fontWeight="500"
                >
                  {menuItem.name}
                </Typography>
              </Button>
            ))}
          </Box>

          {/* User Buttons */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 1,
            }}
          >
            {/* TODO: apply logic to show "logged-in state" options */}
            <Button
              variant="outlined"
              sx={{
                bgcolor: grey[50],
                color: grey[900],
                borderColor: grey[900],
                borderRadius: "8px",
              }}
            >
              <Typography fontWeight="500" textTransform="none">
                Login
              </Typography>
            </Button>
            <Button
              variant="outlined"
              sx={{
                bgcolor: grey[900],
                color: grey[50],
                borderRadius: "8px",
              }}
            >
              <Typography fontWeight="500" textTransform="none">
                Sign up
              </Typography>
            </Button>
          </Box>
        </Toolbar>
      </Paper>
    </AppBar>
  );
};

export default Navbar;
