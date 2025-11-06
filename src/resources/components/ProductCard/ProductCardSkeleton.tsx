import React from "react";
import { Card, CardContent, Box, Skeleton } from "@mui/material";

/**
 * Skeleton loading component for ProductCard that matches its dimensions and layout.
 */
const ProductCardSkeleton: React.FC = () => {
  return (
    <Card
      sx={{
        width: "100%",
        minWidth: "300px",
        maxWidth: "433px",
        aspectRatio: "433 / 596",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        boxShadow: "none",
      }}
    >
      {/* Skeleton for product image */}
      <Box 
        sx={{ 
          width: "100%",
          aspectRatio: "433 / 472",
          flexShrink: 0,
          overflow: "hidden",
        }}
      >
        <Skeleton 
          variant="rectangular" 
          width="100%" 
          height="100%" 
          sx={{ 
            borderRadius: "10px",
          }} 
        />
      </Box>

      {/* Skeleton for product details: name and price */}
      <CardContent sx={{ textAlign: "left", paddingY: 0, paddingX: 0, flexGrow: 0, flexShrink: 0, flexBasis: "auto" }}>
        {/* Skeleton for product name */}
        <Skeleton 
          variant="text" 
          width="80%" 
          height={28}
          sx={{ 
            marginTop: "14px",
            mb: "14px",
          }} 
        />

        {/* Skeleton for product price */}
        <Skeleton 
          variant="text" 
          width="40%" 
          height={28}
        />
      </CardContent>
    </Card>
  );
};

export default ProductCardSkeleton;

