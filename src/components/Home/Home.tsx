import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Box, Button, Typography, Container, Card, CardContent, CardMedia  } from "@mui/material";
import { ProductService } from "@/services/product-service";
import { ProductModel } from "@/domain/models/ProductModel";

export default function Home() {
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
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: "#D9D9D9",
          minHeight: "550px",
          width: "100vw",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          px: 3,
        }}
      >
        <Typography
          variant="h1"
          component="h1"
          sx={{
            fontSize: { xs: "48px", md: "72px" },
            mb: 1,
          }}
        >
          Discover the latest
        </Typography>

        <Typography
          variant="h5"
          component="h2"
          color="text.secondary"
          sx={{ mb: 4 }}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing
        </Typography>
        {products && <p>{JSON.stringify(products[0])}</p>}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            component={Link}
            to="/products"
            sx={{
              bgcolor: "White",
              color: "#1a1a1a",
              boxShadow: "none",
              textTransform: "none",
              borderColor: "#1a1a1a",
              borderRadius: "8px",
              padding: "0.4rem 1.3rem",
              fontSize: "1rem",
              fontWeight: "500",
              fontFamily: "inherit",
            }}
          >
            Shop Now
          </Button>

          <Button
            variant="contained"
            component={Link}
            to="/categories"
            sx={{
              bgcolor: "#2D2D2D",
              color: "White",
              boxShadow: "none",
              textTransform: "none",
              borderRadius: "8px",
              padding: "0.4rem 1.3rem",
              fontSize: "1rem",
              fontWeight: "500",
              fontFamily: "inherit",
            }}
          >
            Categories
          </Button>
        </Box>
      </Box>

      {/* Featured Products Section */}
      <Container
        maxWidth="lg"
        sx={{
          my: { xs: 8, md: 16 },
          textAlign: "center",
        }}
      >
        <Typography
          variant="h2"
          component="h2"
          sx={{
            fontSize: "36px",
            fontWeight: 500,
            mb: 1,
          }}
        >
          Featured Products
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 6 }}>
          Discover apparel from a wide variety of brands
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
            flexWrap: "wrap",
            marginBottom: 4,
          }}
        >
          {/* REPLACE: sample cards for testing, replace with card component*/}
          {products.length > 0 ? (
          products.map((product) => (
            <Card key={product.id} sx={{ maxWidth: 345, boxShadow: 3 }}>
              {product.images && product.images.length > 0 && (
                <CardMedia
                  component="img"
                  height="140"
                  image={product.images[0]}
                  alt={product.name}
                />
              )}
              <CardContent>
                <Typography variant="h6" component="div">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.description}
                </Typography>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography color="text.secondary">No products available</Typography>
        )}

        </Box>

        <Button
          variant="outlined"
          component={Link}
          to="/products"
          sx={{
            bgcolor: "White",
            color: "#1a1a1a",
            boxShadow: "none",
            textTransform: "none",
            borderColor: "#1a1a1a",
            borderRadius: "8px",
            padding: "0.4rem 1.3rem",
            fontSize: "1rem",
            fontWeight: "500",
            fontFamily: "inherit",
          }}
        >
          View All Products
        </Button>
      </Container>

      {/* Categories Section */}
      <Box
        sx={{
          bgcolor: "#efefef",
          py: 8,
          px: 4,
          width: "100%",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h2"
          component="h2"
          sx={{
            fontSize: "36px",
            fontWeight: 500,
            mb: 1,
          }}
        >
          Shop By Category
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 6 }}>
          Browse our collections and find what you're looking for
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 4,
          }}
        >
          <Typography color="text.secondary">
            [Category cards would go here]
          </Typography>
        </Box>
      </Box>

      {/* Footer Section */}
      <Box sx={{ mt: 4, py: 2 }}>
        <Typography>Footer</Typography>
      </Box>
    </>
  );
}
