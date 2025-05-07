import React, { useCallback, useState, useEffect } from "react";
import {
  Button,
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useSearchParams } from "react-router-dom";
import { CategoryService } from "@/services/category-service";
import { CategoryModel } from "@/domain/models/CategoryModel";

/**
 * Available colours for filtering 
 */
const availableColours = [
  { value: "red", label: "Red", colour: "#C83E4D" },
  { value: "blue", label: "Blue", colour: "#2D82B7" },
  { value: "brown", label: "Brown", colour: "#856A5D" },
];

/**
 * Available price ranges for filtering
 */
const priceRanges = [
  { id: "under25", label: "Less than $25", min: 0, max: 25 },
  { id: "25to50", label: "$25 - $50", min: 25, max: 50 },
  { id: "50to100", label: "$50 - $100", min: 50, max: 100 },
  { id: "100to150", label: "$100 - $150", min: 100, max: 150 },
];

/**
 * A component to allow users to filter for certain items.
 */
export default function Filter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get selected params from URL
  const selectedCategoriesParam = searchParams.get("categories");
  const selectedCategories = selectedCategoriesParam
    ? selectedCategoriesParam.split(",")
    : [];
  const selectedColour = searchParams.get("colour");
  const minPrice = searchParams.get("price_min");
  const maxPrice = searchParams.get("price_max");

  // Fetch categories on component mount
  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true);
        const categoryService = new CategoryService();
        const categories = await categoryService.listCategories();

        setCategories(categories);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setError("Failed to load categories");
        setCategories([]);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  /**
   * Handle category selection changes
   */
  const handleCategoryChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const categoryInternalName = event.target.value;
      const isChecked = event.target.checked;

      setSearchParams((params) => {
        // Get current selected categories
        const currentCategories =
          params.get("categories")?.split(",").filter(Boolean) || [];

        let newCategories: string[];
        if (isChecked) {
          // Add category if it's not already there
          newCategories = [...currentCategories, categoryInternalName].filter(
            Boolean
          );
        } else {
          // Remove category
          newCategories = currentCategories.filter(
            (name) => name !== categoryInternalName
          );
        }

        // Update or remove the categories parameter
        if (newCategories.length > 0) {
          params.set("categories", newCategories.join(","));
        } else {
          params.delete("categories");
        }

        params.set("page", "1");

        return params;
      });
    },
    [setSearchParams]
  );

  /**
   * Handle colour selection
   */
  const handleColourChange = useCallback(
    (event: React.MouseEvent<HTMLDivElement>, colour: string) => {
      setSearchParams((params) => {
        if (params.get("colour") === colour) {
          params.delete("colour");
        } else {
          params.set("colour", colour);
        }

        params.set("page", "1");

        return params;
      });
    },
    [setSearchParams]
  );

  /**
   * Handle price range selection
   */
  const handlePriceRangeChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const isChecked = event.target.checked;
      const rangeId = event.target.value;

      // Find the selected price range
      const selectedRange = priceRanges.find((range) => range.id === rangeId);
      if (!selectedRange) return;

      setSearchParams((params) => {
        if (isChecked) {
          // Add price range
          params.set("price_min", selectedRange.min.toString());
          params.set("price_max", selectedRange.max.toString());
        } else {
          // Remove price range
          params.delete("price_min");
          params.delete("price_max");
        }

        params.set("page", "1");
        return params;
      });
    },
    [setSearchParams]
  );

  /**
   * Check if a price range is selected based on the URL parameters
   */
  const isPriceRangeSelected = (range: (typeof priceRanges)[0]): boolean => {
    if (!minPrice || !maxPrice) return false;

    return parseInt(minPrice) === range.min && parseInt(maxPrice) === range.max;
  };

  /**
   * Check if a category is selected based on the URL parameters
   */
  const isCategorySelected = (categoryInternalName: string): boolean => {
    return selectedCategories.includes(categoryInternalName);
  };

  /**
   * Clear all category filters
   */
  const clearFilters = () => {
    setSearchParams((params) => {
      params.delete("categories");
      params.delete("colour");
      params.delete("price_min");
      params.delete("price_max");
      params.set("page", "1");
      return params;
    });
  };

  // Check if any filters are applied
  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedColour !== null ||
    minPrice !== null ||
    maxPrice !== null;

  return (
    <Box sx={{
      width: '100%',
      maxWidth: '250px',
    }}>
        
      <Accordion defaultExpanded>
        <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="categories-content"
            id="categories-header"
        >
          <Typography component="div" gutterBottom>
            Categories
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
              <CircularProgress size={24} />
            </Box>
          )}

          {error && (
            <Typography color="error" sx={{ my: 2 }}>
              {error}
            </Typography>
          )}

          {!loading && !error && (
            <FormGroup sx={{ mt: 2 }}>
              {Array.isArray(categories) && categories.length > 0 ? (
                categories.map((category) => (
                  <FormControlLabel
                    key={category.internalName}
                    control={
                      <Checkbox
                        checked={isCategorySelected(category.internalName)}
                        onChange={handleCategoryChange}
                        value={category.internalName}
                      />
                    }
                    label={category.name}
                  />
                ))
              ) : (
                <Typography color="text.secondary">
                  No categories available
                </Typography>
              )}
            </FormGroup>
          )}
            </AccordionDetails>
        </Accordion>

        {/* Price Range Section */}
        <Accordion>
        <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="price-content"
            id="price-header"
        >

          <Typography component="div" gutterBottom>
            Price Range
          </Typography>
          </AccordionSummary>
        <AccordionDetails>
          <FormGroup sx={{ mt: 2 }}>
            {priceRanges.map((range) => (
              <FormControlLabel
                key={range.id}
                control={
                  <Checkbox
                    checked={isPriceRangeSelected(range)}
                    onChange={handlePriceRangeChange}
                    value={range.id}
                  />
                }
                label={range.label}
              />
            ))}
          </FormGroup>
        </AccordionDetails>
        </Accordion>

        {/* Colours section */}
        {/* TODO: Allow multiple colours to be selected at once. Requires backend changes */}
        <Accordion>
        <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="colours-content"
            id="colours-header"
        >
          <Typography component="div" gutterBottom>
            Colours
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
        <Grid container spacing={2} sx={{ mt: 2 }}>
            {availableColours.map((colour) => (
              // For 4 items per row: xs={3}, for  3 items per row: xs={4}
              <Grid size={{xs:3 }} key={colour.value}> 
                <Box
                  key={colour.value}
                  onClick={(e) => handleColourChange(e, colour.value)}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    cursor: 'pointer',
                    padding: 0.5,
                    borderRadius: 1, 
                    flexWrap: 'wrap',
                  }}
                >
                  <Box
                    sx={{
                      width: 30, 
                      height: 30,
                      borderRadius: '50%',
                      backgroundColor: colour.colour,
                      mb: 0.5,
                      border: selectedColour === colour.value ? '2px solid black' : '1px solid rgba(0,0,0,0.23)',
                      boxSizing: 'border-box',
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      color: selectedColour === colour.value ? 'primary.main' : 'text.secondary',
                      fontWeight: selectedColour === colour.value ? 'bold' : 'normal',
                    }}
                  >
                    {colour.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
            </Grid>
        </AccordionDetails>
        </Accordion>
        {/* Clear Filters Button */}
        {hasActiveFilters && (
            <Box
            sx={{
                
                borderTop: "1px solid rgba(0, 0, 0, 0.12)",
                paddingTop: 2,
                textAlign: "center",
            }}
            >
            <Button
                variant="contained"
                color="primary"
                sx={{
                width: "100%", // Make the button full width
                }}
                onClick={clearFilters}
            >
                Clear filters
            </Button>
            </Box>
        )}
    </Box>
  );
}
