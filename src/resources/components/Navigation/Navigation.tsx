import React, { useState, useEffect } from "react";
import { Menu as MenuIcon, Search as SearchIcon, ChevronLeft} from "@mui/icons-material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCartOutlined";
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
} from "@mui/material";
import { NavLink, Link as RouterLink, useLocation } from "react-router-dom";
import { grey, common } from "@mui/material/colors";
import { Constants } from "@/domain/constants";
import { cartState } from "@/domain/state";
import { CategoryModel } from "@/domain/models/CategoryModel";
import { CategoryService } from "@/services/category-service";
import CategoryMenu from "./CategoryMenu";
import MobileDrawer from "./MobileDrawer";
import SearchBar from "@/resources/components/Search/SearchBar";

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
  const [searchDrawerOpen, setSearchDrawerOpen] = useState(false);
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

  const handleSearchDrawerOpen = () => {
    setSearchDrawerOpen(true);
  };

  const handleSearchDrawerClose = () => {
    setSearchDrawerOpen(false);
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
                to={"/"}
                noWrap
                sx={{ ...TitleStyling }}
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
              justifyContent: "center", // Center the middle links
              gap: { md: 2, lg: 6}, // Add spacing between links
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
              gap: 1,
              alignItems: "center",
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

