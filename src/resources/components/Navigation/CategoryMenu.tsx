import React from 'react';
import { Box, Typography } from '@mui/material';
import { NavLink, Link as RouterLink } from 'react-router-dom';
import { CategoryModel } from '@/domain/models/CategoryModel';
import MegaDropdown from './MegaDropdown';
import { grey } from '@mui/material/colors';

interface CategoryMenuProps {
  categories: CategoryModel[];
  onCategoryClick: (category: CategoryModel) => void;
}

/**
 * CategoryMenu component to render top-level categories with mega dropdown
 */
const CategoryMenu: React.FC<CategoryMenuProps> = ({ categories, onCategoryClick }) => {
  return (
    <Box sx={{ display: 'flex', gap: 3 }}>
      {categories.map((category) => (
        <Box
          key={category.internalName}
          className="category-parent"
          sx={{
            position: 'relative',
            py: 2,
            '&:hover .mega-dropdown': {
              display: 'flex',
            },
          }}
        >
          <NavLink
            to={`/products?categories=${category.internalName}`}
            style={({}) => ({
              textDecoration: "none",
              color: grey[600],
              fontWeight: "normal",
            })}
            onClick={(e: React.MouseEvent) => {
              onCategoryClick(category);
            }}
          >
            <Typography
              variant="subtitle1"
              fontWeight="500"
              sx={{
                "&:hover": {
                  color: grey[800],
                }
              }}
            >
              {category.name}
            </Typography>
          </NavLink>
          
          {/* Render MegaDropdown only if there are children */}
          {category.children && category.children.length > 0 && (
            <Box className="mega-dropdown">
              <MegaDropdown 
                primaryCategories={category.children} 
                onCategoryClick={onCategoryClick} 
              />
            </Box>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default CategoryMenu;