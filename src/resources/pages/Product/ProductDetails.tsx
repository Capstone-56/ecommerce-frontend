// A ProductDetails page component that displays the details of a product

import { Link, useLocation, useParams } from "react-router-dom";

import { ProductModel } from "@/domain/models/ProductModel";
import { useEffect, useState } from "react";
import { ProductService } from "@/services/product-service";
import {
  Box,
  Breadcrumbs,
  Container,
  Typography,
  ImageList,
  ImageListItem,
  Divider,
  ButtonBase,
} from "@mui/material";

const PLACEHOLDER_COLORS = ["green", "red", "blue", "brown"];
const PLACEHOLDER_SIZES = ["sm", "md", "lg"];

export default function ProductDetails() {
  const [productDetails, setProductDetails] = useState<ProductModel>();
  const [collection, setCollection] = useState<string[]>();
  const [colour, setColour] = useState<string>();
  const { id: productId = "null" } = useParams();
  const { name, description, images, price } = productDetails || {};

  useEffect(() => {
    fetchProductDetails(productId);
  }, []);

  // If surpassing 4 image links, the 4th image in list will be a collection
  if (images && images.length > 4) {
    setCollection(images.slice(3));
  }

  const fetchProductDetails = async (id: string) => {
    const productService = new ProductService();
    const result = await productService.getProduct(id);
    setProductDetails(result);
  };

  // Loading state - might look into this as a component in the future when APIs take longer to call
  if (!productDetails) {
    return <div>Loading...</div>;
  }

  // DEBUG
  console.log(productDetails);
  console.log(collection);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        justifyContent: { md: "center" },
        margin: "2rem",
        paddingX: { xs: "2rem", md: "6rem" },
        gap: "2rem",
      }}
    >
      {/* img list */}
      <Box sx={{ flex: "1 1 auto" }}>
        <ImageList
          variant="quilted"
          cols={3}
          rowHeight={140}
          gap={4}
          sx={{
            marginLeft: { md: "auto" },
          }}
        >
          {Array.isArray(images) && images.length > 0 ? (
            images.map((link, index) =>
              index === 0 ? (
                <ImageListItem key={`image-${index}`} cols={3} rows={3}>
                  <img
                    src={`${link}`}
                    alt="image alt text"
                    style={{ objectFit: "cover", borderRadius: "16px" }}
                  />
                </ImageListItem>
              ) : (
                <ImageListItem key={`image-${index}`}>
                  <img
                    src={`${link}`}
                    alt="image alt text"
                    style={{ objectFit: "cover", borderRadius: "8px" }}
                  />
                </ImageListItem>
              )
            )
          ) : (
            <Box>
              <Typography>No images available</Typography>
            </Box>
          )}
        </ImageList>
      </Box>

      {/* details */}
      <Box
        sx={{
          flex: "1 1 auto",
          flexDirection: "column",
        }}
      >
        <Typography
          variant="h2"
          sx={{
            color: "black",
            fontWeight: "400",
            fontSize: { xs: "48px", md: "36px" },
          }}
        >
          {name}
        </Typography>
        <Typography
          variant="caption"
          sx={{ color: "black", fontSize: "1.5rem", marginTop: "1rem" }}
        >
          $25.00
        </Typography>
        <Divider orientation="horizontal" flexItem />

        <Typography variant="caption" sx={{ color: "grey" }}>
          {description}
        </Typography>
        <Box sx={{ marginY: "2rem" }}>
          {PLACEHOLDER_COLORS.map((color) => (
            <ButtonBase
              key={color}
              onClick={() => {
                console.log(color);
                setColour(color);
              }}
              sx={{
                width: "60px",
                height: "60px",
                backgroundColor: color,
                borderRadius: "8px",
                margin: "2px",
              }}
            >
              <Box
                sx={{
                  color: { color },
                  width: "40px",
                  height: "40px",
                  objectFit: "cover",
                }}
              ></Box>
            </ButtonBase>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
