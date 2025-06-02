import React from 'react';
import { Box, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { CategoryModel } from '@/domain/models/CategoryModel';
import MegaDropdown from './MegaDropdown';

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
          <Typography
            component={RouterLink}
            to="#"
            onClick={(e: React.MouseEvent) => {
              e.preventDefault();
              onCategoryClick(category);
            }}
            sx={{
              display: 'block',
              px: 1,
              pb: 2,
              borderBottom: '2px solid transparent',
              color: 'grey.700',
              fontWeight: 500,
              textDecoration: 'none',
              transition: 'border-color 0.2s',
              '&:hover': {
                borderColor: 'blue.600',
              },
            }}
          >
            {category.name}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default CategoryMenu;