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
import { ProductModel } from "domain/models/ProductModel";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import placeholderImage from "/src/assets/ProductCard/product_card_placeholder.svg";
import { common } from "@mui/material/colors";
import { cartState } from "@/domain/state";

interface ProductCardProps {
  product: ProductModel;
}

/**
 * The card component to display products when users view their cart. 
 */
const CartProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { name, description, images, price } = product;
  const removeProduct = cartState((state) => state.removeFromCart);
  const updateProduct = cartState((state) => state.updateQuantity);
  const getProductQuantity = cartState((state) => state.getQuantity);
  const quantity = getProductQuantity(product);

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

            {/* Price of Item. TODO: Swap with the products price type when available. */}
            <Grid size={3}>
              <CardContent sx={{ py: 0.5, px: 1, textAlign: "right" }}>
                <Typography
                  gutterBottom
                  fontWeight={"bold"}
                  component="div"
                >
                  {price}
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
                  onClick={() => quantity ? quantity > 1 ? updateProduct(product, -1) : 0 : 0}
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
                  onClick={() => updateProduct(product, 1)}
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
                  onClick={() => removeProduct(product)}
                  sx={{ "&:focus": { outline: "none" } }}
                  >
                  <DeleteOutlineIcon sx={{ color: common.black }} />
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
