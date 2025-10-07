import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Grid,
  IconButton,
  Button,
  TextField
} from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import placeholderImage from "/src/assets/ProductCard/product_card_placeholder.svg";

import { Constants } from "@/domain/constants";
import { cartState, authenticationState } from "@/domain/state";
import { UpdateShoppingCartItemModel, ShoppingCartItemModel, LocalShoppingCartItemModel } from "@/domain/models/ShoppingCartItemModel";
import { formatPrice } from "@/utilities/currency-utils";

import { ShoppingCartService } from "@/services/shopping-cart-service";

interface ProductCardProps {
  cartItem: ShoppingCartItemModel | LocalShoppingCartItemModel;
}

const shoppingCartService = new ShoppingCartService();

/**
 * The card component to display products when users view their cart. 
 */
const CartProductCard: React.FC<ProductCardProps> = ({ cartItem }) => {
  const { name, description, images } = cartItem.productItem.product;
  const { price, currency } = cartItem.productItem;
  const { authenticated } = authenticationState();

  // Unified cart state management for both user types
  const updateCartItemState = cartState((state) => state.updateCartItem);
  const removeFromCart = cartState((state) => state.removeFromCart);

  async function handleUpdateQuantity(delta: number) {
    if (authenticated) {
      const currentQuantity = cartItem.quantity;
      const newQuantity = currentQuantity + delta;
      
      const model: UpdateShoppingCartItemModel = {
        quantity: newQuantity,
      }

      await shoppingCartService.updateShoppingCartItem(cartItem.id, model);
      
      // Notify Navigation to reload cart
      window.dispatchEvent(new CustomEvent(Constants.EVENT_CART_UPDATED));
    } else {
      // Unauthenticated users: Update local state
      const newQuantity = cartItem.quantity + delta;
      updateCartItemState(cartItem.id, { quantity: newQuantity });
    }
  }

  async function removeCartItem() {
    if (authenticated) {
      // Authenticated users: API only
      await shoppingCartService.removeFromCart(cartItem.id);
      
      // Notify Navigation to reload cart
      window.dispatchEvent(new CustomEvent(Constants.EVENT_CART_UPDATED));
    } else {
      // Unauthenticated users: Remove from local state
      removeFromCart(cartItem.id);
    }
  }

  const quantity = cartItem.quantity;

  const thumbnail =
    Array.isArray(images) && images.length > 0 ? images[0] : placeholderImage;

  return (
    <Card
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        mb: 3
      }}
    >
      <Grid container spacing={2} alignItems="center">
        {/* Image */}
        <Grid size={3}>
          <CardMedia
            component="img"
            image={thumbnail}
            alt={name}
            sx={{
              width: "100%",
              height: 150,
              objectFit: "cover",
              borderRadius: 1,
              ml: 1
            }}
          />
        </Grid>

        <Grid size={9}>
          <Grid container spacing={1}>
            {/* Name and Description of product. */}
            <Grid size={9}>
              <CardContent sx={{ py: 0.5, px: 1 }}>
                <Typography
                  gutterBottom
                  variant="h6"
                  component="div"
                  noWrap
                  sx={{ mb: 0 }}
                >
                  {name}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  noWrap
                >
                  {description}
                </Typography>
              </CardContent>
            </Grid>

            {/* Price of Item */}
            <Grid size={3}>
              <CardContent sx={{ py: 0.5, px: 1, textAlign: "right" }}>
                <Typography
                  gutterBottom
                  fontWeight={"bold"}
                  component="div"
                >
                  {formatPrice(price, currency)}
                </Typography>
              </CardContent>
            </Grid>

            <Grid size={9}>
              <CardContent sx={{ display: "flex", alignItems: "center", gap: 1, px: 1 }}>

                {/* "-" button to remove quantities of that item. Cannot go below 0. */}
                <Button
                  variant="outlined"
                  color="inherit"
                  size="small"
                  sx={{ minWidth: "30px", padding: "4px 8px" }}
                  onClick={() => quantity ? 
                                  quantity > 1 ? handleUpdateQuantity(-1) : 0 
                                          : 
                                  0
                          }
                  disabled={quantity == 1}
                >
                  -
                </Button>

                {/* Field to show quantity of items to purchase. */}
                <TextField
                  variant="outlined"
                  value={quantity}
                  sx={{
                    mx: 1,
                    "& .MuiInputBase-input": {
                      textAlign: "center",
                      padding: "8px",
                      width: "40px",
                      minWidth: "40px",
                    }
                  }}
                />

                {/* "+" button to add quantities of that item. */}
                <Button
                  variant="outlined"
                  color="inherit"
                  size="small"
                  sx={{ minWidth: "30px", padding: "4px 8px" }}
                  onClick={() => handleUpdateQuantity(1)}
                >
                  +
                </Button>
              </CardContent>
            </Grid>

            {/* Icon for trash can to remove product. */}
            <Grid
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                alignItems: "flex-end"
              }}
              size={3}
            >
              <CardContent sx={{ py: 1 }}>
                <IconButton
                  onClick={removeCartItem}
                  sx={{ "&:focus": { outline: "none" } }}
                >
                  <DeleteForeverIcon color="error" />
                </IconButton>
              </CardContent>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
};

export default CartProductCard;
