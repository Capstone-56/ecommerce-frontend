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
    {/* Nav goes here */}
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      {/* REPLACE: breadcrumb currently hardcoded. needs to be dynamic */}
      <Breadcrumbs>
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
      </Breadcrumbs>

      {/* Main layout with filters on left and products on right */}
      <Box sx={{ display: "flex", gap: 3, mt: 2.5 }}>
          {/* Filters section */}
          <Box sx={{ width: "240px", flexShrink: 0 }}>
            <Paper elevation={0} sx={{ p: 2, border: "1px solid #e0e0e0" }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Filters</Typography>
              
              {/* Categories filter would be implemented here */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>Categories</Typography>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>Category 1</Typography>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>Category 2</Typography>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>Category 3</Typography>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>Category 4</Typography>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>Category 5</Typography>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>Category 6</Typography>
                
              </Box>
              
              {/* Price range filter would be implemented here */}
              <Box sx={{ mb: 3 }}>
                
              </Box>
            </Paper>
          </Box>
          
          {/* Product listing */}
          <Box sx={{ flexGrow: 1 }}>
            {/* Product list header with count and sorting */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.5 }}>
              <Typography variant="body2" color="text.secondary">
                Showing {products.length} products
              </Typography>
              
              {/* REPLACE: Implement sort functionality */}
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="body2" sx={{ mr: 1 }}>Sort by:</Typography>

              </Box>
            </Box>
            
            {/* Product grid would be implemented here */}
            <Grid container spacing={3}>
              {/* Map through products here */}

              {/* Placeholder for product grid */}
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <Grid item key={item} xs={12} sm={6} md={4}>
                  <Paper sx={{ 
                    p: 2, 
                    height: "280px", 
                    display: "flex", 
                    flexDirection: "column",
                    backgroundColor: "#f5f5f5"
                  }}>
                    <Box sx={{ 
                      height: "180px", 
                      backgroundColor: "#e0e0e0", 
                      mb: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                      <Typography color="text.secondary">Product Image</Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">Category</Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>Product Title</Typography>
                    <Typography variant="body1" fontWeight="bold">$30</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
        {/* Pagination would be implemented here */}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>

          </Box>
      </Container>
    </>
  );
};
