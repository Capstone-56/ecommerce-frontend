import { useEffect } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { cartState } from "@/domain/state";
import OrderSummary from "@/resources/components/OrderSummary/OrderSummary";
import CartProductCard from "@/resources/components/ProductCard/CartProductCard";
import { common } from "@mui/material/colors";

export default function Cart() {
  // Use unified cart state for both authenticated and unauthenticated users
  const cart = cartState((state) => state.cart);

  useEffect(() => {
    document.title = "eCommerce | Cart";
  }, []);

  return (
    <div>
      <Typography
        variant="h4"
        fontWeight="bold"
        color={common.black}
        pt={"50px"}
        pb={"20px"}
        marginLeft={"100px"}
      >
        Shopping Cart
      </Typography>
      <Grid
        container
        justifyContent="center"
        alignItems="flex-start"
        spacing={6}
        marginLeft={"100px"}
        marginRight={"100px"}
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
                  ></CartProductCard>
                )
              }) :
              <Typography
                variant="h5"
                color={common.black}
              >
                Your cart is currently empty
              </Typography>}
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <OrderSummary cartState={cart}></OrderSummary>
        </Grid>
      </Grid>
    </div>
  );
};
