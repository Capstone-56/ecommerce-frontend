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
  
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const sortOption = searchParams.get('sort');

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
    const params = new URLSearchParams(searchParams);
    
    if (!params.has('page')) {
      params.set('page', '1');
    }
    
    try {
      const result = await productService.listProductsWithParams(params);
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

  const sortLabels = {
    'featured': 'Featured',
    'priceAsc': 'Low to High',
    'priceDesc': 'High to Low'
  };
  
  const getSortLabel = () => {
    switch (sortOption) {
      case 'featured': return 'Featured';
      case 'priceAsc': return 'Low to High';
      case 'priceDesc': return 'High to Low';
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
                    alignItems: { xs: "flex-start", sm: "center" },
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
                    <Typography
                      variant="body2"
                      sx={{ mr: 1 }}
                      color="text.primary"
                    >
                      Sort by:
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={handleSortMenuOpen}
                      endIcon={<ExpandMoreIcon />}
                    >
                      {getSortLabel()}
                    </Button>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleSortMenuClose}
                    >
                      <MenuItem onClick={() => handleSortChange('featured')}>
                        Featured
                      </MenuItem>
                      <MenuItem onClick={() => handleSortChange('priceAsc')}>
                        Low to High
                      </MenuItem>
                      <MenuItem onClick={() => handleSortChange('priceDesc')}>
                        High to Low
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
