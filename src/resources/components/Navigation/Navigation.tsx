import React, { useEffect, useState, useCallback } from "react";
import {
  Menu as MenuIcon,
  ShoppingCartOutlined,
  Search as SearchIcon,
  ChevronLeft,
} from "@mui/icons-material";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Toolbar,
  Typography,
  Paper,
  Badge,
  Drawer,
  MenuItem,
  Menu,
  Avatar,
} from "@mui/material";
import {
  NavLink,
  Link as RouterLink,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { grey, common } from "@mui/material/colors";
import { Constants } from "@/domain/constants";
import { CategoryModel } from "@/domain/models/CategoryModel";
import { CategoryService } from "@/services/category-service";
import CategoryMenu from "./CategoryMenu";
import MobileDrawer from "./MobileDrawer";
import {
  authenticationState,
  cartState,
  userState,
  locationState,
} from "@/domain/state";
import { Role } from "@/domain/enum/role";

import SearchBar from "@/resources/components/Search/SearchBar";
import { AuthService } from "@/services/auth-service";
import { StatusCodes } from "http-status-codes";
import { UserService } from "@/services/user-service";
import { ShoppingCartService } from "@/services/shopping-cart-service";

// Menu Items
// Should move to another file
// const menus = ["Home", "Products", "About"];
const menus = [
  { name: "Home", route: Constants.HOME_ROUTE },
  { name: "Products", route: Constants.PRODUCTS_ROUTE },
  { name: "Categories", route: Constants.CATEGORIES_ROUTE },
  { name: "About", route: Constants.ABOUT_ROUTE },
];

// Create service instances once per module (shared across all component instances)
const authService = new AuthService();
const shoppingCartService = new ShoppingCartService();
const userService = new UserService();

// get users initial for profile avatar
function getInitial(name?: string | null) {
  return name?.trim()?.[0]?.toUpperCase() ?? "U";
}

const Navbar: React.FC = () => {
  // Routing
  const location = useLocation();
  const navigate = useNavigate();

  // Global store state
  const isAuthenticated = authenticationState((state) => state.authenticated);
  const username = userState((state) => state.userName);
  const userInformation = userState((state) => state.userInformation);
  const setUserInformation = userState((state) => state.setUserInformation);
  const cart = cartState((state) => state.cart);
  const cartLoaded = cartState((state) => state.cartLoaded);
  const setCart = cartState((state) => state.setCart);
  const setCartLoaded = cartState((state) => state.setCartLoaded);
  const clearCart = cartState((state) => state.clearCart);
  const cartCount = cart.length;
  const userLocation = locationState((state) => state.userLocation);

  // Local UI state
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [searchDrawerOpen, setSearchDrawerOpen] = useState(false);
  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(
    null
  );

  // Category state
  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  // Category effects & handlers
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const categoryService = new CategoryService();
        const fetchedCategories = await categoryService.listCategories();

        // Filter for categories that have no parent
        const topLevelCategories = fetchedCategories.filter(
          (category) => !category.parentCategory
        );

        setCategories(topLevelCategories);
        setCategoriesError(null);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setCategoriesError("Failed to load categories");
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (category: CategoryModel) => {
    // Navigate to products page with category filter
    const categoryParam = category.internalName;
    window.location.href = `/products?categories=${categoryParam}`;
  };

  // Cart effects & helpers
  const loadCartData = useCallback(async () => {
    if (isAuthenticated && !cartLoaded && userLocation) {
      // Authenticated users: Load cart from API into Zustand store only if not already loaded
      try {
        const cartItems = await shoppingCartService.getShoppingCart(
          userLocation
        );

        // Convert API response to LocalShoppingCartItemModel format
        const localCartItems = cartItems.map((item) => ({
          ...item,
          totalPrice: item.totalPrice || item.productItem.price * item.quantity,
        }));

        setCart(localCartItems);
      } catch (error) {
        console.error("Failed to fetch cart data:", error);
        clearCart();
      }
    }
    // Unauthenticated users: cart data is already in Zustand store (persisted)
  }, [isAuthenticated, cartLoaded, userLocation, setCart, clearCart]);

  useEffect(() => {
    // Listen for cart updates from other components
    const handleCartUpdate = () => {
      if (isAuthenticated) {
        setCartLoaded(false); // Reset loaded state to allow fresh fetch
        loadCartData();
      }
    };
    window.addEventListener(Constants.EVENT_CART_UPDATED, handleCartUpdate);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener(
        Constants.EVENT_CART_UPDATED,
        handleCartUpdate
      );
    };
  }, [isAuthenticated, loadCartData, setCartLoaded]);

  // User effects & handlers
  const fetchUser = useCallback(async () => {
    if (username && !userInformation) {
      console.log("fetching user", username);
      setUserInformation(await userService.getUser(username));
    }
  }, [username, userInformation, setUserInformation]);

  useEffect(() => {
    fetchUser();
    loadCartData();
  }, [fetchUser, loadCartData]);

  // Reset cart loaded state when authentication changes
  const prevAuthRef = React.useRef(isAuthenticated);
  useEffect(() => {
    // Only reset if authentication state actually changed
    if (prevAuthRef.current !== isAuthenticated) {
      setCartLoaded(false);
      prevAuthRef.current = isAuthenticated;
    }
  }, [isAuthenticated, setCartLoaded]);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      const status = await authService.logout();

      if (status === StatusCodes.OK) {
        authenticationState.setState({ authenticated: false });
        userState.setState({ role: Role.CUSTOMER });
        userState.setState({ userName: null });
        userState.setState({ id: null });
        userState.setState({ userInformation: null });
        clearCart(); // Clear cart data on logout
        navigate(Constants.HOME_ROUTE);
      }
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleMobileMenuOpen = () => {
    setMobileDrawerOpen(true);
  };

  const handleMobileMenuClose = () => {
    setMobileDrawerOpen(false);
  };

  const handleSearchDrawerOpen = () => {
    setSearchDrawerOpen(true);
  };

  const handleSearchDrawerClose = () => {
    setSearchDrawerOpen(false);
  };

  return (
    <AppBar position="static" elevation={0}>
      <Paper
        elevation={0}
        sx={{ boxShadow: "0px 4px 8px rgba(55, 55, 55, 0.15)" }}
      >
        <Toolbar
          sx={{
            backgroundColor: common.white,
            justifyContent: "center", // Center the content container
            px: 2,
            minHeight: { xs: 64, sm: 64, md: 64 }, // Force consistent height
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: {
                xs: "space-between",
                sm: "space-between",
                md: "space-between",
                lg: "space-between",
                xl: "space-between",
              },
              alignItems: "center",
              width: "100%",
              maxWidth: "1680px",
            }}
          >
            {/* Nav Menu on < md (uses MUI Menu component) */}
            {/* Mobile Menu Button */}
            <Box sx={{ display: "flex" }}>
              <Box
                sx={{
                  display: { xs: "flex", md: "flex", lg: "flex", xl: "none" },
                }}
              >
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  onClick={handleMobileMenuOpen}
                >
                  <MenuIcon />
                </IconButton>
              </Box>
              {/* Company Name - Logo */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                {/* Logo image (replace src with your asset path) */}
                <Box
                  component={RouterLink}
                  to={Constants.HOME_ROUTE}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    textDecoration: "none",
                  }}
                >
                  <Box
                    component="img"
                    src="src/assets/logo_bdnx.png" // <-- replace with your logo path
                    alt="BDNX"
                    sx={{
                      height: { xs: 32, md: 40 },
                      width: "auto",
                      mr: 1.5,
                      objectFit: "contain",
                    }}
                  />
                </Box>
              </Box>
            </Box>

            {/* Nav Menu on > md */}
            <Box
              sx={{
                display: { xs: "none", md: "none", xl: "flex" },
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                gap: { md: 2, lg: 6 },
              }}
            >
              {/* Categories with mega dropdown */}
              {categoriesLoading ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="subtitle1" color="text.secondary">
                    Loading...
                  </Typography>
                </Box>
              ) : categoriesError ? (
                <Typography variant="subtitle1" color="error">
                  Categories unavailable
                </Typography>
              ) : (
                <CategoryMenu
                  categories={categories}
                  onCategoryClick={handleCategoryClick}
                />
              )}
            </Box>

            {/* Cart and User related Buttons */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 1,
              }}
            >
              {/* Desktop SearchBar */}
              <Box sx={{ display: { xs: "none", md: "flex" } }}>
                <SearchBar />
              </Box>

              {/* Mobile Search Button */}
              <Box sx={{ display: { xs: "flex", md: "none" } }}>
                <IconButton
                  size="medium"
                  color="inherit"
                  onClick={handleSearchDrawerOpen}
                >
                  <SearchIcon />
                </IconButton>
              </Box>

              {/* Cart Button */}
              <IconButton component={RouterLink} to={Constants.CART_ROUTE}>
                <Badge
                  badgeContent={cart.length}
                  color="primary"
                  sx={{
                    "& .MuiBadge-badge": {
                      top: -4,
                      right: -0,
                      fontSize: "0.6rem",
                      height: "16px",
                      minWidth: "16px",
                      padding: "0 4px",
                    },
                  }}
                >
                  <ShoppingCartOutlined
                    sx={{
                      color:
                        location.pathname === Constants.CART_ROUTE
                          ? common.black
                          : grey,
                    }}
                    fontSize="medium"
                  />
                </Badge>
              </IconButton>

              {isAuthenticated && userInformation ? (
                <>
                  <IconButton onClick={handleProfileMenuOpen}>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: "primary.light",
                        fontSize: 14,
                        fontWeight: 600,
                      }}
                    >
                      {getInitial(username)}
                    </Avatar>
                  </IconButton>
                  <Menu
                    anchorEl={profileAnchorEl}
                    open={Boolean(profileAnchorEl)}
                    onClose={handleProfileMenuClose}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                  >
                    {isAuthenticated &&
                      (userInformation?.role === Role.ADMIN ||
                        userInformation?.role === Role.MANAGER) && (
                        <MenuItem
                          component={RouterLink}
                          to={Constants.ADMIN_DASHBOARD_ROUTE}
                          onClick={handleProfileMenuClose}
                        >
                          Admin Dashboard
                        </MenuItem>
                      )}

                    <MenuItem
                      component={RouterLink}
                      to={Constants.PROFILE_ROUTE}
                      onClick={handleProfileMenuClose}
                    >
                      Profile
                    </MenuItem>

                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Button
                    component={RouterLink}
                    to={Constants.LOGIN_ROUTE}
                    variant="outlined"
                    sx={{
                      bgcolor: grey[50],
                      color: grey[900],
                      borderColor: "primary.main",
                      borderRadius: "8px",
                      textDecoration: "none",
                      "&:hover": {
                        bgcolor: grey[100],
                        borderColor: "primary.main",
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
                      bgcolor: "primary.main",
                      color: grey[50],
                      borderRadius: "8px",
                      textDecoration: "none",
                    }}
                  >
                    <Typography fontWeight="500" textTransform="none">
                      Sign up
                    </Typography>
                  </Button>
                </>
              )}
            </Box>
          </Box>
        </Toolbar>
      </Paper>
      <MobileDrawer
        open={mobileDrawerOpen}
        onClose={handleMobileMenuClose}
        categories={categories}
        onCategoryClick={handleCategoryClick}
        menuItems={menus}
      />
      {/* Search Drawer */}
      <Drawer
        anchor="right"
        open={searchDrawerOpen}
        onClose={handleSearchDrawerClose}
        sx={{
          "& .MuiDrawer-paper": {
            width: "100%",
            height: "100vh",
          },
        }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            borderBottom: "1px solid",
            borderColor: grey[300],
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "flex-start", flex: 1 }}>
            <IconButton onClick={handleSearchDrawerClose}>
              <ChevronLeft />
            </IconButton>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center", flex: 1 }}>
            <Typography variant="h6" fontWeight={600} sx={{ color: grey[900] }}>
              Search
            </Typography>
          </Box>
          {/* Empty to balance */}
          <Box sx={{ flex: 1 }} />
        </Box>
        <Box sx={{ flex: 1, p: 4 }}>
          <SearchBar />
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
