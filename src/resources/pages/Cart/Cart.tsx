import { useEffect } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { cartState } from "@/domain/state";
import { Constants } from "@/domain/constants";

import OrderSummary from "@/resources/components/OrderSummary/OrderSummary";
import CartProductCard from "@/resources/components/ProductCard/CartProductCard";

export default function Cart() {
  // Use unified cart state for both authenticated and unauthenticated users
  const cart = cartState((state) => state.cart);

  useEffect(() => {
    document.title = `${Constants.BASE_BROWSER_TAB_TITLE} | Cart`;
  }, []);

  return (
    <Box
      sx={{
        width: "90%",
        maxWidth: "1680px",
        mx: "auto",
        py: { xs: "2rem", md: "3rem" },
        px: { xs: "1rem", md: 0 },
      }}
    >
      <Typography
        variant="h2"
        sx={{
          fontWeight: 600,
          fontSize: { xs: "24px", sm: "32px", md: "36px" },
          mb: { xs: 2, md: 3 },
        }}
      >
        Shopping Cart
      </Typography>
      <Grid
        container
        spacing={{ xs: 3, md: 6 }}
      >
        <Grid size={{ xs: 12, md: 7 }}>
          <Box display="flex" flexDirection="column" gap={2}>
            {cart.length > 0 ? cart
              .filter((cartItem) => cartItem?.productItem?.product?.id)
              .map((cartItem) => {
                return (
                  <CartProductCard 
                    key={cartItem.productItem.product.id} 
                    cartItem={cartItem}
                  />
                )
              }) :
              <Typography
                sx={{
                  fontSize: { xs: "16px", sm: "18px", md: "20px" },
                  color: "text.secondary",
                }}
              >
                Your cart is currently empty
              </Typography>}
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <OrderSummary cartState={cart} />
        </Grid>
      </Grid>
    </Box>
  );
};
