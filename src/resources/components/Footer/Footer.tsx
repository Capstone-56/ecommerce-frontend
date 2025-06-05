import {
  Box,
  Container,
  Grid,
  Typography,
  Link as MuiLink,
  IconButton,
  TextField,
  Button,
} from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import { Constants } from "@/domain/constants";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#f9f9f9",
        borderTop: "1px solid #e0e0e0",
        pt: 6,
        mt: 8,
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          {/* Branding or Logo */}
          <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4 }}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ textAlign: { xs: "center", md: "left", sm: "left" } }}
              color="text.primary"
            >
              BDNX
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textAlign: { xs: "center", md: "left", sm: "left" } }}
            >
              Your trusted store for all your needs.
            </Typography>
          </Grid>

          {/* Footer links */}
          <Grid size={{ xs: 6, sm: 6, md: 3, lg: 2 }}>
            <Box sx={{ textAlign: "left" }}>
              <Typography
                variant="h6"
                gutterBottom
                align="left"
                color="text.primary"
              >
                Shop Now
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                {/* Replace with category links */}
                <MuiLink
                  href={Constants.PRODUCTS_ROUTE}
                  color="text.primary"
                  underline="hover"
                >
                  All Products
                </MuiLink>
                <MuiLink
                  href={Constants.CATEGORIES_ROUTE}
                  color="text.primary"
                  underline="hover"
                >
                  Categories
                </MuiLink>
              </Box>
            </Box>
          </Grid>

          {/* Footer links */}
          <Grid size={{ xs: 6, sm: 6, md: 3, lg: 2 }}>
            <Box sx={{ textAlign: "left" }}>
              <Typography
                variant="h6"
                gutterBottom
                align="left"
                color="text.primary"
              >
                Company
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                <MuiLink
                  href={Constants.ABOUT_ROUTE}
                  color="text.primary"
                  underline="hover"
                >
                  About
                </MuiLink>
                <MuiLink href="/contact" color="text.primary" underline="hover">
                  Contact
                </MuiLink>
                {/* requires further clarification */}
                <MuiLink href="/privacy" color="text.primary" underline="hover">
                  Privacy Policy
                </MuiLink>
                <MuiLink href="/terms" color="text.primary" underline="hover">
                  Terms & Conditions
                </MuiLink>
              </Box>
            </Box>
          </Grid>

          {/* Newsletter Subscription */}
          <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4 }}>
            <Box sx={{ textAlign: { xs: "center", md: "left", sm: "left" } }}>
              <Typography variant="h6" gutterBottom color="text.primary">
                Subscribe to Us
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Get the latest updates and offers straight to your inbox.
              </Typography>
              <Box
                component="form"
                noValidate
                autoComplete="off"
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: "left",
                  gap: 1,
                }}
              >
                <TextField
                  size="small"
                  placeholder="Enter your email"
                  type="email"
                  required
                  sx={{
                    flex: 1,
                    minWidth: "150px",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      backgroundColor: "#f9f9f9",
                    },
                    "& .MuiOutlinedInput-input:-webkit-autofill": {
                      WebkitBoxShadow: "0 0 0 1000px #f9f9f9 inset !important",
                    },
                  }}
                />
                <Button
                  variant="contained"
                  type="submit"
                  size="medium"
                  sx={{ height: "40px" }}
                >
                  Submit
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            mt: 4,
            py: 2,
            borderTop: "1px solid #e0e0e0",
          }}
        >
          {/* Copyright */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: { xs: 2, sm: 0 } }}
          >
            &copy; {new Date().getFullYear()} eCommerce. All rights reserved.
          </Typography>

          {/* Social icons */}
          <Box>
            {/* Replace with actual social media links */}
            <IconButton
              aria-label="Instagram"
              href="https://instagram.com"
              target="_blank"
            >
              <InstagramIcon />
            </IconButton>
            <IconButton
              aria-label="Facebook"
              href="https://facebook.com"
              target="_blank"
            >
              <FacebookIcon />
            </IconButton>
            <IconButton
              aria-label="Twitter"
              href="https://twitter.com"
              target="_blank"
            >
              <TwitterIcon />
            </IconButton>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
