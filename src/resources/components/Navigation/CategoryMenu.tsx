import React, { useState, useEffect, useRef} from "react";
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

interface ColumnData {
  title: string;
  categories: CategoryModel[];
  isViewAll?: boolean;
  parentCategory?: CategoryModel;
  level: number;
}

/**
 * Enhanced CategoryMenu with support for up to 4 columns
 */
const CategoryMenu: React.FC<CategoryMenuProps> = ({categories, onCategoryClick,}) => {
  const [hoveredCategory, setHoveredCategory] = useState<CategoryModel | null>(null);
  const [hoveredPrimaryChild, setHoveredPrimaryChild] = useState<CategoryModel | null>(null);
  const [hoveredSecondaryChild, setHoveredSecondaryChild] = useState<CategoryModel | null>(null);
  const [hoveredTertiaryChild, setHoveredTertiaryChild] = useState<CategoryModel | null>(null);
  const hideTimeout = useRef<NodeJS.Timeout | null>(null);

  // Calculate dynamic columns based on category hierarchy
  const calculateColumns = (category: CategoryModel): ColumnData[] => {
    const columns: ColumnData[] = [];
    
    // Column 1: Primary children
    if (category.children && category.children.length > 0) {
      columns.push({
        title: category.name,
        categories: category.children,
        isViewAll: true,
        parentCategory: category,
        level: 1
      });
    }

    // Column 2: Secondary children
    if (hoveredPrimaryChild && hoveredPrimaryChild.children && hoveredPrimaryChild.children.length > 0) {
      columns.push({
        title: hoveredPrimaryChild.name,
        categories: hoveredPrimaryChild.children,
        isViewAll: true,
        parentCategory: hoveredPrimaryChild,
        level: 2
      });
    }

    // Column 3: Tertiary children
    if (hoveredSecondaryChild && hoveredSecondaryChild.children && hoveredSecondaryChild.children.length > 0) {
      columns.push({
        title: hoveredSecondaryChild.name,
        categories: hoveredSecondaryChild.children,
        isViewAll: true,
        parentCategory: hoveredSecondaryChild,
        level: 3
      });
    }

    // Column 4: Quaternary children
    if (hoveredTertiaryChild && hoveredTertiaryChild.children && hoveredTertiaryChild.children.length > 0) {
      columns.push({
        title: hoveredTertiaryChild.name,
        categories: hoveredTertiaryChild.children,
        isViewAll: true,
        parentCategory: hoveredTertiaryChild,
        level: 4
      });
    }

    return columns;
  };

  const handleCategoryHover = (category: CategoryModel) => {
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    setHoveredCategory(category);
    setHoveredPrimaryChild(null);
    setHoveredSecondaryChild(null);
    setHoveredTertiaryChild(null);
  };

  const handleCategoryLeave = () => {
    hideTimeout.current = setTimeout(() => {
      setHoveredCategory(null);
      setHoveredPrimaryChild(null);
      setHoveredSecondaryChild(null);
      setHoveredTertiaryChild(null);
    }, 120);
  };

  const handlePrimaryChildHover = (child: CategoryModel) => {
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    setHoveredPrimaryChild(child);
    setHoveredSecondaryChild(null);
    setHoveredTertiaryChild(null);
  };

  const handleSecondaryChildHover = (child: CategoryModel) => {
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    setHoveredSecondaryChild(child);
    setHoveredTertiaryChild(null);
  };

  const handleTertiaryChildHover = (child: CategoryModel) => {
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    setHoveredTertiaryChild(child);
  };

  const renderColumn = (columnData: ColumnData, columnIndex: number, totalColumns: number) => {
    const isLastColumn = columnIndex === totalColumns - 1;
    
    return (
      <Box
        key={`column-${columnData.level}-${columnData.title}`}
        sx={{
          width: "25%",
          borderRight: !isLastColumn ? "1px solid" : "none",
          borderColor: "grey.300",
          p: 2,
          minHeight: "300px",
        }}
      >
        <List sx={{ p: 0 }}>
          {/* View All Parent Category Link */}
          {columnData.isViewAll && columnData.parentCategory && (
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => onCategoryClick(columnData.parentCategory!)}
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
                  View All {columnData.title}
                </Typography>
              </ListItemButton>
            </ListItem>
          )}

          {/* List categories in this column */}
          {columnData.categories.map((cat) => {
            const isHovered = 
              (columnData.level === 1 && hoveredPrimaryChild?.internalName === cat.internalName) ||
              (columnData.level === 2 && hoveredSecondaryChild?.internalName === cat.internalName) ||
              (columnData.level === 3 && hoveredTertiaryChild?.internalName === cat.internalName);
            
            return (
              <ListItem key={cat.internalName} disablePadding>
                <ListItemButton
                  onMouseEnter={() => {
                    if (columnData.level === 1) {
                      handlePrimaryChildHover(cat);
                    } else if (columnData.level === 2) {
                      handleSecondaryChildHover(cat);
                    } else if (columnData.level === 3) {
                      handleTertiaryChildHover(cat);
                    }
                  }}
                  onClick={() => onCategoryClick(cat)}
                  sx={{
                    px: 1.5,
                    py: 1,
                    borderRadius: 1,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: isHovered ? "blue.50" : "transparent",
                    color: isHovered ? "blue.700" : "grey.800",
                    fontWeight: isHovered ? 600 : 400,
                    "&:hover": {
                      backgroundColor: "grey.100",
                    },
                  }}
                >
                  <Typography variant="body1">{cat.name}</Typography>
                  {cat.children && cat.children.length > 0 && columnData.level < 4 && (
                    <ChevronRight
                      sx={{ fontSize: 25, color: "grey.400" }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
    );
  };

  return (
    <Box sx={{ display: "flex", gap: { md: 2, lg: 2, xl: 4 }}}>
      {categories.map((category) => {
        const columns = calculateColumns(category);
        
        return (
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
                    textDecoration: hoveredCategory?.internalName === category.internalName 
                      ? "underline" 
                      : "none",
                    textUnderlineOffset: "8px",
                    textDecorationThickness: "2px",
                  "&:hover": {
                    color: grey[800],
                  },
                }}
              >
                {category.name}
              </Typography>
            </NavLink>

            {/* Enhanced Mega Dropdown with Dynamic Columns */}
            {hoveredCategory?.internalName === category.internalName &&
              category.children &&
              category.children.length > 0 && (
                <Paper
                  elevation={1}
                  onMouseEnter={() => {
                    if (hideTimeout.current) clearTimeout(hideTimeout.current);
                  }}
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
                  {/* Dynamic Content Container */}
                  <Box
                    sx={{
                      display: "flex",
                      width: "100%",
                      maxWidth: "1600px",
                      margin: "0 auto",
                      px: { xs: 2, md: 4 },
                      py: 2,
                    }}
                  >
                    {columns.map((columnData, index) => 
                      renderColumn(columnData, index, columns.length)
                    )}
                    
                    {/* Empty state for when no subcategories are hovered */}
                    {columns.length === 1 && (
                      <Box sx={{ width: "50%", p: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontStyle: "italic", textAlign: "center" }}
                        >
                          Hover over a category on the left to see more options.
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Paper>
              )}
          </Box>
        );
      })}
    </Box>
  );
};

export default CategoryMenu;
