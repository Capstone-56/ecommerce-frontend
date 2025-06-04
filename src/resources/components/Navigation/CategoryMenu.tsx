import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  Paper,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import { ChevronRight } from "@mui/icons-material";
import { CategoryModel } from "@/domain/models/CategoryModel";
import { grey } from "@mui/material/colors";

interface CategoryMenuProps {
  categories: CategoryModel[];
  onCategoryClick: (category: CategoryModel) => void;
}

/**
 * Combined CategoryMenu and MegaDropdown component
 */
const CategoryMenu: React.FC<CategoryMenuProps> = ({categories, onCategoryClick,}) => {
  const [hoveredCategory, setHoveredCategory] = useState<CategoryModel | null>(null);
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

  // Add debug functions to window (remove before pushing)
  useEffect(() => {
    (window as any).debugCategory = {
      setHoveredCategory: (categoryName: string) => {
        const category = categories.find(c => c.internalName === categoryName);
        if (category) {
          setHoveredCategory(category);
          console.log('Set hovered category:', category.name);
        } else {
          console.log('Category not found:', categoryName);
        }
      },
      setHoveredPrimaryChild: (categoryName: string) => {
        const allChildren = categories.flatMap(c => c.children || []);
        const child = allChildren.find(c => c.internalName === categoryName);
        if (child) {
          setHoveredPrimaryChild(child);
          console.log('Set hovered primary child:', child.name);
        } else {
          console.log('Primary child not found:', categoryName);
        }
      },
      clearHover: () => {
        setHoveredCategory(null);
        setHoveredPrimaryChild(null);
        console.log('Cleared all hover states');
      },
      listCategories: () => {
        console.log('Available categories:', categories.map(c => ({ name: c.name, internalName: c.internalName })));
      }
    };
  }, [categories]);

  const handleCategoryHover = (category: CategoryModel) => {
    setHoveredCategory(category);
    setHoveredPrimaryChild(null); // Reset when switching categories
  };

  const handleCategoryLeave = () => {
    setHoveredCategory(null);
    setHoveredPrimaryChild(null);
  };

  return (
    <Box sx={{ display: "flex", gap: { md: 2, lg: 6 } }}>
      {categories.map((category) => (
        <Box key={category.internalName}
          sx={{
            py: 2,
          }}
          onMouseEnter={() => handleCategoryHover(category)}
          onMouseLeave={handleCategoryLeave}
        >
          {/* Category Link */}
          <NavLink
            to={`/products?categories=${category.internalName}`}
            style={({}) => ({
              textDecoration: "none",
              color: grey[600],
              fontWeight: "normal",
            })}
            onClick={(e: React.MouseEvent) => {onCategoryClick(category);
            }}
          >
            <Typography
              variant="subtitle1"
              fontWeight="500"
              sx={{
                "&:hover": {
                  color: grey[800],
                },
              }}
            >
              {category.name}
            </Typography>
          </NavLink>

          {/* Mega Dropdown */}
          {hoveredCategory?.internalName === category.internalName &&
            category.children &&
            category.children.length > 0 && (
              <Paper
                elevation={1}
                sx={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  width: "100vw",
                  minHeight: "300px",
                  bgcolor: "white",
                  zIndex: 10,
                  overflow: "hidden",
                  borderTop: "1px solid",
                  borderColor: "grey.300",
                  // Animation styles
                  animation: "slideDown 0.3s ease-out",
                  "@keyframes slideDown": {
                    "0%": {
                      transform: "translateY(-10px)",
                      opacity: 0,
                    },
                    "100%": {
                      transform: "translateY(0)",
                      opacity: 1,
                    },
                  },
                }}
              >
                {/* Content container */}
                <Box
                  sx={{
                    display: "flex",
                    width: "100%",
                    maxWidth: "1600px",
                    margin: "0 auto",
                    px: { xs: 2, md: 4 },
                    py: 2, // padding above the subcategories
                  }}
                >
                  {/* Left Column */}
                  <Box
                    sx={{
                      width: "50%",
                      borderRight: "1px solid",
                      borderColor: "grey.300",
                      p: 2,
                    }}
                  >
                    <List sx={{ p: 0 }}>
                      {/* View All Parent Category Link */}
                      <ListItem disablePadding>
                        <ListItemButton
                          onClick={() => onCategoryClick(category)}
                          sx={{
                            px: 1.5,
                            py: 1,
                            borderRadius: 1,
                            mb: 2,
                            borderBottom: "1px solid",
                            borderColor: "grey.300",
                            color: "blue.700",
                            fontWeight: 600,
                            "&:hover": {
                              backgroundColor: "blue.50",
                            },
                          }}
                        >
                          <Typography variant="body1" fontWeight={500} sx={{textDecoration: "underline", textUnderlineOffset: "4px"}}>
                            View All {category.name}
                          </Typography>
                        </ListItemButton>
                      </ListItem>

                      {/* List primary children*/}
                      {category.children.map((pCat) => (
                        <ListItem key={pCat.internalName} disablePadding>
                          <ListItemButton
                            onMouseEnter={() => setHoveredPrimaryChild(pCat)}
                            onClick={() => onCategoryClick(pCat)}
                            sx={{
                              px: 1.5,
                              py: 1,
                              borderRadius: 1,
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              backgroundColor:
                                hoveredPrimaryChild?.internalName ===
                                pCat.internalName
                                  ? "blue.50"
                                  : "transparent",
                              color:
                                hoveredPrimaryChild?.internalName ===
                                pCat.internalName
                                  ? "blue.700"
                                  : "grey.800",
                              fontWeight:
                                hoveredPrimaryChild?.internalName ===
                                pCat.internalName
                                  ? 600
                                  : 400,
                              "&:hover": {
                                backgroundColor: "grey.100",
                              },
                            }}
                          >
                            <Typography variant="body1">{pCat.name}</Typography>
                            {pCat.children && pCat.children.length > 0 && (
                              <ChevronRight
                                sx={{ fontSize: 16, color: "grey.400" }}
                              />
                            )}
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  </Box>

                  {/* Right Column - Made consistent with left column */}
                  <Box sx={{ width: "50%", p: 2 }}>
                    {secondaryCategories.length > 0 ? (
                      <List sx={{ p: 0 }}>
                        {/* View All Primary Category Link */}
                        {hoveredPrimaryChild && (
                          <ListItem disablePadding>
                            <ListItemButton
                              onClick={() => onCategoryClick(hoveredPrimaryChild)}
                              sx={{
                                px: 1.5,
                                py: 1,
                                borderRadius: 1,
                                mb: 2,
                                borderBottom: "1px solid",
                                borderColor: "grey.300",
                                color: "blue.700",
                                fontWeight: 600,
                                "&:hover": {
                                  backgroundColor: "blue.50",
                                },
                              }}
                            >
                              <Typography variant="body1" fontWeight={500} sx={{textDecoration: "underline", textUnderlineOffset: "4px"}}>
                                All {hoveredPrimaryChild.name}
                              </Typography>
                            </ListItemButton>
                          </ListItem>
                        )}

                        {/* List secondary children */}
                        {secondaryCategories.map((sCat) => (
                          <ListItem key={sCat.internalName} disablePadding>
                            <ListItemButton
                              onClick={() => onCategoryClick(sCat)}
                              sx={{
                                px: 1.5,
                                py: 1,
                                borderRadius: 1,
                                color: "grey.700",
                                width: "100%",
                                "&:hover": {
                                  backgroundColor: "grey.100",
                                  color: "blue.700",
                                },
                              }}
                            >
                              <Typography variant="body1">
                                {sCat.name}
                              </Typography>
                            </ListItemButton>
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ p: 1.5, fontStyle: "italic" }}
                      >
                        Hover over a category on the left to see more options.
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Paper>
            )}
        </Box>
      ))}
    </Box>
  );
};

export default CategoryMenu;
