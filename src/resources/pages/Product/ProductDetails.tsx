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
import RelatedProducts from "@/resources/components/RelatedProducts/RelatedProducts";

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
    addToCart(productDetails!, qty);
  }

  useEffect(() => {
    fetchProductDetails(productId);
  }, [productId]);

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
      // updated to use variants api
      if (result.variations?.Size?.length) {
        setItemSize(result.variations.Size[0]);
      }
      if (result.variations?.Color?.length) {
        setColour(result.variations.Color[0]);
      }
    } else console.error(`Nothing found for ${id}`); // frontend API error handling required?
  };

  // Loading state - might look into this as a component in the future when APIs take longer to call
  if (!productDetails) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "center",
          alignItems: { xs: "center", md: "flex-start" },
          padding: { xs: "2rem", md: "3rem" },
          gap: "2rem",
          width: "100%",
        }}
      >
        {/* img list */}
        <Box
          sx={{
            width: "100%",
            maxWidth: { xs: 350, sm: 500, md: 600 },
            display: "flex",
            justifyContent: "center",
          }}
        >
          <ImageList
            variant="quilted"
            cols={3}
            gap={4}
            sx={{
              width: "100%",
              maxWidth: { xs: 350, sm: 500, md: 600 },
            }}
          >
            {Array.isArray(images) && images.length > 0 ? (
              images
                .slice(
                  0,
                  collection.length > 0
                    ? maxImageListLength - 1
                    : maxImageListLength
                )
                .map((link, index) => (
                  <ImageListItem
                    key={`image-${index}`}
                    cols={index === 0 ? 3 : 1}
                    rows={index === 0 ? 3 : 1}
                    sx={{ p: 0 }}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        width: "100%",
                        paddingTop: "100%",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={link}
                        alt="image alt text"
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: index === 0 ? "16px" : "8px",
                        }}
                      />
                    </Box>
                  </ImageListItem>
                ))
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
            display: "flex",
            flexDirection: "column",
            gap: "30px",
            width: "100%",
            maxWidth: { xs: 350, sm: 500, md: 600 },
          }}
        >
          {/* Title, price, desc */}
          <Box
            sx={{
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

            {/* retrieving price from backend now */}
            {typeof price === "number" && (
              <Typography
                variant="caption"
                sx={{
                  color: "black",
                  fontSize: "1.5rem",
                }}
              >
                ${price.toFixed(2)}
              </Typography>
            )}

            <Divider orientation="horizontal" flexItem />

            <Typography variant="caption" sx={{ color: "grey" }}>
              {description}
            </Typography>
          </Box>

          {productDetails?.variations?.Color?.length > 0 && (
            <Box>
              <Box sx={{ display: "flex" }}>
                <Typography variant="body1">Colour:</Typography>
                <Typography
                  variant="body1"
                  sx={{ display: "inline", fontWeight: "600" }}
                >
                  {colour}
                </Typography>
              </Box>
              {productDetails?.variations?.Color?.map((color) => (
                <ButtonBase
                  key={color}
                  onClick={() => setColour(color)}
                  sx={{
                    width: 40,
                    height: 40,
                    backgroundColor: color,
                    borderRadius: "50%",
                    margin: "4px",
                    border:
                      colour === color
                        ? "2px solid black"
                        : "1px solid rgba(0, 0, 0, 0.23)",
                    boxSizing: "border-box",
                  }}
                ></ButtonBase>
              ))}
            </Box>
          )}

          {productDetails?.variations?.Size?.length > 0 && (
            <Box>
              <Box sx={{ display: "flex" }}>
                <Typography variant="body1">Size:</Typography>
                <Typography
                  variant="body1"
                  sx={{ display: "inline", fontWeight: "600" }}
                >
                  {itemSize}
                </Typography>
              </Box>
              {productDetails?.variations?.Size?.map((size) => (
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
          )}

          {/* Qty and cart - number input is real finnicky as MUI does not support fully */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              maxWidth: "500px",
              marginY: "1rem",
              gap: 3,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="body1">Quantity:</Typography>
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
                  padding: "4px",
                }}
              />
            </Box>
            <Box>
              <Button
                variant="outlined"
                sx={{
                  bgcolor: grey[900],
                  color: grey[50],
                  borderRadius: "8px",
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
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Divider sx={{ width: "100%", maxWidth: "50%" }} />
      </Box>
      <RelatedProducts product={productDetails} />
    </>
  );
}
