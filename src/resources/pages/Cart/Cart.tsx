import { useEffect } from "react";
import { Typography } from "@mui/material";
import { cartState } from "@/domain/state";
import { ProductModel } from "@/domain/models/ProductModel";

/**
 * Test product to be used with add and remove buttons.
 * TODO: Remove when actual products can be added.
 */
const product: ProductModel = {
    id: "hello1",
    name: "hey",
    description: "hello",
    images: null
}

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
          // Place holder buttons to add and remove products from the cart to test implementation.
          // TODO: Remove and add real components when possible.
          <button onClick={() => addProduct(product)}>Add Product</button>
          <button onClick={() => removeProduct(product)}>Remove Product</button>
        </div>
      );
};
