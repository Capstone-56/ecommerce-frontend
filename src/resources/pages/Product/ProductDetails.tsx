import { useParams } from "react-router-dom";

import { Constants } from "@/domain/constants";
import { ProductModel } from "@/domain/models/ProductModel";
import { AddShoppingCartItemModel, LocalShoppingCartItemModel } from "@/domain/models/ShoppingCartItemModel";


import { useEffect, useState } from "react";

import { ProductService } from "@/services/product-service";
import { ShoppingCartService } from "@/services/shopping-cart-service";
import { ProductItemService } from "@/services/product-item-service";
import { VariationService } from "@/services/variation-service";

import * as MathUtils from "@/utilities/math-utils";

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
import { ZoomIn } from "@mui/icons-material";

import { cartState, authenticationState, locationState } from "@/domain/state";

import RelatedProducts from "@/resources/components/RelatedProducts/RelatedProducts";
import { formatPrice } from "@/utilities/currency-utils";

const maxImageListLength = 4;

const productService = new ProductService();
const shoppingCartService = new ShoppingCartService();
const productItemService = new ProductItemService();
const variationService = new VariationService();

export default function ProductDetails() {
  const [productDetails, setProductDetails] = useState<ProductModel>();
  const [collection, setCollection] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [imageOpen, setImageOpen] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedVariants, setSelectedVariants] = useState<Map<string, string>>(new Map()); // Map of variant type to selected value
  const [qty, setQty] = useState<number>(1);
  const [variantValueToIdMap, setVariantValueToIdMap] = useState<Map<string, string>>(new Map());
  const { id: productId = "null" } = useParams();
  const { name, description, images, price, currency, avgRating, featured } =
    productDetails || {};
  const { addToCart } = cartState();
  const { authenticated } = authenticationState();
  const userLocation = locationState((state) => state.userLocation);
  const userCurrency = locationState((state) => state.getUserCurrency());

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

  async function handleAddToCart() {
    try {
      // Build array of selected variant IDs from the user's selections
      const selectedVariantIds: string[] = [];
      
      // Iterate through all selected variants and get their IDs
      selectedVariants.forEach((variantValue) => {
        const variantId = variantValueToIdMap.get(variantValue);
        if (variantId) {
          selectedVariantIds.push(variantId);
        }
      });

      // Get the product item ID that matches the selected configurations
      const { id: productItemId } = await productItemService.retrieveByConfigurations(
        productId,
        selectedVariantIds
      );

      // Get the full product item details for the matched item
      const productItems = await productItemService.getByProductId(productId, userLocation, userCurrency);
      const selectedProductItem = productItems.find(item => item.id === productItemId);
      
      // TODO: Handle case where no matching product item is found. (e.g., when blue m is not available, it should likely be grayed out similar to stock = 0)
      // for now just yell at user
      if (!selectedProductItem) {
        console.error("Could not find product item matching the selected configuration");
        return;
      }

      if (authenticated) {
        // Check if location is available
        if (!userLocation) {
          console.error("User location is required to add items to cart");
          alert("Please set your location to add items to cart");
          return;
        }

        const model: AddShoppingCartItemModel = {
          productItemId: selectedProductItem.id,
          quantity: qty,
        };

        // Pass userLocation as second parameter
        await shoppingCartService.addToCart(model, userLocation);

        // Dispatch custom event to notify Navigation to reload cart
        window.dispatchEvent(new CustomEvent(Constants.EVENT_CART_UPDATED));
      } else {
        // For unauthenticated users, manually create a local cart item
        const cartItem: LocalShoppingCartItemModel = {
          id: MathUtils.generateGUID(),
          productItem: selectedProductItem,
          quantity: qty,
          totalPrice: selectedProductItem.price * qty,
        };

        addToCart(cartItem);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  }

  useEffect(() => {
    fetchProductDetails(productId);
  }, [productId, userLocation, userCurrency]);

  // If surpassing 4 image links, the 4th image in list will be a collection
  useEffect(() => {
    if (Array.isArray(images) && images.length > maxImageListLength) {
      setCollection(images.slice(maxImageListLength - 1));
    }
  }, [images]);

  const fetchProductDetails = async (id: string) => {
    const result = await productService.getProduct(
      id,
      userLocation,
      userCurrency
    );
    if (result) {
      setProductDetails(result);
      
      // Fetch variations for the product's category to build value-to-ID mapping
      if (result.category) {
        try {
          const variations = await variationService.listVariations(result.category);
          const valueToIdMap = new Map<string, string>();
          
          // Build map from variant value to variant ID
          variations.forEach(variation => {
            variation.variations?.forEach(variantValue => {
              valueToIdMap.set(variantValue.value, variantValue.id);
            });
          });
          
          setVariantValueToIdMap(valueToIdMap);
        } catch (error) {
          console.error("Error fetching variations:", error);
        }
      }
      
      // Set default selections for all variant types
      if (result.variations) {
        const defaultSelections = new Map<string, string>();
        Object.entries(result.variations).forEach(([variantType, values]) => {
          if (Array.isArray(values) && values.length > 0) {
            defaultSelections.set(variantType, values[0]);
          }
        });
        setSelectedVariants(defaultSelections);
      }
    } else console.error(`Nothing found for ${id}`);
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
          padding: { xs: "2rem", md: "3rem"},
          gap: "2rem",
          width: "100%",
          maxWidth: "1680px",
          mx: "auto",
        }}
      >
        {/* img list */}
        <Box
          sx={{
            width: "100%",
            maxWidth: { xs: 350, sm: 500, md: 800 },
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
              maxWidth: { xs: 350, sm: 500, md: 800 },
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
                        cursor: "pointer",
                        "&:hover img": {
                          opacity: 0.9,
                        },
                      }}
                    >
                      <img
                        src={link}
                        alt="image alt text"
                        loading="lazy"
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: index === 0 ? "16px" : "8px",
                          transition: "opacity 0.2s ease",
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
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    paddingTop: "100%",
                    overflow: "hidden",
                    cursor: "pointer",
                    "&:hover img": {
                      opacity: 0.9,
                    },
                  }}
                >
                  <img
                    src={collection[0]}
                    alt="More images"
                    loading="lazy"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "8px",
                      transition: "opacity 0.2s ease",
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      backgroundColor: "rgba(0, 0, 0, 0.6)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "8px",
                    }}
                  >
                    <Typography variant="h6" color="white">
                      +{collection.length} More
                    </Typography>
                  </Box>
                </Box>
              </ImageListItem>
            )}
          </ImageList>

          <Dialog open={dialogOpen} onClose={handleCloseDialog}>
            <DialogTitle>More images for {name}</DialogTitle>
            <DialogContent>
              <Grid container spacing={2}>
                {collection.map((image, index) => (
                  <Grid size={4} key={index}>
                    <Box
                      sx={{
                        position: "relative",
                        cursor: "pointer",
                        overflow: "hidden",
                        borderRadius: "8px",
                        "&:hover img": {
                          opacity: 0.8,
                        },
                      }}
                      onClick={() => handleOpenImage(image)}
                    >
                      <img
                        src={image}
                        alt={name}
                        style={{ 
                          width: "100%", 
                          height: "auto",
                          transition: "opacity 0.2s ease",
                        }}
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
                    </Box>
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
            maxWidth: { xs: 350, sm: 500, md: 800 },
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
                paddingTop: "24px",
              }}
            >
              {name}
            </Typography>

            {/* retrieving price from backend now */}
            {price && currency && (
              <Typography
                variant="caption"
                sx={{
                  color: "black",
                  fontSize: "1.5rem",
                }}
              >
                {formatPrice(price, currency)}
              </Typography>
            )}

            <Divider orientation="horizontal" flexItem />

            <Typography variant="caption" sx={{ color: "grey" }}>
              {description}
            </Typography>
          </Box>

          {/* Dynamic variant rendering for any variant type */}
          {productDetails?.variations && Object.entries(productDetails.variations).map(([variantType, values]) => {
            if (!Array.isArray(values) || values.length === 0) return null;
            
            const selectedValue = selectedVariants.get(variantType);
            const isColorVariant = variantType.toLowerCase() === 'color' || variantType.toLowerCase() === 'colour';
            
            return (
              <Box key={variantType}>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Typography variant="body1">{variantType}:</Typography>
                  <Typography
                    variant="body1"
                    sx={{ display: "inline", fontWeight: "600" }}
                  >
                    {selectedValue}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                  {values.map((value) => (
                    <ButtonBase
                      key={value}
                      onClick={() => {
                        setSelectedVariants(prev => {
                          const updated = new Map(prev);
                          updated.set(variantType, value);
                          return updated;
                        });
                      }}
                      sx={{
                        width: isColorVariant ? 40 : "auto",
                        height: "40px",
                        minWidth: isColorVariant ? 40 : "40px",
                        paddingX: isColorVariant ? 0 : "12px",
                        backgroundColor: isColorVariant ? value : "#E7E7E7",
                        borderRadius: isColorVariant ? "50%" : "8px",
                        margin: "4px",
                        border:
                          selectedValue === value
                            ? isColorVariant 
                              ? "2px solid black"
                              : `2px solid ${grey[900]}`
                            : isColorVariant
                              ? "1px solid rgba(0, 0, 0, 0.23)"
                              : "1px solid transparent",
                        boxSizing: "border-box",
                      }}
                    >
                      {!isColorVariant && <Typography>{value}</Typography>}
                    </ButtonBase>
                  ))}
                </Box>
              </Box>
            );
          })}

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
