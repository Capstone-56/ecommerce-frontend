import React, { useState, useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemButton, Paper } from '@mui/material';
import { ChevronRight } from '@mui/icons-material';
import { CategoryModel } from '@/domain/models/CategoryModel';

interface MegaDropdownProps {
  primaryCategories: CategoryModel[];
  onCategoryClick: (category: CategoryModel) => void;
}

/**
 * Dropdown component for the two column category layout
 */
const MegaDropdown: React.FC<MegaDropdownProps> = ({ primaryCategories, onCategoryClick }) => {
  const [hoveredPrimaryChild, setHoveredPrimaryChild] = useState<CategoryModel | null>(null);
  const [secondaryCategories, setSecondaryCategories] = useState<CategoryModel[]>([]);

  // Update secondary categories when hoveredPrimaryChild changes
  useEffect(() => {
    if (hoveredPrimaryChild && hoveredPrimaryChild.children) {
      setSecondaryCategories(hoveredPrimaryChild.children);
    } else {
      setSecondaryCategories([]);
    }
  }, [hoveredPrimaryChild]);

  return (
    <Paper
      elevation={1}
      sx={{
        position: 'absolute',
        top: '100%',
        left: -28,
        mt: 0,
        bgcolor: 'white',
        display: 'none',
        width: '100%',
        minWidth: '700px',
        maxWidth: '900px',
        zIndex: 10,
        overflow: 'hidden',
        '.group:hover &': {
          display: 'flex',
        },
        '.category-parent:hover &': {
          display: 'flex',
        }
      }}
    >
      {/* Left Column (Primary Children) */}
      <Box
        sx={{
          width: '50%',
          p: 2,
          borderRight: '1px solid',
          borderColor: 'grey.100',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <List>
          {primaryCategories.map((pCat) => (
            <ListItem key={pCat.internalName} disablePadding>
              <ListItemButton
                onMouseEnter={() => setHoveredPrimaryChild(pCat)}
                onClick={() => onCategoryClick(pCat)}
                sx={{
                  px: 1.5,
                  py: 1,
                  borderRadius: 1,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: hoveredPrimaryChild?.internalName === pCat.internalName ? 'blue.50' : 'transparent',
                  color: hoveredPrimaryChild?.internalName === pCat.internalName ? 'blue.700' : 'grey.800',
                  fontWeight: hoveredPrimaryChild?.internalName === pCat.internalName ? 600 : 400,
                  '&:hover': {
                    backgroundColor: 'grey.100',
                  },
                }}
              >
                <Typography variant="body1">{pCat.name}</Typography>
                {pCat.children && pCat.children.length > 0 && (
                  <ChevronRight sx={{ fontSize: 16, color: 'grey.400' }} />
                )}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Right Column */}
      <Box sx={{ width: '50%', p: 2 }}>
        {secondaryCategories.length > 0 ? (
          <List >
            {/* view all link*/}
            {hoveredPrimaryChild && (
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => onCategoryClick(hoveredPrimaryChild)}
                  sx={{
                    px: 1.5,
                    py: 1,
                    textDecoration: 'underline',
                    borderRadius: 1,
                    color: 'blue.700',
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: 'grey.100',
                    },
                  }}
                >
                  <Typography variant="body1">
                    All {hoveredPrimaryChild.name}
                  </Typography>
                </ListItemButton>
              </ListItem>
            )}
            {secondaryCategories.map((sCat) => (
              <ListItem key={sCat.internalName} disablePadding>
                <ListItemButton
                  onClick={() => onCategoryClick(sCat)}
                  sx={{
                    px: 1.5,
                    py: 1,
                    borderRadius: 1,
                    color: 'grey.700',
                    '&:hover': {
                      backgroundColor: 'grey.100',
                      color: 'blue.700',
                    },
                  }}
                >
                  <Typography variant="body1">{sCat.name}</Typography>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ p: 1.5, fontStyle: 'italic' }}
          >
            Hover over a category on the left to see more options.
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default MegaDropdown;