import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Box, Button, Typography, Container, Card, CardContent, CardMedia, Grid  } from "@mui/material";
import { ProductService } from "@/services/product-service";
import { ProductModel } from "@/domain/models/ProductModel";
import ProductCard from "@/resources/components/ProductCard/ProductCard";
import axios from "axios";
import { locationState, AuthenticationState, UserState } from "@/domain/state";

export default function Home() {
  const [products, setProducts] = useState<Array<ProductModel>>([]);
  const location = locationState((state) => state.userLocation);
  const setLocation = locationState((state) => state.setLocation);
  
  /**
   * A useEffect required to get product data upon mount.
   */
  useEffect(() => {
    document.title = "eCommerce | Home";
    console.log(AuthenticationState.getState().authenticated);
    console.log(UserState.getState().role);

    // The ProductService required to get product data.
    const productService = new ProductService();

    // Function to retrieve featured products via the API.
    const getProducts = async () => {
      const products = await productService.getFeaturedProducts();
      setProducts(products);
    };

  /**
   * Function to retrieve a users location based on their coordinates. Will only
   * try to send a request given that their location isn't already defined
   * within our state. Basic error handling, TODO: Have a disclaimer pop-up
   * if they deny to share their location.
   */
  async function getGeolocation(): Promise<void> {
    if (location == null) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const long = position.coords.longitude;
            const lat = position.coords.latitude;
            const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${lat}%2C+${long}&key=${import.meta.env.VITE_GEOCODE_API_KEY}`);
            setLocation(response.data.results[0].components.country);
          },
          (error) => {
            console.log(error)
          }
        )
      } else {
        console.log("Geolocation not supported by browser")
      }
    }
  }

    getProducts();
    getGeolocation();
  }, [location, setLocation]);

  return (
    <>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: "#D9D9D9",
          minHeight: "550px",
          width: "100%",
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
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            color="primary"
            component={Link}
            to="/products"
          >
            Shop Now
          </Button>

          <Button
            variant="contained"
            component={Link}
            to="/categories"
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
          color="text.primary"
        >
          Featured Products
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 6 }}>
          Discover apparel from a wide variety of brands
        </Typography>
        <Grid container spacing={3} sx={{ mb: 4, justifyContent: "center" }}>
          {/* Generate product cards for three featured products. */}
          {products.length > 0 ? (
            products.map((product) => {
              return (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product.id}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <ProductCard product={product} width="100%" height="100%" />
                  </Box>
                </Grid>
              );
            })
          ) : (
            <Typography color="text.secondary">
              No featured products available
            </Typography>
          )}
        </Grid>

        <Button
          variant="outlined"
          component={Link}
          to="/products"
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
          color="text.primary"
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
    </>
  );
}


