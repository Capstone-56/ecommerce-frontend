import { useEffect, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { cartState, authenticationState } from "@/domain/state";
import OrderSummary from "@/resources/components/OrderSummary/OrderSummary";
import CartProductCard from "@/resources/components/ProductCard/CartProductCard";
import { common } from "@mui/material/colors";

import { ShoppingCartService } from "@/services/shopping-cart-service";

export default function Cart() {
  const { authenticated } = authenticationState();
  const unAuthedCart = cartState((state) => state.cart);
  const [cart, setCart] = useState<any[]>([]);

  async function getCart() {
    if (authenticated) {
      const shoppingCartService = new ShoppingCartService();
      const result = await shoppingCartService.getShoppingCart();
      setCart(result);
    } else {
      setCart(unAuthedCart);
    }
  }

  useEffect(() => {
    document.title = "eCommerce | Cart";
    getCart();
  });

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
            {cart.length > 0 ? cart.map((product) => {
              return (
                <CartProductCard key={product.product.id} product={product.product}></CartProductCard>
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
