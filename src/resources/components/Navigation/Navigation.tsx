import React, { useState } from "react";
import { KeyboardCommandKey, Menu as MenuIcon } from "@mui/icons-material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCartOutlined";
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
  Badge,
  Link,
} from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { grey, common } from "@mui/material/colors";
import { Constants } from "@/domain/constants";
import { AuthenticationState, cartState, UserState } from "@/domain/state";
import { Role } from "@/domain/enum/role";

// Nav Menu Items
const menus = [
  { name: "Home", route: Constants.HOME_ROUTE },
  { name: "Products", route: Constants.PRODUCTS_ROUTE },
  { name: "Categories", route: Constants.CATEGORIES_ROUTE },
  { name: "About", route: Constants.ABOUT_ROUTE },
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

const Navbar: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const location = useLocation();
  const cart = cartState((state) => state.cart);
  const userRole = UserState((state) => state.role);
  const auth = AuthenticationState((state) => state.authenticated);

  // basically anchor is HTML element where mouse click happened
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" elevation={0}>
      <Paper
        elevation={0}
        sx={{ boxShadow: "0px 4px 8px rgba(55, 55, 55, 0.15)" }}
      >
        <Toolbar
          sx={{
            backgroundColor: grey[50],
            justifyContent: {
              md: "space-evenly",
              xs: "space-between",
              sm: "space-between",
            },
            px: 2,
          }}
        >
          {/* Nav Menu on < md - uses MUI Menu (i.e. dropdown) component */}
          <Box
            sx={{
              display: "flex",
            }}
          >
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
                      sx={{
                        color:
                          location.pathname === menuItem.route
                            ? grey[900]
                            : grey[600],
                        fontWeight:
                          location.pathname === menuItem.route
                            ? "bold"
                            : "normal",
                        "&:hover": {
                          color: "inherit",
                        },
                      }}
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
              <IconButton
                component={RouterLink}
                to={Constants.HOME_ROUTE}
                disableRipple
              >
                <KeyboardCommandKey sx={{ ...LogoStyle }} />
              </IconButton>
              <Typography
                variant="h1"
                component={RouterLink}
                to={Constants.HOME_ROUTE}
                noWrap
                sx={{ ...TitleStyling }}
              >
                BDNX
              </Typography>
            </Box>
          </Box>

          {/* Nav Menu on > md breakpoint (shows all menu items) */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              flexDirection: "row",
              justifyContent: "center",
              gap: { md: 2, lg: 6 },
            }}
          >
            {menus.map((menuItem) => (
              <Link
                key={menuItem.name}
                component={RouterLink}
                to={menuItem.route}
                sx={{
                  textDecoration: "none",
                  color:
                    location.pathname === menuItem.route
                      ? grey[900]
                      : grey[600],
                  fontWeight:
                    location.pathname === menuItem.route ? "bold" : "normal",
                  "&:hover": {
                    backgroundColor: "inherit",
                  },
                }}
              >
                <Typography
                  textTransform="none"
                  variant="subtitle1"
                  fontWeight="500"
                >
                  {menuItem.name}
                </Typography>
              </Link>
            ))}
          </Box>

          {/* Cart context */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 1,
            }}
          >
            <IconButton component={RouterLink} to={Constants.CART_ROUTE}>
              <ShoppingCartIcon
                sx={{
                  color:
                    location.pathname === Constants.CART_ROUTE
                      ? common.black
                      : grey,
                }}
                fontSize="medium"
              ></ShoppingCartIcon>
              <Badge
                badgeContent={cart.length}
                color="primary"
                sx={{
                  "& .MuiBadge-badge": {
                    top: -15,
                    fontSize: "0.6rem",
                    height: "16px",
                    minWidth: "16px",
                    padding: "0 4px",
                  },
                }}
              ></Badge>
            </IconButton>

            {userRole && auth ? (
              <div>Hello I am logged in!</div>
            ) : (
              <>
                <Button
                  component={RouterLink}
                  to={Constants.LOGIN_ROUTE}
                  variant="outlined"
                  sx={{
                    bgcolor: grey[50],
                    color: grey[900],
                    borderColor: grey[900],
                    borderRadius: "8px",
                    textDecoration: "none",
                    "&:hover": {
                      bgcolor: grey[100],
                      borderColor: grey[900],
                    },
                  }}
                >
                  <Typography fontWeight="500" textTransform="none">
                    Login
                  </Typography>
                </Button>

                <Button
                  component={RouterLink}
                  to={Constants.SIGNUP_ROUTE}
                  variant="contained"
                  sx={{
                    bgcolor: grey[900],
                    color: grey[50],
                    borderRadius: "8px",
                    textDecoration: "none",
                    "&:hover": {
                      bgcolor: grey[800],
                    },
                  }}
                >
                  <Typography fontWeight="500" textTransform="none">
                    Sign up
                  </Typography>
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Paper>
    </AppBar>
  );
};

export default Navbar;
