import React, { useState, useEffect } from "react";
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
import { NavLink, Link as RouterLink, useLocation } from "react-router-dom";
import { grey, common } from "@mui/material/colors";
import { Constants } from "@/domain/constants";
import { cartState } from "@/domain/state";
import { CategoryModel } from "@/domain/models/CategoryModel";
import { CategoryService } from "@/services/category-service";
import CategoryMenu from "./CategoryMenu";
import MobileDrawer from "./MobileDrawer";

// Should move to another file
// const menus = ["Home", "Products", "About"];
const menus = [
  { name: "Home", route: "/" },
  //{ name: "Products", route: "/products" },
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

const Navbar: React.FC = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const location = useLocation();
  const cart = cartState((state) => state.cart);

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

  return (
    <AppBar position="static" elevation={0}>
      <Paper elevation={0} sx={{ boxShadow: "0px 4px 8px rgba(55, 55, 55, 0.15)" }}>
        <Toolbar
          sx={{
            backgroundColor: common.white,
            justifyContent: {xs: "space-between" , sm: "space-between", md: "space-between", lg: "space-evenly"},
            px: 2,
          }}
        >
          {/* Nav Menu on < md (uses MUI Menu component) */}
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
                to={"/"}
                noWrap
                sx={{ ...TitleStyling }}
              >
                BDNX
              </Typography>
            </Box>

          {/* Nav Menu on > md */}
          <Box
            sx={{
              display: { xs: "none", md: "none", lg: "flex" },
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center", // Center the middle links
              gap: { md: 2, lg: 6}, // Add spacing between links
            }}
          >
            {menus.map((menuItem) => (
              <NavLink
                key={menuItem.name}
                to={menuItem.route}
                style={({ isActive }) => ({
                  textDecoration: "none",
                  color: isActive ? grey[900] : grey[600],
                  fontWeight: isActive ? "bold" : "normal",
                })}
              >
                <Typography
                  textTransform="none"
                  variant="subtitle1"
                  fontWeight="500"
                  sx={{
                    "&:hover": {
                      color: grey[800],
                      textDecoration: "underline",
                      textUnderlineOffset: "8px",
                      textDecorationThickness: "2px",
                    }
                  }}
                >
                  {menuItem.name}
                </Typography>
              </NavLink>
            ))}

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
              gap: 1,
            }}
          >
            <IconButton component={RouterLink} to={Constants.CART_ROUTE}>
              <ShoppingCartIcon 
                sx={{ 
                  color: location.pathname === Constants.CART_ROUTE ? common.black : grey
                }}
                fontSize="medium">
              </ShoppingCartIcon>
              <Badge 
                badgeContent={cart.length}
                color="primary"
                sx={{
                  '& .MuiBadge-badge': {
                    top: -15, 
                    fontSize: '0.6rem',
                    height: '16px',
                    minWidth: '16px',
                    padding: '0 4px',
                  },
                }}
                >
              </Badge>
            </IconButton>
            {/* LOGIN button with RouterLink to /login */}
            <Button
              component={RouterLink}
              to="/login"
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

            {/*SIGN UP button with RouterLink to /signup */}
            <Button
              component={RouterLink}
              to="/signup"
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
            {/* Mobile Menu Button */}
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
    </AppBar>
  );
};

export default Navbar;

