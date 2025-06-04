// A Products page component that displays the list of products
import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Breadcrumbs,
  Container,
  Grid,
  Paper,
  MenuItem,
  Button,
  Menu,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { ProductService } from "@/services/product-service";

import { PagedList } from "@/domain/abstract-models/PagedList";
import { ProductModel } from "@/domain/models/ProductModel";

import Paginator from "@/resources/components/Pagination/Paginator";
import ProductCard from "@/resources/components/ProductCard/ProductCard";
import Filter from "@/resources/components/Filter/Filter";

export default function Products() {
  const [products, setProducts] = useState<PagedList<ProductModel>>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  /**
   * Extract values from URL search parameters.
   */
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);
  const sortOption = searchParams.get('sort') || undefined;
  const colourFilter = searchParams.get('colour') || undefined;
  const categoriesFilter = searchParams.get('categories') || undefined;
  const priceMinFilter = searchParams.get('priceMin') ? parseFloat(searchParams.get('priceMin')!) : undefined;
  const priceMaxFilter = searchParams.get('priceMax') ? parseFloat(searchParams.get('priceMax')!) : undefined;
  const searchFilter = searchParams.get('search') || undefined;

  /**
   * A useEffect required to get product data upon mount and when URL changes.
   */
  // Fetch products when search params change
  useEffect(() => {
    document.title = "eCommerce | Products";
    fetchProducts();
  }, [searchParams]);

  // Fetch products based on current search params
  const fetchProducts = async () => {
    const productService = new ProductService();
    // Fetch products with filters and sorting
    try {
      const result = await productService.listProducts(
        currentPage,
        pageSize,
        priceMinFilter,
        priceMaxFilter,
        sortOption,
        colourFilter,
        categoriesFilter,
        searchFilter
      );
      setProducts(result);
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  };

  // Update page parameter
  const handlePageChange = (page: number) => {
    setSearchParams(params => {
      params.set('page', page.toString());
      return params;
    });
  };

  const handleSortMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSortMenuClose = () => {
    setAnchorEl(null);
  };

  // Update sort parameter, reset page to 1
  const handleSortChange = (sort: string) => {
    setSearchParams(params => {
      params.set('sort', sort);
      params.set('page', '1');
      return params;
    });
    handleSortMenuClose();
  };
  
  const getSortLabel = () => {
    switch (sortOption) {
      case 'featured': return 'Featured';
      case 'priceAsc': return 'Price: Low to High';
      case 'priceDesc': return 'Price: High to Low';
      default: return 'Default';
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Container maxWidth="xl" sx={{ mt: 4, mb: 8 }}>
            {/* REPLACE: breadcrumb currently hardcoded. needs to be dynamic */}
            <Breadcrumbs>
              <Link to="/">Home</Link>
              <Link to="/products">Products</Link>
            </Breadcrumbs>

            {/* Responsive Flex Container */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 3,
                mt: 2.5,
              }}
            >
              {/* Filters section */}
                <Filter />

              {/* Product listing */}
              <Box sx={{ flex: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    justifyContent: "space-between",
                    alignItems: { xs: "center", sm: "center" },
                    mb: 2.5,
                  }}
                >
                  {products && (
                    <Typography variant="body2" color="text.secondary">
                      Showing {products.results.length} products
                    </Typography>
                  )}

                  {/* Sort options UI */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mt: { xs: 1, sm: 0 },
                    }}
                  >
                    <Button
                      size="medium"
                      onClick={handleSortMenuOpen}
                      endIcon={<ExpandMoreIcon />}
                      sx={{
                        border: '1px solidrgb(255, 255, 255)', // Golden border like in Image 1
                        borderRadius: '8px',
                        color: 'text.primary',
                        padding: '8px 16px',
                        textTransform: 'none',
                        fontWeight: 'normal',
                        boxShadow: 'none',
                        '&:hover': {
                          borderColor: '#F2D48F',
                          backgroundColor: 'rgba(242, 212, 143, 0.04)'
                        }
                      }}
                    >
                      <Typography variant="body2" component="span" sx={{ fontWeight: 'normal', mr: 1 }}>
                        Sort By:
                      </Typography>
                      <Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
                        {getSortLabel()}
                      </Typography>
                    </Button>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleSortMenuClose}
                      slotProps={{
                        paper: {
                          sx: {
                            width: '200px',
                            borderRadius: '8px',
                            mt: 1,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                          }
                        }
                      }}
                      transformOrigin={{ horizontal: 'center', vertical: 'top' }}
                      anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
                    >
                      <MenuItem 
                        onClick={() => handleSortChange('featured')}
                        sx={{ py: 1.5 }}
                      >
                        Featured
                      </MenuItem>
                      <MenuItem 
                        onClick={() => handleSortChange('priceDesc')}
                        sx={{ 
                          py: 1.5, 
                        }}
                      >
                        Price: High-Low
                      </MenuItem>
                      <MenuItem onClick={() => handleSortChange('priceAsc')} sx={{ py: 1.5 }}>
                        Price: Low-High
                      </MenuItem>
                    </Menu>
                  </Box>
                </Box>
                <Grid container spacing={3}>
                  {products?.results.map((product) => (
                    <Grid
                      size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 4 }}
                      key={product.id}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <ProductCard
                          product={product}
                          width="100%"
                          height="100%"
                        />
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Box>

            {/* Pagination component */}
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Paginator
                pagedData={products}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            </Box>
          </Container>
        </Box>
      </Box>
    </>
  );
}
