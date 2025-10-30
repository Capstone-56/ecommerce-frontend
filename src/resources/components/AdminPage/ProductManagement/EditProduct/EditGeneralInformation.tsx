import {
  Box,
  Button,
  Card,
  CardMedia,
  Checkbox,
  FormControlLabel,
  Grid,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { ProductService } from "@/services/product-service";
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { ProductModel } from "@/domain/models/ProductModel";
import { CategoryModel } from "@/domain/models/CategoryModel";
import { CategoryService } from "@/services/category-service";
import { LocationService } from "@/services/location-service";
import { LocationModel } from "@/domain/models/LocationModel";
import { StatusCodes } from "http-status-codes";
import { toast } from "react-toastify";
import ModifyImages from "@/resources/components/ModifyImages/ModifyImages";
import { isEqual } from "lodash";

export interface EditGeneralInformationProps {
  product: ProductModel
  value: string,
  setValue: (value: string) => void,
  draft: Partial<ProductModel>
  setDraft: Dispatch<SetStateAction<Partial<ProductModel>>>;
  onImagesUpdated: () => void;
}

const productService = new ProductService();
const categoryService = new CategoryService();
const locationService = new LocationService();

/**
 * A component to be shown on the edit product page to show general product details
 * which can be edited and configured.
 */
export default function EditGeneralInformation(props: EditGeneralInformationProps) {
  const [listOfCategories, setListOfCategories] = useState<CategoryModel[]>();
  const [listOfLocations, setListOfLocations] = useState<LocationModel[]>();
  const [isDisabled, setIsDisabled] = useState(true);

  /**
   * A useEffect required to get required information.
   */
  useEffect(() => {
    fetchRequiredInformation();
  }, []);

  /**
   * A function that handles the value change of fields from admin input.
   * @param event An input from an admin.
   */
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.setValue((event.target as HTMLInputElement).value);
    props.setDraft((prev) => ({ ...prev, featured: event.target.value === "true" }));
  };

  /**
   * Handle updating price for a specific location
   */
  const handleLocationPriceChange = (countryCode: string, price: number) => {
    props.setDraft((prev) => ({
      ...prev,
      location_pricing: (prev.location_pricing || []).map(lp => 
        lp.country_code === countryCode ? { ...lp, price } : lp
      )
    }));
  };

  /**
   * Helper function to determine whether an admin has altered a field to
   * be updated.
   * @returns A True or False depending on whether there have been changes.
   */
  const isDraftChanged = (): boolean => {
    if (!props.product) return false;

    // Compare each relevant field.
    return (
      props.draft.name !== props.product.name ||
      props.draft.description !== props.product.description ||
      props.draft.price !== props.product.price ||
      props.draft.featured !== props.product.featured ||
      props.draft.category !== props.product.category ||
      !isEqual(props.draft.location_pricing, props.product.location_pricing)
    );
  };

  /**
   * A function that gets the required information for locations
   * and categories a product can be listed in.
   */
  const fetchRequiredInformation = async () => {
    setListOfCategories(await categoryService.listCategories());
    setListOfLocations(await locationService.getLocations());
  };

  /**
   * Handles the saving of changes to product information.
   * via updates to the database.
   */
  const handleSaveChanges = useCallback(async () => {
    if (!props.product) return;

    const updates: Partial<ProductModel> = {};
    Object.keys(props.draft).forEach((key) => {
      if ((props.draft as any)[key] !== (props.product as any)[key]) {
        (updates as any)[key] = (props.draft as any)[key];
      }
    });

    const response = await productService.updateProductPartial(props.product.id, updates);

    if (response == StatusCodes.OK) {
      toast.success("Product updated successfully");
      setIsDisabled(true);
    } else {
      toast.error("Failed to update product");
    }
  }, [props.draft, props.product]);

  return (
    <Grid container spacing={3}>
      {/* Product Details */}
      <Grid size={{ xs: 12, lg: 8 }}>
        {props.product && (
          <Card sx={{ p: 3 }}>
            <Grid container spacing={2}>
              <Grid size={12}>
                <Typography>Product Name</Typography>
                <TextField
                  fullWidth
                  value={props.draft.name ?? ""}
                  disabled={isDisabled}
                  onChange={(e) => props.setDraft((prev) => ({ ...prev, name: e.target.value }))}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography>Featured</Typography>
                <RadioGroup row value={props.value} onChange={handleChange} sx={{ mt: 1 }}>
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
                  multiline
                  minRows={3}
                  value={props.draft.description ?? ""}
                  disabled={isDisabled}
                  onChange={(e) => props.setDraft((prev) => ({ ...prev, description: e.target.value }))}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography>Category</Typography>
                <TextField
                  select
                  value={props.draft.category && listOfCategories ? props.draft.category : ""}
                  onChange={(e) => props.setDraft((prev) => ({ ...prev, category: e.target.value }))}
                  disabled={isDisabled}
                  fullWidth
                >
                  {(listOfCategories ?? []).map((option) => (
                    <MenuItem key={option.internalName} value={option.internalName}>
                      {option.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography>Location Availability</Typography>
                <Select
                  disabled={isDisabled}
                  multiple
                  displayEmpty
                  fullWidth
                  value={props.draft.location_pricing?.map(lp => lp.country_code) ?? []}
                  onChange={(event) => {
                    const {
                      target: { value },
                    } = event;

                    const newLocations = typeof value === 'string' ? value.split(',') : value;

                    props.setDraft((prev) => {
                      // Create pricing entries for new locations, preserve existing ones
                      const updatedPricing = newLocations.map((countryCode: string) => {
                        const existingPricing = (prev.location_pricing || []).find(lp => lp.country_code === countryCode);
                        return existingPricing || { country_code: countryCode, price: 0};
                      });

                      return {
                        ...prev,
                        location_pricing: updatedPricing,
                      };
                    });
                  }}
                  renderValue={(selected) => {
                    if (selected.length === 0) {
                      return (
                        <Typography fontStyle="italic" color="textDisabled">
                          Choose a location
                        </Typography>
                      );
                    }

                    return (
                      <Typography
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {selected.join(', ')}
                      </Typography>
                    );
                  }}
                  input={<OutlinedInput label="Tag" />}
                >
                  {(listOfLocations ?? []).map((location) => (
                    <MenuItem key={location.country_code} value={location.country_code}>
                      <Checkbox checked={props.draft.location_pricing?.some(lp => lp.country_code === location.country_code) || false} />
                      <ListItemText primary={location.country_name} />
                    </MenuItem>
                  ))}
                </Select>
              </Grid>

              {/* Location Pricing Section */}
              {(props.draft.location_pricing && props.draft.location_pricing.length > 0) && (
                <Grid size={12}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2, mb: 2 }}>
                    Location Pricing
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Set prices for each selected location
                  </Typography>
                  {props.draft.location_pricing.map((locationPrice) => {
                    const countryCode = locationPrice.country_code;
                    const locationData = listOfLocations?.find(loc => loc.country_code === countryCode);
                    const currentPricing = (props.draft.location_pricing || []).find(lp => lp.country_code === countryCode);
                    const currentPrice = currentPricing?.price || 0;
                    const currentDiscount = currentPricing?.discount || 0;
                    
                    return (
                      <Box key={countryCode} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1, backgroundColor: isDisabled ? '#f5f5f5' : 'white' }}>
                        <Grid container spacing={2} alignItems="center">
                          <Grid size={{ xs: 12, sm: 4 }}>
                            <Typography variant="body1" fontWeight="medium">
                              {locationData?.country_name || countryCode}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {countryCode}
                            </Typography>
                          </Grid>
                          <Grid size={{ xs: 12, sm: 4 }}>
                            <TextField
                              type="number"
                              label="Price"
                              size="small"
                              value={currentPrice === 0 ? '' : currentPrice}
                              disabled={isDisabled}
                              onChange={(e) => {
                                const price = parseFloat(e.target.value) || 0;
                                handleLocationPriceChange(countryCode, price);
                              }}
                              placeholder="0.00"
                              slotProps={{ 
                                htmlInput: {
                                  min: 0, 
                                  step: 0.01,
                                  'aria-label': `Price for ${locationData?.country_name || countryCode}`
                                }
                              }}
                              fullWidth
                            />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 4 }}>
                            <TextField
                              type="number"
                              label="Discount (Coming Soon)"
                              size="small"
                              value={currentDiscount === 0 ? '' : currentDiscount}
                              disabled={true}
                              placeholder="0.00"
                              slotProps={{ 
                                htmlInput: {
                                  min: 0, 
                                  step: 0.01,
                                  'aria-label': `Discount for ${locationData?.country_name || countryCode}`
                                }
                              }}
                              fullWidth
                            />
                          </Grid>
                        </Grid>
                      </Box>
                    );
                  })}
                </Grid>
              )}

              <Grid size={12} display="flex" justifyContent="flex-end">
                <Button
                  variant="contained"
                  onClick={() => setIsDisabled(!isDisabled)}
                  color={isDisabled ? "primary" : "error"}
                >
                  {isDisabled ? "Edit" : "Cancel"}
                </Button>
                {!isDisabled && (
                  <Button
                    sx={{ ml: 2 }}
                    variant="contained"
                    color="success"
                    onClick={handleSaveChanges}
                    disabled={!isDraftChanged()}
                  >
                    Apply
                  </Button>
                )}
              </Grid>
            </Grid>
          </Card>
        )}
      </Grid>

      {/* Product Image */}
      <Grid size={{ xs: 12, lg: 4 }} height={"100%"}>
        {props.product?.images && (
          <Card>
            <CardMedia
              component="img"
              image={props.product.images[0]}
              alt={props.product.name}
              loading="lazy"
              sx={{
                width: "100%",
                height: "auto",
                objectFit: "cover",
                aspectRatio: 1 / 1,
              }}
            />
            <ModifyImages product={props.product} onImagesUpdated={props.onImagesUpdated} />
          </Card>
        )}
      </Grid>
    </Grid >
  );
}
