// A Products page component that displays the list of products
import { Link } from "react-router-dom";
import { useEffect, useState } from "react"; 
import { Box, Typography, Breadcrumbs, Container, Grid, Paper } from "@mui/material";

import { ProductService } from "@/services/product-service";

import { PagedList } from "@/domain/abstract-models/PagedList";
import { ProductModel } from "@/domain/models/ProductModel";

import Paginator from "@/components/Pagination/Paginator";
import ProductCard from "../ProductCard/ProductCard";
import Footer from "../Footer/Footer";

export default function Products() {
  const [products, setProducts] = useState<PagedList<ProductModel>>();
  const [currentPage, setCurrentPage] = useState(1);
  
  /**
   * A useEffect required to get product data upon mount.
   */
  useEffect(() => {
    document.title = "eCommerce | Products";
    fetchProducts(currentPage);
  }, [currentPage]);

  const fetchProducts = async (page: number) => {
    const productService = new ProductService();

    const result = await productService.listProducts(page, 12);
    setProducts(result);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
              mt: 2.5 
            }}
          >
            {/* Filters section */}
            <Box 
              sx={{ 
                width: { xs: "100%", md: "240px" }, 
                flexShrink: 0 
              }}
            >
              {/* Categories filter would be implemented here */}
              <Paper elevation={0} sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Filters</Typography>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>Categories</Typography>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>Category 1</Typography>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>Category 2</Typography>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>Category 3</Typography>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>Category 4</Typography>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>Category 5</Typography>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>Category 6</Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  {/* Price range filter would be implemented here */}
                </Box>
              </Paper>
            </Box>

            {/* Product listing */}
            <Box sx={{ flex: 1 }}>
              <Box 
                sx={{ 
                  display: "flex", 
                  flexDirection: { xs: "column", sm: "row" }, 
                  justifyContent: "space-between", 
                  alignItems: { xs: "flex-start", sm: "center" }, 
                  mb: 2.5 
                }}
              >
                {products && (
                  <Typography variant="body2" color="text.secondary">
                    Showing {products.results.length} products
                  </Typography>
                )}

                <Box sx={{ display: "flex", alignItems: "center", mt: { xs: 1, sm: 0 } }}>
                  <Typography variant="body2" sx={{ mr: 1 }} color="text.primary">Sort by:</Typography>
                  {/* Sort options to be implemented */}
                </Box>
              </Box>

              <Grid container spacing={3}>
                {products?.results.map((product) => (
                  <Grid size={{xs:12, sm:6, md:4, lg:3}} key={product.id}>
                    <Box sx={{ 
                      display: "flex",
                      justifyContent: "center"
                    }}>
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
      
      {/* Footer Section */}
      <Footer />
    </Box>
    </>
  );
};
