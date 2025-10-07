import React from "react";
import { Card, CardMedia, CardContent, Typography, Box } from "@mui/material";
import { ProductModel } from "domain/models/ProductModel";
import placeholderImage from "/src/assets/ProductCard/product_card_placeholder.svg";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "@/utilities/currency-utils";

interface ProductCardProps {
  /* Details relating to a particular product. */
  product: ProductModel;
  /* The width to set the product card. */
  width: string;
  /* The height to set the product card. */
  height: string;
}

/**
 * The product card component. Will be used to display products throughout the website
 * to users and have the ability to transfer them to the product's detail page.
 */
const ProductCard: React.FC<ProductCardProps> = ({
  product,
  width,
  height,
}) => {
  const { id, name, description, images, price, currency } = product;
  const navigate = useNavigate();
  /**
   * When clicked direct the user to the product's detail page.
   */
  const handleClick = () => {
    // window.location.href = `/products/${id}/details`;
    navigate(`/products/${id}/details`);
  };

  // Currently choose the first image, otherwise if no image specified display a placeholder image.
  const thumbnail =
    Array.isArray(images) && images.length > 0 ? images[0] : placeholderImage;

  return (
    <Card
      sx={{
        width: width,
        height: height,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "transform 0.2s",
        "&:hover": { transform: "scale(1.009)" },
        cursor: "pointer",
        overflow: "hidden",
        boxShadow: "none",
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
            borderRadius: "10px",
          }}
        />
      </Box>

      {/* product details: name, description, colour count, and price */}
      <CardContent sx={{ textAlign: "left", paddingY: 1, paddingX: 1.5 }}>
        <Typography
          gutterBottom
          variant="h6"
          component="div"
          sx={{ mb: 0, whiteSpace: 'normal', overflowWrap: 'anywhere' }}
        >
          {name}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'normal', overflowWrap: 'anywhere' }}>
          {description}
        </Typography>
        {product.variations?.Color && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.5, display: "block" }}
          >
            {product.variations.Color.length} colour
            {product.variations.Color.length > 1 ? "s" : ""}
          </Typography>
        )}
        <Typography 
          variant="subtitle1" 
          sx={{ 
            fontWeight: 'bold',
            mt: 1, 
            color: '#000',
          }}
        >
          {formatPrice(price, currency)}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
