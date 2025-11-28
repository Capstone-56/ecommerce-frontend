import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  Box,
  Button,
  Typography,
  Container,
  Card,
  CardContent,
  CardMedia,
  Grid,
} from "@mui/material";
import { ProductService } from "@/services/product-service";
import { ProductModel } from "@/domain/models/ProductModel";
import ProductCard from "@/resources/components/ProductCard/ProductCard";
import ProductCardSkeleton from "@/resources/components/ProductCard/ProductCardSkeleton";
import { locationState } from "@/domain/state";
import { Constants } from "@/domain/constants";
import bannerImage from "@/assets/Home/Gemini_Generated_Banner_Image.png";

export default function Home() {
  const [products, setProducts] = useState<Array<ProductModel>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const location = locationState((state) => state.userLocation);
  const userCurrency = locationState((state) => state.getUserCurrency());

  /**
   * A useEffect required to get product data upon mount.
   */
  useEffect(() => {
    document.title = `${Constants.BASE_BROWSER_TAB_TITLE} | Home`;

    // The ProductService required to get product data.
    const productService = new ProductService();

    // Function to retrieve featured products via the API.
    const getProducts = async () => {
      setLoading(true);
      try {
        const products = await productService.getFeaturedProducts(location, userCurrency);
        setProducts(products);
      } catch (error) {
        console.error("Failed to fetch featured products", error);
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, [location, userCurrency]);

  return (
    <>
      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          minHeight: { xs: "600px", sm: "700px", md: "800px" },
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          backgroundImage: `url(${bannerImage})`,
          backgroundSize: "cover",
          backgroundPosition: { 
            xs: "center center",
            sm: "center 20%",
            md: "center 30%"
          },
          backgroundRepeat: "no-repeat",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.4)", // Dark overlay for text readability
            zIndex: 1,
          },
        }}
      >
        <Container
          maxWidth={false}
          sx={{
            position: "relative",
            zIndex: 2,
            maxWidth: "1200px",
            px: 3,
          }}
        >
          <Box 
            sx={{ 
              textAlign: { xs: "center", md: "center", lg: "left" },
              display: "flex",
              flexDirection: "column",
              alignItems: { xs: "center", md: "center", lg: "flex-start" },
            }}
          >
            <Typography
              variant="h1"
              component="h1"
              sx={{
                fontSize: { xs: "48px", md: "72px", lg: "80px" },
                mb: 1,
                color: "white",
                fontWeight: "bold",
                textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
              }}
            >
              Exclusive Quality <br /> for Better Living
            </Typography>

            <Typography
              variant="h5"
              component="h2"
              sx={{ 
                mb: 4,
                color: "white",
                fontSize: { xs: "20px", md: "24px"},
                textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
                pt: 2,
                fontWeight: 300,
                maxWidth: "600px", // Control when text wraps naturally
              }}
            >
              Fresh styles. Smart deals. Endless inspiration. <br />
              Explore our latest arrivals before they're gone.
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="outlined"
                color="primary"
                component={Link}
                to={Constants.PRODUCTS_ROUTE}
                sx={{
                  borderColor: "white",
                  color: "white",
                  "&:hover": {
                    borderColor: "white",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                Shop Now
              </Button>

              <Button
                variant="contained"
                component={Link}
                to={Constants.PRODUCTS_ROUTE}
              >
                Browse Categories
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Featured Products Section */}
      <Container
        maxWidth="xl"
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
          {loading ? (
            // Show skeleton cards while loading
            Array.from({ length: 6 }).map((_, index) => (
              <Grid 
                size={{ xs: 12, sm: 6, md: 4, lg: 3 }} 
                key={`skeleton-${index}`}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  maxWidth: "350px",
                }}
              >
                <ProductCardSkeleton />
              </Grid>
            ))
          ) : products.length > 0 ? (
            products.map((product) => {
              return (
                <Grid 
                  size={{ xs: 12, sm: 6, md: 4, lg: 3 }} 
                  key={product.id}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    maxWidth: "350px",
                  }}
                >
                  <ProductCard product={product} width="100%" height="auto" />
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
          to={Constants.PRODUCTS_ROUTE}
        >
          View All Products
        </Button>
      </Container>
    </>
  );
}
