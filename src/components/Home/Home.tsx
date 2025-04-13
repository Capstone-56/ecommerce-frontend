import { useEffect } from "react";
import { Link } from "react-router-dom";

import { Box, Button, Typography, Container } from "@mui/material";

export default function Home() {
  useEffect(() => {
    document.title = "eCommerce | Home";
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
            mb: 4,
          }}
        >
          <Typography color="text.secondary">
            [Product cards would go here]
          </Typography>
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
