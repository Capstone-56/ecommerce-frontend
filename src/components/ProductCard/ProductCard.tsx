import React from "react";
import { Card, CardMedia, CardContent, Typography, Box } from "@mui/material";
import { ProductModel } from "domain/models/ProductModel";
import placeholderImage from '/src/assets/ProductCard/product_card_placeholder.svg';

interface ProductCardProps {
  product: ProductModel;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { id, name, description, images } = product;

  const handleClick = () => {
    window.location.href = `/products/${id}/details`;
  };

  // not sure if we want to use a placeholder image, or just have nothing if images is null
  const thumbnail = (Array.isArray(images) && images.length > 0) ? images[0] : placeholderImage;

  return (
    <Card
      sx={{
        width: 300,
        height: 400,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "transform 0.2s",
        "&:hover": { transform: "scale(1.009)" },
        cursor: "pointer",
        overflow: "hidden",
      }}
      onClick={handleClick}
    >
      {/* product image */}
      <Box sx={{ flexGrow: 1 }}>
        <CardMedia
          component="img"
          image={thumbnail}
          alt={name}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </Box>

      {/* product name & description */}
      <CardContent sx={{ textAlign: "left", paddingY: 1, paddingX: 1.5 }}>
        <Typography gutterBottom variant="h6" component="div" noWrap sx={{ mb: 0 }}>
          {name}
        </Typography>

        <Typography variant="body2" color="text.secondary" noWrap>
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
