import React, { useState, useEffect } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import {
  Close as CloseIcon,
  ChevronRight
} from '@mui/icons-material';
import { NavLink } from 'react-router-dom';
import { CategoryModel } from '@/domain/models/CategoryModel';
import { grey } from '@mui/material/colors';

// These are static links that could be at the top of the drawer or at the bottom (e.g., Home, About, Cart, Account...).
interface MenuItem {
  name: string; 
  route: string; 
}

// Props expected by the MobileDrawer component.
interface MobileDrawerProps {
  open: boolean; 
  onClose: () => void;
  categories: CategoryModel[];
  onCategoryClick: (category: CategoryModel) => void; // Callback when a category is selected (navigates to products page)
  menuItems: MenuItem[];
}

/**
 * Component for rendering a single static menu item within the drawer (MenuItems).
 */
interface MenuItemProps {
  item: MenuItem;
  onClick: () => void;
}

const MobileDrawerMenuItem: React.FC<MenuItemProps> = ({ item, onClick }) => (
  <ListItem disablePadding>
    <ListItemButton
      component={NavLink}
      to={item.route}
      onClick={onClick}
      sx={{
        py: 2,
        '&:hover': {
          backgroundColor: grey[100],
        },
      }}
    >
      <ListItemText
        primary={item.name}
        primaryTypographyProps={{
          fontWeight: 500, 
          fontSize: '1rem',
        }}
      />
    </ListItemButton>
  </ListItem>
);

/**
 * Component for rendering a single category item within the drawer.
 * This component handles both navigating to child categories (if they exist)
 * or selecting a leaf category (one without children).
 */
interface CategoryItemProps {
  category: CategoryModel; // The category data (name, internalName, children)
  onSelect: (category: CategoryModel) => void; // Callback for when a leaf category is clicked
  onNavigateToChildren: (category: CategoryModel) => void; // Callback for when a parent category is clicked
}

const CategoryItem: React.FC<CategoryItemProps> = ({
  category,
  onSelect,
  onNavigateToChildren,
}) => {
  // Check if the current category has sub-categories
  const hasChildren = category.children && category.children.length > 0;

  /**
   * Handles the click event for a category item.
   * If the category has children, it triggers navigation to the next level of categories.
   * Otherwise, it means a final category has been selected, and it calls the onSelect prop.
   */
  const handleClick = () => {
    if (hasChildren) {
      onNavigateToChildren(category);
    } else {
      onSelect(category);
    }
  };

  return (
    <ListItem disablePadding>
      <ListItemButton
        onClick={handleClick}
        sx={{
          p: 2, 
          '&:hover': {
            backgroundColor: grey[100],
          },
        }}
      >
        <ListItemText
          primary={category.name}
          primaryTypographyProps={{
            fontWeight: 500,
            fontSize: '1rem',
          }}
        />
        {/* Display a right arrow icon if the category has children */}
        {hasChildren && (
          <ListItemIcon sx={{ minWidth: 24, justifyContent: 'flex-end' }}>
            <ChevronRight />
          </ListItemIcon>
        )}
      </ListItemButton>
    </ListItem>
  );
};

/**
 * Main MobileDrawer Component
 * It receives its open/close state and data from a parent component (Navigation.tsx).
 */
