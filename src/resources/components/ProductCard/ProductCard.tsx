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
  onClickCallback?: () => void;
}

/**
 * The product card component. Will be used to display products throughout the website
 * to users and have the ability to transfer them to the product's detail page.
 */
const ProductCard: React.FC<ProductCardProps> = ({
  product,
  width,
  height,
  onClickCallback
}) => {
  const { id, name, images, price, currency } = product;
  const navigate = useNavigate();
  /**
   * When clicked direct the user to the product's detail page.
   */
  const handleClick = () => {
    navigate(`/products/${id}/details`);
    window.scrollTo(0, 0);
  };

  // Currently choose the first image, otherwise if no image specified display a placeholder image.
  const thumbnail =
    Array.isArray(images) && images.length > 0 ? images[0] : placeholderImage;

  return (
    <Card
      sx={{
        width: "100%",
        minWidth: "300px",
        maxWidth: "433px",
        aspectRatio: "433 / 596",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s",
        "&:hover": { transform: "scale(1.009)" },
        cursor: "pointer",
        overflow: "hidden",
        boxShadow: "none",
      }}
      onClick={onClickCallback ? onClickCallback : handleClick}
    >
      {/* product image */}
      <Box 
        sx={{ 
          width: "100%",
          aspectRatio: "433 / 472",
          flexShrink: 0,
          overflow: "hidden",
        }}
      >
        <CardMedia
          component="img"
          image={thumbnail}
          alt={name}
          loading="lazy"
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "10px",
          }}
        />
      </Box>

      {/* product details: name and price */}
      <CardContent sx={{ textAlign: "left", paddingY: 0, paddingX: 0, flexGrow: 0, flexShrink: 0, flexBasis: "auto" }}>
         <Typography
           variant="body2"
           component="div"
           sx={{ 
             fontSize: "20px",
             fontWeight: 500,
             mb: "14px",
             marginTop: "14px",
             overflow: 'hidden',
             textOverflow: 'ellipsis',
             whiteSpace: 'nowrap',
           }}
         >
           {name}
         </Typography>

         <Typography
           variant="subtitle1"
           sx={{
             fontSize: "20px",
             fontWeight: 700,
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
