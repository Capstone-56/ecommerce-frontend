import { Box, Button, Card, CardMedia, FormControlLabel, Grid, Radio, RadioGroup, TextField, Typography } from "@mui/material";
import { useLocation } from "react-router";
import { ProductService } from "@/services/product-service";
import { useEffect, useState } from "react";
import { ProductModel } from "@/domain/models/ProductModel";

const productService = new ProductService();

/**
 * An edit product page to show details which can be edited and configured.
 */
export default function EditProduct() {
  const [product, setProduct] = useState<ProductModel>();
  const [isDisabled, setIsDisabled] = useState(true);
  const [value, setValue] = useState<string>();

  const location = useLocation();
  const { productId } = location.state;

  /**
   * A useEffect required to get product details to edit.
   */
  useEffect(() => {
    fetchProduct();
  }, []);

  /**
   * Handles the change of featured field. Required to change between values of
   * True and False when either is being clicked by the user.
   * @param event The action of a user clicking a radio button.
   */
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };

  /**
   * Fetches for product details based on the ID.
   */
  const fetchProduct = async () => {
    try {
      const response = await productService.getProduct(productId);
      setProduct(response);
      setValue(response.featured.toString());
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  };

  return (
    <Box>
      <Typography pb={2} variant={"h4"}>Edit Product</Typography>
      <Box display={"flex"} minWidth={"100%"}>
        {product && product.images &&
          <Box maxWidth={"30%"} pr={2}>
            <CardMedia
              component="img"
              image={product.images[0]}
              alt={product.name}
              sx={{
                width: "100%",
                height: "80%",
                objectFit: "cover",
              }}
            />
          </Box>
        }
        {product &&
          <Box maxWidth={"70%"}>
            <Card>
              <Grid container spacing={2} p={3}>
                <Grid size={12}>
                  <Typography>Product Name</Typography>
                  <TextField
                    fullWidth
                    defaultValue={product.name}
                    disabled={isDisabled}
                  />
                </Grid>
                <Grid size={6}>
                  <Typography>Price</Typography>
                  <TextField
                    fullWidth
                    defaultValue={product.price}
                    disabled={isDisabled}
                  />
                </Grid>
                <Grid size={6}>
                  <Typography>Featured</Typography>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    value={value}
                    onChange={handleChange}
                    sx={{ marginTop: "5px" }}
                  >
                    <FormControlLabel
                      value="true"
                      control={<Radio />}
                      label="True"
                      disabled={isDisabled}
                    />
                    <FormControlLabel
                      value="false"
                      control={<Radio />}
                      label="False"
                      disabled={isDisabled}
                    />
                  </RadioGroup>
                </Grid>
                <Grid size={12}>
                  <Typography>Description</Typography>
                  <TextField
                    fullWidth
                    defaultValue={product.description}
                    disabled={isDisabled}
                  />
                </Grid>
                <Grid size={12}>
                  <Typography>Product Images</Typography>
                  <TextField
                    fullWidth
                    defaultValue={product.images}
                    disabled={isDisabled}
                  />
                </Grid>
                <Grid size={12} justifyContent={"right"} display={"flex"}>
                  <Button variant="contained" onClick={() => setIsDisabled(!isDisabled)} color={isDisabled ? "primary" : "error"}>
                    {isDisabled ? "Edit" : "Cancel"}
                  </Button>
                  {!isDisabled &&
                    <Button sx={{ marginLeft: "5px" }} variant="contained" onClick={() => { }}>Apply</Button>
                  }
                </Grid>
              </Grid>
            </Card>
          </Box>
        }
      </Box>
    </Box >
  );
};
