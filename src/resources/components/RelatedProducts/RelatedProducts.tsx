import { ProductModel } from "@/domain/models/ProductModel";
import { ProductService } from "@/services/product-service";
import { useEffect, useState } from "react";
import ProductCard from "../ProductCard/ProductCard";
import { Box, Typography } from "@mui/material";
import { locationState } from "@/domain/state";

type RelatedProductsProps = {
  product: ProductModel;
};

/**
 * Related product component to be displayed to users when viewing a
 * particular product. Will show other products that the user may like
 * based on the currently viewed one.
 */
export default function ProductDetails(props: RelatedProductsProps) {
  const [relatedProducts, setRelatedProducts] = useState<Array<ProductModel>>(
    []
  );
  const userLocation = locationState((state) => state.userLocation);

  useEffect(() => {
    getRelatedProducts();
  }, [props.product, userLocation]);

  /**
   * Retrieves the related products.
   */
  const getRelatedProducts = async () => {
    const productService = new ProductService();
    const response = await productService.getRelatedProducts(props.product.id, userLocation);
    if (response) {
      setRelatedProducts(response);
    } else {
      console.log("Error retrieving related products, " + response);
    }
  };

  return (
    <>
      <Typography
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "center",
          textAlign: "center",
          margin: "2rem",
          paddingX: { xs: "2rem" },
          gap: "2rem",
        }}
        variant="h5"
        fontWeight="bold"
        gutterBottom
      >
        Related Products
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 4,
          maxWidth: "90%",
          mx: "6rem",
        }}
      >
        {relatedProducts.length > 0 ? (
          relatedProducts.map((product) => (
            <Box key={product.id} sx={{ width: 250, height: 350 }}>
              <ProductCard product={product} width="250px" height="350px" />
            </Box>
          ))
        ) : (
          <Typography>Loading...</Typography>
        )}
      </Box>
    </>
  );
}
