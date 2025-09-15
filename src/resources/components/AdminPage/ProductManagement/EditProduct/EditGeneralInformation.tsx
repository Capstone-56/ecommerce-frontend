import {
  Button,
  Card,
  CardMedia,
  FormControlLabel,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
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
      props.draft.locations?.[0] !== props.product.locations?.[0]
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
      {/* Product Image */}
      <Grid size={{ xs: 12, lg: 4 }} height={"100%"}>
        {props.product?.images && (
          <Card>
            <CardMedia
              component="img"
              image={props.product.images[0]}
              alt={props.product.name}
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
                <Typography>Price</Typography>
                <TextField
                  fullWidth
                  type="number"
                  value={props.draft.price ?? ""}
                  disabled={isDisabled}
                  onChange={(e) => props.setDraft((prev) => ({ ...prev, price: Number(e.target.value) }))}
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
                <Typography>Location</Typography>
                <TextField
                  select
                  value={props.draft.locations && listOfLocations ? props.draft.locations[0] : ""}
                  onChange={(e) =>
                    props.setDraft((prev) => ({ ...prev, locations: [e.target.value] }))
                  }
                  disabled={isDisabled}
                  fullWidth
                >
                  {(listOfLocations ?? []).map((option) => (
                    <MenuItem key={option.country_code} value={option.country_code}>
                      {option.country_name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

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
    </Grid >
  );
}
