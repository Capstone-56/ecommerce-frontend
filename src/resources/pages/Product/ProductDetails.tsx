import { Link, useLocation, useParams } from "react-router-dom";

import { ProductModel } from "@/domain/models/ProductModel";
import { useEffect, useState } from "react";
import { ProductService } from "@/services/product-service";
import {
  Box,
  Typography,
  ImageList,
  ImageListItem,
  Divider,
  ButtonBase,
  Input,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  IconButton,
} from "@mui/material";

import { grey } from "@mui/material/colors";

import { Close } from "@mui/icons-material";

import { cartState } from "@/domain/state";
import { ZoomIn } from "@mui/icons-material";

const PLACEHOLDER_COLORS = ["green", "red", "blue", "brown"];
const PLACEHOLDER_SIZES_NUMBERS = ["28", "30", "32", "34", "36", "38"];
const maxImageListLength = 4;

export default function ProductDetails() {
  const [productDetails, setProductDetails] = useState<ProductModel>();
  const [collection, setCollection] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [imageOpen, setImageOpen] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [colour, setColour] = useState<string>();
  const [itemSize, setItemSize] = useState<string>();
  const [qty, setQty] = useState<number>(1);
  const { id: productId = "null" } = useParams();
  const { name, description, images, price, avgRating, featured } =
    productDetails || {};
  const { addToCart } = cartState();

  // Event handlers for number input
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

  // Image list Dialog handlers
  function handleCloseDialog() {
    setDialogOpen(false);
    setSelectedImage(null);
  }

  // Single Image Dialog handler
  function handleOpenImage(image: string) {
    setSelectedImage(image);
    setImageOpen(true);
  }

  function handleCloseImage() {
    setSelectedImage(null);
    setImageOpen(false);
  }

  // TODO: consider making some fields optional as they aren't all relevant to purchases
  function handleAddToCart() {
    if (
      qty &&
      itemSize &&
      colour &&
      name &&
      featured &&
      avgRating &&
      description &&
      images
    ) {
      const product: ProductModel = {
        id: productId,
        name,
        description,
        avgRating: avgRating,
        featured: featured,
        images: images,
        price: 25,
      };
      addToCart(product);
    }
  }

  useEffect(() => {
    fetchProductDetails(productId);
  }, []);

  // If surpassing 4 image links, the 4th image in list will be a collection
  useEffect(() => {
    if (Array.isArray(images) && images.length > maxImageListLength) {
      setCollection(images.slice(maxImageListLength - 1));
    }
  }, [images]);

  const fetchProductDetails = async (id: string) => {
    const productService = new ProductService();
    const result = await productService.getProduct(id);
    if (result) {
      setProductDetails(result);
      // temporary - needs to be based on variants
      setItemSize(PLACEHOLDER_SIZES_NUMBERS[0]);
      setColour(PLACEHOLDER_COLORS[0]);
    } else console.error(`Nothing found for ${id}`); // frontend API error handling required?
  };

  // Loading state - might look into this as a component in the future when APIs take longer to call
  if (!productDetails) {
    return <div>Loading...</div>;
  }

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
            images.slice(0, maxImageListLength - 1).map((link, index) =>
              index === 0 ? (
                <ImageListItem key={`image-${index}`} cols={3} rows={3}>
                  <img
                    src={link}
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
          {collection.length > 0 && (
            <ImageListItem key="panel" onClick={() => setDialogOpen(true)}>
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: "#ccc",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  cursor: "pointer",
                  borderRadius: "8px",
                }}
              >
                <Typography variant="h6" color="white">
                  +{collection.length} More
                </Typography>
              </div>
            </ImageListItem>
          )}
        </ImageList>

        <Dialog open={dialogOpen} onClose={handleCloseDialog}>
          <DialogTitle>More images for {name}</DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              {collection.map((image, index) => (
                <Grid size={4} key={index}>
                  <div
                    style={{
                      position: "relative",
                      cursor: "pointer",
                      overflow: "hidden",
                      borderRadius: 8,
                    }}
                    onClick={() => handleOpenImage(image)}
                  >
                    <img
                      src={image}
                      alt={name}
                      style={{ width: "100%", height: "auto" }}
                    />
                    <IconButton
                      style={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        color: "white",
                      }}
                      onClick={() => handleOpenImage(image)}
                    >
                      <ZoomIn />
                    </IconButton>
                  </div>
                </Grid>
              ))}
            </Grid>
          </DialogContent>
        </Dialog>

        {/* for clicking on individual images */}
        <Dialog open={imageOpen} onClose={handleCloseImage}>
          <IconButton
            aria-label="close"
            onClick={handleCloseImage}
            sx={(theme) => ({
              position: "absolute",
              right: 8,
              top: 8,
              color: theme.palette.grey[500],
            })}
          >
            <Close />
          </IconButton>
          <DialogContent>
            <img
              src={selectedImage || ""}
              alt="Selected Image"
              style={{ width: "100%" }}
            />
          </DialogContent>
        </Dialog>
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
                setColour(color);
              }}
              sx={{
                width: "60px",
                height: "60px",
                backgroundColor: color,
                borderRadius: "8px",
                margin: "2px",
                border:
                  colour === color
                    ? `3px solid ${grey[900]}`
                    : "1px solid transparent",
              }}
            ></ButtonBase>
          ))}
        </Box>

        <Box>
          <Typography variant="body1">
            Size:{"  "}
            <Typography
              variant="body1"
              sx={{ display: "inline", fontWeight: "600" }}
            >
              {itemSize}
            </Typography>
          </Typography>
          {PLACEHOLDER_SIZES_NUMBERS.map((size) => (
            <ButtonBase
              key={size}
              onClick={() => {
                setItemSize(size);
              }}
              sx={{
                width: "40px",
                height: "40px",
                borderRadius: "8px",
                margin: "2px",
                backgroundColor: "#E7E7E7",
                border:
                  size === itemSize
                    ? `2px solid ${grey[900]}`
                    : "1px solid transparent",
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
            onClick={handleAddToCart}
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
