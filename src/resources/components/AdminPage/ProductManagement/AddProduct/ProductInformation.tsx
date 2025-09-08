import {
  Box,
  Button,
  Card,
  CardContent,
  FormControlLabel,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
  styled,
  TextField,
  Typography
} from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useEffect, useState } from "react";
import { CategoryModel } from "@/domain/models/CategoryModel";
import { CategoryService } from "@/services/category-service";
import { FileWithPreview } from "./AddProduct";
import { LocationService } from "@/services/location-service";
import { LocationModel } from "@/domain/models/LocationModel";

const categoryService = new CategoryService();
const locationService = new LocationService();

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});


interface ProductInformationProps {
  productName: string,
  setProductName: (v: string) => void,
  productDescription: string,
  setProductDescription: (v: string) => void,
  category: string,
  setCategory: (v: string) => void,
  price: number,
  setPrice: (v: number) => void,
  location: string,
  setLocation: (v: string) => void,
  files: FileWithPreview[],
  setFiles: React.Dispatch<React.SetStateAction<FileWithPreview[]>>,
  featured: string,
  setFeatured: (v: string) => void,
}

/**
 * Component to be shown on the AddProduct page. Has input fields for generic
 * information about a product.
 */
export default function ProductInformation(props: ProductInformationProps) {
  const [listOfCategories, setListOfCategories] = useState<CategoryModel[]>();
  const [listOfLocations, setListOfLocations] = useState<LocationModel[]>();
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [preview, setPreview] = useState<string>("");

  /**
   * A useEffect required to get product categories.
   */
  useEffect(() => {
    fetchRequiredInformation();
  }, []);

  /**
   * Sets the list of categories to be displayed to the user. Retrieves all
   * current categories in the database.
   */
  const fetchRequiredInformation = async () => {
    setListOfCategories(await categoryService.listCategories());
    setListOfLocations(await locationService.getLocations());
  }

  /**
   * Handles uploading of files (images) for an admin to display an image
   * for the product they wish to add.
   * @param event The uploading HTML event.
   * @param index The index at which the file will be uploaded at.
   */
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    // If there are no files early return.
    if (!event.target.files) return;

    const file = event.target.files[0];
    // Check to see if the file uploaded already exists within our files.
    const exists = props.files.some(
      (f) => f.file.name === file.name && f.file.size === file.size
    );

    // If it doesn't exist add it to the list of files. Otherwise, don't do anything
    // and keep the files the way it is.
    if (!exists) {
      // Create an object URL to be used for the display image when selected.
      const image = URL.createObjectURL(file);
      props.setFiles((prev) => [...prev, { file, previewImage: image }]);
      // Set the preview and index to show a border around the newly added image and
      // its picture to be in the preview slot.
      setPreview(image);
      setSelectedIndex(index);
    }
  };

  /**
   * Handler for deleting a file. Utilises the selected index and preview image
   * to delete a specific image. Filters the current files for where the index is
   * not that of the selected one. Also sets the preview to an empty string 
   * to reset the preview image and avoid null pointer exceptions.
   */
  function handleFileDeletion() {
    props.setFiles(props.files.filter((_, i) => i !== selectedIndex));
    setPreview("");
  }

  return (
    <Box>
      <Grid container columnSpacing={2} rowSpacing={1} alignItems="flex-start">
        <Grid container direction="column" size={{ sm: 12, md: 8 }}>
          <Grid>
            <Card>
              <CardContent>
                <Typography variant={"body1"} pb={2} fontSize={18} fontWeight={"bold"}>General Information</Typography>
                <Typography variant={"body1"} pb={1}>Name of Product</Typography>
                <TextField
                  defaultValue={props.productName}
                  fullWidth
                  placeholder="Enter product name..."
                  sx={{ pb: 2 }}
                  onChange={(e) => props.setProductName(e.target.value)}
                />
                <Typography variant={"body1"} pb={1}>Description of Product</Typography>
                <TextField
                  defaultValue={props.productDescription}
                  fullWidth
                  placeholder="Enter product description..."
                  multiline
                  minRows={4}
                  maxRows={4}
                  sx={{ pb: 2 }}
                  slotProps={{ htmlInput: { maxLength: 255 } }}
                  onChange={(e) => props.setProductDescription(e.target.value)}
                />
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant={"body1"} pb={1}>Category of Product</Typography>
                    <TextField
                      select
                      value={props.category}
                      onChange={(e) => props.setCategory(e.target.value)}
                      sx={{ pb: 2, minWidth: "60%", mr: "10px" }}
                    >
                      <MenuItem key={"initial"} value={"initial"} disabled>
                        Choose category...
                      </MenuItem>
                      {listOfCategories?.map((option) => (
                        <MenuItem key={option.internalName} value={option.internalName}>
                          {option.name}
                        </MenuItem>
                      ))}
                    </TextField>
                    <div>
                      <Button variant={"contained"}>Add Category</Button>
                    </div>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant={"body1"} pb={1}>Featured</Typography>
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="row-radio-buttons-group"
                      value={props.featured}
                      onChange={(event) => props.setFeatured((event.target as HTMLInputElement).value)}
                      sx={{ marginTop: "5px" }}
                    >
                      <FormControlLabel
                        value="true"
                        control={<Radio />}
                        label="True"
                      />
                      <FormControlLabel
                        value="false"
                        control={<Radio />}
                        label="False"
                      />
                    </RadioGroup>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid>
            <Card>
              <CardContent>
                <Typography variant={"body1"} pb={2} fontSize={18} fontWeight={"bold"}>Pricing and Stock</Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant={"body1"} pb={1}>Pricing</Typography>
                    <TextField
                      defaultValue={props.price == 0 ? null : props.price}
                      fullWidth
                      placeholder={"Enter price..."}
                      onChange={(e) => props.setPrice(parseFloat(e.target.value.toString()))}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant={"body1"} pb={1}>Discount</Typography>
                    <TextField
                      fullWidth
                      placeholder={"Enter discount..."}
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Grid container size={{ sm: 12, md: 4 }} direction={"column"}>
          <Grid>
            <Card>
              <CardContent>
                <Typography variant={"body1"} pb={2} fontSize={18} fontWeight={"bold"}>Upload Image</Typography>
                <Box
                  sx={{
                    minHeight: "30vh",
                    border: preview ? "none" : "3px dashed lightgrey",
                    color: "lightgrey",
                    backgroundColor: "white",
                    backgroundImage: `url(${preview})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    padding: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                </Box>
                <Button
                  variant={"contained"}
                  sx={{ mt: 1 }}
                  fullWidth
                  disabled={!preview}
                  color={"error"}
                  onClick={handleFileDeletion}
                >
                  Remove Preview Image
                </Button>
                <Box display={"flex"} gap={3} pt={2} height={"10vh"}>
                  <Button
                    component="label"
                    role={undefined}
                    variant="text"
                    tabIndex={-1}
                    sx={{
                      border: "3px",
                      borderStyle: props.files[0] ? selectedIndex == 0 ? "solid" : "" : "dashed",
                      color: "lightgrey",
                      backgroundColor: "white",
                      width: "25%",
                      backgroundImage: props.files[0] ? `url(${props.files[0].previewImage})` : "none",
                      aspectRatio: "1 / 1",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                    onClick={() => {
                      if (props.files[0]) {
                        setPreview(props.files[0].previewImage);
                        setSelectedIndex(0);
                      }
                    }}
                  >
                    {!props.files[0] && <AddCircleIcon fontSize="medium" color="info" />}
                    <VisuallyHiddenInput
                      type="file"
                      onChange={(e) => {
                        handleFileChange(e, 0);
                        e.target.value = "";
                      }}
                      multiple
                      disabled={props.files[0] ? true : false}
                    />
                  </Button>
                  <Button
                    component="label"
                    role={undefined}
                    variant="text"
                    tabIndex={-1}
                    sx={{
                      border: "3px",
                      borderStyle: props.files[1] ? selectedIndex == 1 ? "solid" : "" : "dashed",
                      color: "lightgrey",
                      backgroundColor: "white",
                      width: "25%",
                      backgroundImage: props.files[1] ? `url(${props.files[1].previewImage})` : "none",
                      aspectRatio: "1 / 1",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                    onClick={() => {
                      if (props.files[1]) {
                        setPreview(props.files[1].previewImage);
                        setSelectedIndex(1);
                      }
                    }}
                  >
                    {!props.files[1] && <AddCircleIcon fontSize="medium" color="info" />}
                    <VisuallyHiddenInput
                      type="file"
                      onChange={(e) => {
                        handleFileChange(e, 1);
                        e.target.value = "";
                      }}
                      multiple
                      disabled={props.files[1] ? true : false}
                    />
                  </Button>
                  <Button
                    component="label"
                    role={undefined}
                    variant="text"
                    tabIndex={-1}
                    sx={{
                      border: "3px",
                      borderStyle: props.files[2] ? selectedIndex == 2 ? "solid" : "" : "dashed",
                      color: "lightgrey",
                      backgroundColor: "white",
                      width: "25%",
                      backgroundImage: props.files[2] ? `url(${props.files[2].previewImage})` : "none",
                      aspectRatio: "1 / 1",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                    onClick={() => {
                      if (props.files[2]) {
                        setPreview(props.files[2].previewImage);
                        setSelectedIndex(2);
                      }
                    }}
                  >
                    {!props.files[2] && <AddCircleIcon fontSize="medium" color="info" />}
                    <VisuallyHiddenInput
                      type="file"
                      onChange={(e) => {
                        handleFileChange(e, 2);
                        e.target.value = "";
                      }}
                      multiple
                      disabled={props.files[2] ? true : false}
                    />
                  </Button>
                  <Button
                    component="label"
                    role={undefined}
                    variant="text"
                    tabIndex={-1}
                    sx={{
                      border: "3px",
                      borderStyle: props.files[3] ? selectedIndex == 3 ? "solid" : "" : "dashed",
                      color: "lightgrey",
                      backgroundColor: "white",
                      width: "25%",
                      backgroundImage: props.files[3] ? `url(${props.files[3].previewImage})` : "none",
                      aspectRatio: "1 / 1",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                    onClick={() => {
                      if (props.files[3]) {
                        setPreview(props.files[3].previewImage);
                        setSelectedIndex(3);
                      }
                    }}
                  >
                    {!props.files[3] && <AddCircleIcon fontSize="medium" color="info" />}
                    <VisuallyHiddenInput
                      type="file"
                      onChange={(e) => {
                        handleFileChange(e, 3);
                        e.target.value = "";
                      }}
                      multiple
                      disabled={props.files[3] ? true : false}
                    />
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid>
            <Card>
              <CardContent>
                <Typography variant={"body1"} pb={2} fontSize={18} fontWeight={"bold"}>Location</Typography>
                <Typography variant={"body1"} pb={1}>Location of Product</Typography>
                <TextField
                  select
                  value={props.location}
                  onChange={(e) => { console.log(e.target.value); props.setLocation(e.target.value) }}
                  sx={{ pb: 2, minWidth: "33%", mr: "10px" }}
                  fullWidth
                >
                  <MenuItem key={"initial"} value={"initial"} disabled>
                    Choose listing location...
                  </MenuItem>
                  {listOfLocations && listOfLocations.map((location) => (
                    <MenuItem key={location.country_code} value={location.country_code}>
                      {location.country_name}
                    </MenuItem>
                  ))}
                </TextField>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </Box >
  );
};
