import React from "react";
import { Card, CardMedia, CardContent, Typography, Box } from "@mui/material";

interface Product {
  id: string;
  name: string;
  price: number;
  brand?: string;
  category: string;
  thumbnail?: string;
  inStock: boolean;
}

interface ProductCardProps {
  product: Product;
  onClick: (productId: string) => void; // callback to handle redirection
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const { id, name, price, thumbnail, brand, category, inStock } = product;

  const handleClick = () => {
    onClick(id); // triggers navigation to product info page
  };

  return (
    <Card
      sx={{
        width: 300,
        height: 400,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "transform 0.2s",
        "&:hover": { transform: "scale(1.009)" }, // tiny hover effect, may not use in final design
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
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </Box>

       {/* product details */}
       <CardContent sx={{ textAlign: 'left', paddingY: 1, paddingX: 1.5 }}>
        {/* brand & category */}
        {(brand || category) && (
          <Typography variant="body2" color="text.secondary" sx = {{ mb: 0 }}>
            {brand && category ? `${brand} • ${category}` : brand || category}
          </Typography>
        )}

          {/* product name */}
          <Typography gutterBottom variant="h6" component="div" noWrap sx = {{ mb: 0 }} >
            {name}
          </Typography>

          {/* price and stock status */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              variant="h6"
              sx={{
                color: "black",
                fontWeight: "bold",
                textDecoration: inStock ? "none" : "line-through", // strikethrough if out of stock
              }}
            >
              ${price.toFixed(2)}
            </Typography>

            {!inStock && (
              <Typography
                variant="body2"
                color="error"
                sx={{ ml: 1 }} // margin-left for spacing
              >
                Out of Stock
              </Typography>
            )}
          </Box>
        </CardContent>
    </Card>
  );
};

export default ProductCard;
