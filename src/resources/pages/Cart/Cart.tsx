import { useEffect } from "react";
import { Typography } from "@mui/material";
import { cartState } from "@/domain/state";
import { ProductModel } from "@/domain/models/ProductModel";
import CartProductCard from "@/resources/components/ProductCard/CartProductCard";

/**
 * Test product to be used with add and remove buttons.
 * TODO: Remove when actual products can be added.
 */
const product: ProductModel = {
    id: "1",
    name: "Product 1",
    description: "This is product 1",
    images: null
}

const product2: ProductModel = {
  id: "2",
  name: "Product 2",
  description: "This is product 2",
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
          {cart.map(product => {
            return(
              <CartProductCard product={product}></CartProductCard>
            )
          })}
        </div>
      );
};
