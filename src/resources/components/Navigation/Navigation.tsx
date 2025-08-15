import React, { useEffect, useState, useCallback } from "react";
import {
  KeyboardCommandKey,
  Menu as MenuIcon,
  ShoppingCartOutlined,
  AccountCircle,
  Search as SearchIcon,
  ChevronLeft
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
} from "@mui/material";
import { NavLink, Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { grey, common } from "@mui/material/colors";
import { Constants } from "@/domain/constants";
import { CategoryModel } from "@/domain/models/CategoryModel";
import { CategoryService } from "@/services/category-service";
import CategoryMenu from "./CategoryMenu";
import MobileDrawer from "./MobileDrawer";
import { authenticationState, cartState, userState } from "@/domain/state";
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

const Navbar: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [searchDrawerOpen, setSearchDrawerOpen] = useState(false);
  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const [userInformation, setUserInformation] = useState(null);
  const location = useLocation();
  
  // Unified cart state for both authenticated and unauthenticated users
  const cart = cartState((state) => state.cart);
  const setCart = cartState((state) => state.setCart);
  const clearCart = cartState((state) => state.clearCart);
  const isAuthenticated = authenticationState((state) => state.authenticated);
  const username = userState((state) => state.userName);

  const cartCount = cart.length;
  const navigate = useNavigate();

  // Category related state
  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

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
        console.error('Failed to fetch categories:', err);
        setCategoriesError('Failed to load categories');
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

  const loadCartData = useCallback(async () => {
    if (isAuthenticated) {
      // Authenticated users: Load cart from API into Zustand store
      try {
        const cartItems = await shoppingCartService.getShoppingCart();

        // Convert API response to LocalShoppingCartItemModel format
        const localCartItems = cartItems.map(item => ({
          ...item,
          totalPrice: item.totalPrice || item.productItem.price * item.quantity
        }));

        setCart(localCartItems);
      } catch (error) {
        console.error("Failed to fetch cart data:", error);
        clearCart();
      }
    }
    // Unauthenticated users: cart data is already in Zustand store (persisted)
  }, [isAuthenticated, setCart, clearCart]);

  const fetchUser = useCallback(async () => {
    if (username) {
      setUserInformation(await userService.getUser(username));
    }
  }, [username]);

  useEffect(() => {
    fetchUser();
    loadCartData();

    // Listen for cart updates from other components
    const handleCartUpdate = () => {
      loadCartData();
    };
    window.addEventListener(Constants.EVENT_CART_UPDATED, handleCartUpdate);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener(Constants.EVENT_CART_UPDATED, handleCartUpdate);
    };
  }, [fetchUser, loadCartData]);
  

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

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
        clearCart(); // Clear cart data on logout
        navigate(Constants.HOME_ROUTE);
      }
    } catch (error) {
      console.error("Logout failed", error);
    }
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
            justifyContent: {
              md: "space-evenly",
              xs: "space-between",
              sm: "space-between",
            },
            px: 2,
          }}
        >
          {/* Nav Menu on < md (uses MUI Menu component) */}
          {/* Mobile Menu Button */}
          <Box sx={{ display:"flex"}}>
            <Box sx={{ display: { xs: "flex", md: "flex", lg: "none" } }}>
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
              <Typography
                variant="h1"
                component={RouterLink}
                to={Constants.HOME_ROUTE}
                noWrap
                sx={{
                  fontSize: { xs: "32px", md: "24px" },
                  color: grey[900],
                  "&:hover": {
                    color: grey[900],
                  },
                }}
              >
                BDNX
              </Typography>
            </Box>
          </Box>
            
          {/* Nav Menu on > md */}
          <Box
            sx={{
              display: { xs: "none", md: "none", lg: "flex" },
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
              gap: { md: 2, lg: 6 },
            }}
          >
            {/* Categories with mega dropdown */}
            {categoriesLoading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
              <ShoppingCartOutlined
                sx={{
                  color:
                    location.pathname === Constants.CART_ROUTE
                      ? common.black
                      : grey,
              <ShoppingCartOutlined
                sx={{
                  color:
                    location.pathname === Constants.CART_ROUTE
                      ? common.black
                      : grey,
                }}
                fontSize="medium"
              ></ShoppingCartOutlined>
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
                  "& .MuiBadge-badge": {
                    top: -15,
                    fontSize: "0.6rem",
                    height: "16px",
                    minWidth: "16px",
                    padding: "0 4px",
                  },
                }}
              ></Badge>
              ></Badge>
            </IconButton>

            {isAuthenticated && userInformation ? (
              <>
                <IconButton onClick={handleProfileMenuOpen}>
                  <AccountCircle />
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
                    borderColor: grey[900],
                    borderRadius: "8px",
                    textDecoration: "none",
                    "&:hover": {
                      bgcolor: grey[100],
                      borderColor: grey[900],
                    },
                  }}
                >
              </Badge>
            </IconButton>

            {isAuthenticated && userInformation ? (
              <>
                <IconButton onClick={handleProfileMenuOpen}>
                  <AccountCircle />
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
          '& .MuiDrawer-paper': {
            width: '100%',
            height: '100vh',
          },
        }}
      >
        <Box
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            borderBottom: '1px solid',
            borderColor: grey[300],
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', flex: 1 }}>
            <IconButton onClick={handleSearchDrawerClose}>
              <ChevronLeft />
            </IconButton>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', flex: 1 }}>
            <Typography variant="h6" fontWeight={600} sx={{ color: grey[900] }}>
              Search
            </Typography>
          </Box>
          {/* Empty to balance */}
          <Box sx={{ flex: 1 }} />
        </Box>
        <Box sx={{ flex: 1, p: 4 }}>
            <SearchBar/>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;

