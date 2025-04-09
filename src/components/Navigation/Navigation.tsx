import React from "react";
import { Trolley } from "@mui/icons-material";
import {
  AppBar,
  Container,
  IconButton,
  Menu,
  Toolbar,
  Typography,
} from "@mui/material";

const menus = ["Home", "Products", "Categories", "About"];

const Navbar: React.FC = () => {
  return (
    <AppBar position="static">
      <Container maxWidth={false} disableGutters>
        <Toolbar sx={{ backgroundColor: "grey" }}>
          <IconButton disableRipple href="/">
            <Trolley
              sx={{
                minHeight: "48px",
                minWidth: "48px",
                mr: 1,
                color: "inherit",
                "&:hover": {
                  color: "inherit",
                },
              }}
            />
          </IconButton>
          <Typography
            variant="h1"
            noWrap
            fontSize="48px"
            component="a"
            href="/"
            sx={{
              fontWeight: "500",
              fontSize: "48px",
              textDecoration: "none",
              color: "inherit",
              "&:hover": {
                color: "inherit",
              },
            }}
          >
            Company name
          </Typography>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