const MobileDrawer: React.FC<MobileDrawerProps> = ({
    open,
    onClose,
    categories,
    onCategoryClick,
    menuItems,
}) => {
  // State to manage the current level of categories being displayed.
  // Stores the path of parent categories, allowing navigation backwards.
  const [currentCategoryPath, setCurrentCategoryPath] = useState<CategoryModel[]>([]);

  // Reset the category path whenever the drawer is closed.
  useEffect(() => {
    if (!open) {
      setCurrentCategoryPath([]);
    }
  }, [open]);

  const handleClose = () => {
    onClose();
  };

  /**
   * Handles the selection of a final category.
   * This is called when a leaf category is clicked, or when the "All [Parent Category]"
   */
  const handleCategorySelect = (category: CategoryModel) => {
    onCategoryClick(category); // This is where the navigation to /products?categories=... happens (see Navigation.tsx)
    handleClose();
  };

  /**
   * Navigates deeper into the category hierarchy.
   * Adds the clicked category to the currentCategoryPath, causing its children to be displayed.
   */
  const navigateToChildren = (category: CategoryModel) => {
    setCurrentCategoryPath((prevPath) => [...prevPath, category]);
  };

  /**
   * Navigates back one level in the category hierarchy.
   * Removes the last category from currentCategoryPath, showing the previous level.
   */
  const navigateBack = () => {
    setCurrentCategoryPath((prevPath) => prevPath.slice(0, prevPath.length - 1));
  };

  // Check if at the top level of the drawer (main menu)
  const isTopLevel = currentCategoryPath.length === 0;

  /**
   * Determines which list of items (categories or their children) should be displayed.
   * If at the top level, it displays the main categories prop.
   * Otherwise, it displays the children of the last category in the currentCategoryPath.
   */
  const itemsToDisplay = isTopLevel
    ? categories
    : currentCategoryPath[currentCategoryPath.length - 1]?.children || [];

  /**
   * Determines the title to display in the drawer's header.
   * "Menu" for the top level, or the name of the current parent category when navigating deeper.
   */
  const currentTitle = isTopLevel
    ? "Menu"
    : currentCategoryPath[currentCategoryPath.length - 1].name;


  // --- Render Logic ---
  return (
    <Drawer
      anchor="right" // Slide in from the right side of the screen
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          width: '85%',
          maxWidth: 400,
        },
      }}
    >
      {/* Main container for the drawer's content, using flexbox for layout */}
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>

        {/* Drawer Header Section */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          {/* Back Button */}
          {!isTopLevel && (
            <IconButton onClick={navigateBack} sx={{ mr: 1 }}>
              <ChevronRight sx={{ transform: 'rotate(180deg)' }}/>
            </IconButton>
          )}
          {/* Dynamic Title */}
          <Typography variant="h6" fontWeight={600} sx={{ flexGrow: 1 }}>
            {currentTitle}
          </Typography>
          {/* Close Button */}
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Scrollable Content Area of the Drawer */}
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          <List>
            {isTopLevel ? (
              // --- Render Top-Level Content (Static Menu Items + Top-Level Categories) ---
              <>
                {/* Map through static menu items and render them using MobileDrawerMenuItem */}
                {menuItems.map((item) => (
                  <MobileDrawerMenuItem
                    key={item.name}
                    item={item}
                    onClick={handleClose}
                  />
                ))}
                {/* Map through top-level categories and render them using CategoryItem */}
                {categories.map((category) => (
                  <CategoryItem
                    key={category.internalName}
                    category={category}
                    onSelect={handleCategorySelect}
                    onNavigateToChildren={navigateToChildren}
                  />
                ))}
              </>
            ) : (
              // --- Render Deeper-Level Content ( "All [Parent Category]" + Children Categories) ---
              <>
                {/* "All [Parent Category Name]" button: Allows selecting the current parent category */}
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => handleCategorySelect(currentCategoryPath[currentCategoryPath.length - 1])}
                    sx={{
                      py: 1.5,
                      pl: 2,
                      backgroundColor: grey[50],
                      '&:hover': {
                        backgroundColor: grey[100],
                      },
                    }}
                  >
                    <ListItemText
                      primary={`All ${currentCategoryPath[currentCategoryPath.length - 1].name}`}
                      primaryTypographyProps={{
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        color: 'black',
                      }}
                    />
                  </ListItemButton>
                </ListItem>
                {/* Map through the itemsToDisplay (children of the current parent category) */}
                {itemsToDisplay.map((category) => (
                  <CategoryItem
                    key={category.internalName}
                    category={category}
                    onSelect={handleCategorySelect}
                    onNavigateToChildren={navigateToChildren}
                  />
                ))}
              </>
            )}
          </List>
        </Box>
      </Box>
    </Drawer>
  );
};

export { type MenuItem };
export default MobileDrawer;