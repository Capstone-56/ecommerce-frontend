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
  Input,
  TextField,
  Button,
} from "@mui/material";
import { grey } from "@mui/material/colors";

const PLACEHOLDER_COLORS = ["green", "red", "blue", "brown"];
const PLACEHOLDER_SIZES = ["sm", "md", "lg"];
const PLACEHOLDER_SIZES_NUMBERS = ["28", "30", "32", "34", "36", "38"];

export default function ProductDetails() {
  const [productDetails, setProductDetails] = useState<ProductModel>();
  const [collection, setCollection] = useState<string[]>();
  const [colour, setColour] = useState<string>();
  const [size, setSize] = useState<string>();
  const [qty, setQty] = useState<number>(1);
  const { id: productId = "null" } = useParams();
  const { name, description, images, price } = productDetails || {};

  // // DEBUG
  // console.log(productDetails);
  // console.log("Collection: ", collection);
  // console.log("Length of images list:", images?.length);

  // Event handlers for num input
  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const value = event.target.value;

    if (/^\d*$/.test(value)) {
      const numericValue = Math.min(Math.max(Number(value), 1), 99);
      setQty(numericValue);
    }
  }
  function handleKeyPress(
    event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const invalidKeys = ["e", "E", "+", "-", "."];

    if (invalidKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  useEffect(() => {
    fetchProductDetails(productId);
  }, []);

  // If surpassing 4 image links, the 4th image in list will be a collection
  useEffect(() => {
    if (Array.isArray(images) && images.length > 4) {
      setCollection(images.slice(3));
    }
  }, [images]);

  const fetchProductDetails = async (id: string) => {
    const productService = new ProductService();
    const result = await productService.getProduct(id);
    if (result) setProductDetails(result);
    else console.log(`Nothing found for ${id}`);
  };

  // Loading state - might look into this as a component in the future when APIs take longer to call
  if (!productDetails) {
    return <div>Loading...</div>;
  }
  // Error state? Bring this up with the guys

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        justifyContent: "center",
        margin: "2rem",
        paddingX: { xs: "2rem", md: "3rem" },
        gap: "2rem",
      }}
    >
      {/* img list */}
      <Box sx={{ flex: "1 1 auto", justifyContent: "flex-end" }}>
        <ImageList
          variant="quilted"
          cols={3}
          rowHeight={140}
          gap={4}
          sx={{
            marginLeft: { md: "auto" },
            width: { xs: "100%", md: "80%" },
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

      {/* details section (populated based on api resp) */}
      <Box
        sx={{
          flex: "1 1 auto",
          display: "flex",
          flexDirection: "column",
          gap: "30px",
        }}
      >
        <Box
          sx={{
            width: { xs: "100%", md: "65%" },
            maxWidth: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "18px",
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

          {/* price - returning as null so hardcoded for now */}
          <Typography
            variant="caption"
            sx={{
              color: "black",
              fontSize: "1.5rem",
            }}
          >
            $25
          </Typography>

          <Divider orientation="horizontal" flexItem />

          <Typography variant="caption" sx={{ color: "grey" }}>
            {description}
          </Typography>
        </Box>

        <Box>
          <Typography variant="body1">
            Colour:{"  "}
            <Typography
              variant="body1"
              sx={{ display: "inline", fontWeight: "600" }}
            >
              {colour}
            </Typography>
          </Typography>
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

        <Box>
          <Typography variant="body1">
            Size:{"  "}
            <Typography
              variant="body1"
              sx={{ display: "inline", fontWeight: "600" }}
            >
              {size}
            </Typography>
          </Typography>
          {PLACEHOLDER_SIZES_NUMBERS.map((size) => (
            <ButtonBase
              key={size}
              onClick={() => {
                console.log(size);
                setSize(size);
              }}
              sx={{
                width: "40px",
                height: "40px",
                borderRadius: "8px",
                margin: "2px",
                backgroundColor: "#E7E7E7",
              }}
            >
              <Typography>{size}</Typography>
            </ButtonBase>
          ))}
        </Box>

        {/* Qty and cart - number input is real finnicky as MUI does not support fully */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            width: { xs: "100%", md: "65%" },
            maxWidth: "100%",
            marginY: "1rem",
          }}
        >
          <Input
            type="number"
            value={qty}
            onChange={(event) => {
              handleChange(event);
            }}
            onKeyDown={(event) => {
              handleKeyPress(event);
            }}
            inputProps={{
              min: 1,
              max: 99,
            }}
            sx={{
              "& input": {
                textAlign: "center",
              },
            }}
          />
          <Button
            variant="outlined"
            sx={{
              bgcolor: grey[900],
              color: grey[50],
              borderRadius: "8px",
              mx: "1rem",
              width: "100%",
              maxWidth: "100%",
            }}
          >
            <Typography fontWeight="500" textTransform="none">
              Add to Cart
            </Typography>
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
