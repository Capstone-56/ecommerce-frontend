// A Products page component that displays the list of products
import { Link } from "react-router-dom";
import { useEffect, useState } from "react"; 
import { Box, Button, Typography, Breadcrumbs, Container, Grid, Paper } from "@mui/material";
import { ProductService } from "@/services/product-service";
import { ProductModel } from "@/domain/models/ProductModel";
import api from "@/api";

export default function Products() {
  const [products, setProducts] = useState<Array<ProductModel>>([]);
  
    /**
     * A useEffect required to get product data upon mount.
     */
    useEffect(() => {
      document.title = "eCommerce | Home";
  
      // The ProductService required to get product data.
      const productService = new ProductService();
  
      // Function to retrieve products via the API.
      const getProducts = async () => {
        const products = await productService.listProducts();
        setProducts(products);
      };
  
      getProducts();
    }, []);
  return (
    <>
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
              <Typography variant="body2" color="text.secondary">
                Showing {products.length} products
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", mt: { xs: 1, sm: 0 } }}>
                <Typography variant="body2" sx={{ mr: 1 }}>Sort by:</Typography>
                {/* Sort options to be implemented */}
              </Box>
            </Box>

            <Grid container spacing={3}>
              {/* Product Grid to be inserted here*/}
            </Grid>
          </Box>
        </Box>

        {/* Pagination */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          {/* Add pagination component */}
        </Box>
      </Container>
    </>
  );
};
