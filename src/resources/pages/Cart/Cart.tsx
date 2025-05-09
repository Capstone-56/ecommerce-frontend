import { useEffect } from "react";
import { Typography } from "@mui/material";
import { cartState } from "@/domain/state";

export default function Cart() {
  const cart = cartState((state) => state.cart);
  const addProduct = cartState((state) => state.addToCart);
  const removeProduct = cartState((state) => state.removeFromCart);

  useEffect(() => {
    document.title = "eCommerce | Cart";
  });
    
  return (
    <div>
      <Typography variant="h1">Cart</Typography>
    </div>
  );
};
