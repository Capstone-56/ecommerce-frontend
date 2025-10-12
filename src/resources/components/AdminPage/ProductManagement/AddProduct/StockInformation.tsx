import { VariationModel } from "@/domain/models/VariationModel";
import { VariationService } from "@/services/variation-service";
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import CancelIcon from '@mui/icons-material/Cancel';
import { FileWithPreview } from "./AddProduct";
import { ProductService } from "@/services/product-service";
import { StatusCodes } from "http-status-codes";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ProcessingDialog from "@/resources/components/ProcessingDialog/ProcessDialog";
import AddCircleIcon from '@mui/icons-material/AddCircle';

const variationService = new VariationService();
const productService = new ProductService();

interface StockInformationProps {
  category: string,
  productName: string,
  productDescription: string,
  price: number,
  images: FileWithPreview[],
  locations: string[],
  featured: string
}

/**
 * Component to be shown on the AddProduct page. Has input fields for specific
 * information about a products variants and items.
 */
export default function StockInformation(props: StockInformationProps) {
  const [listOfVariants, setListOfVariants] = useState<VariationModel[]>();
  const [chosenVariations, setChosenVariations] = useState<Record<string, { value: string, id: string }[]>>({});
  const [permutations, setPermutations] = useState<Record<string, string>[]>([]);
  const [removedPermutations, setRemovedPermutations] = useState<Record<string, string>[]>([]);
  const [selectedRemoved, setSelectedRemoved] = useState<Record<string, string>[]>([]);
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  /**
   * A useEffect required to get variations of the chosen category.
   */
  useEffect(() => {
    fetchRequiredInformation();
  }, []);

  /**
   * Opens the dialog for showing deleted rows 
   */
  const handleClickOpen = () => {
    setOpen(true);
  };

  /**
   * Handles the reverting of deleting a particular row. Appends the selected
   * delete variation and appends it to the end of the current permutations
   * to then display back on this table.
   */
  const handleRevert = () => {
    setPermutations(perms => [...perms, ...selectedRemoved]);

    // Remove them from removedPermutations.
    setRemovedPermutations(prev =>
      prev.filter(p => !selectedRemoved.includes(p))
    );

    // Clear selection and close dialog.
    setSelectedRemoved([]);
    setOpen(false);
  };

  /**
   * Updates the list of product permutations whenever the chosen variations change.
   *
   * Creates a map (`oldMap`) from the existing `permutations` for quick lookup.
   * Key format: concatenated string of the variation IDs.
   * Value: the permutation object containing sku, stock, etc.
   * 
   * Generates all possible combinations of the currently selected variations
   * using the `cartesianProduct` of `Object.values(chosenVariations)`.
   *
   * For each combination:
   * Creates a new permutation object with:
   * `key`: a stable identifier for lookup in `oldMap`.
   * Display values for each variation (e.g., color name, size).
   * IDs for each variation (e.g., colorId, sizeId).
   * Reuses the previous `sku` and `stock` if that combination already existed in `oldMap`.
   * 
   * Sets the new list of permutations.
   */
  useEffect(() => {
    // Required check to not render any rows given no variations are chosen.
    const variationValues = Object.values(chosenVariations).filter(v => v.length > 0);
    if (variationValues.length === 0) {
      setPermutations([]);
      return;
    }

    // Build a set of valid keys from new generated combos.
    const validKeys = new Set<string>();

    const generated = cartesianProduct(Object.values(chosenVariations)).map(values => {
      const combination: Record<string, string> = {
        location: "",
        sku: "",
        stock: ""
      };

      Object.keys(chosenVariations).forEach((key, i) => {
        combination[key] = values[i].value;
        combination[`${key}_id`] = values[i].id;
      });

      const key = Object.keys(chosenVariations)
        .map(k => combination[`${k}_id`])
        .join("|");

      validKeys.add(key);

      return { ...combination, _key: key };
    });

    const generatedMap = new Map(generated.map(g => [g._key, g]));

    // Removed rows (user deleted manually).
    const removedKeys = new Set(
      removedPermutations.map(p =>
        Object.keys(chosenVariations)
          .map(k => p[`${k}_id`])
          .join("|")
      )
    );

    // Keep old ones that are still valid + not removed.
    const kept = permutations.filter(p => {
      const key = Object.keys(chosenVariations)
        .map(k => p[`${k}_id`])
        .join("|");
      return validKeys.has(key) && !removedKeys.has(key);
    });

    // Append new ones that weren’t in the old list.
    const existingKeys = new Set(
      kept.map(p =>
        Object.keys(chosenVariations)
          .map(k => p[`${k}_id`])
          .join("|")
      )
    );

    const appended = Array.from(generatedMap.values())
      .filter(g => !existingKeys.has(g._key) && !removedKeys.has(g._key));

    // Merge, and strip out _key before saving
    const merged = [...kept, ...appended].map(({ _key, ...rest }) => rest);

    setPermutations(merged);
  }, [chosenVariations]);

  /**
   * Generates the Cartesian product of multiple arrays.
   * The Cartesian product is the set of all possible combinations
   * where one element is taken from each input array.
   * Example:
   *   cartesianProduct([[1, 2], ["A", "B"]])
   *   -> [
   *        [1, "A"],
   *        [1, "B"],
   *        [2, "A"],
   *        [2, "B"]
   *      ]
   * @param arrays An array of arrays, where each inner array represents a set of
   *               possible values for one "slot".
   * @returns A 2D array containing all possible combinations.
   */
  function cartesianProduct<T>(arrays: T[][]): T[][] {
    return arrays.reduce<T[][]>(
      (accumulated, currentArray) =>
        accumulated.flatMap(accumulated => currentArray.map(c => [...accumulated, c])),
      [[]]
    );
  }

  /**
   * Determines whether the add product button is disabled or not. Ensures that required
   * information is filled in, and that there is at least one permutation active with
   * each possible variant having at least one value chosen. 
   */
  function isDisabled() {
    return removedPermutations.length > 1 && permutations.length == 0 || listOfVariants &&
      (Object.keys(chosenVariations).length < listOfVariants?.length || Object.values(chosenVariations).some((value) => value.length === 0)) ||
      Object.values(permutations).some(permutation => (permutation.sku == "" || permutation.stock == ""))
  }

  /**
   * Sets list of variations from the database for this particular category.
   */
  const fetchRequiredInformation = async () => {
    setListOfVariants(await variationService.listVariations(props.category));
  }

  /**
   * Callback that handles the addition of a product to the database.
   * Calls API with user filled in information and returns to the product
   * management page if a success.
   */
  const handleAdditionOfProduct = useCallback(async () => {
    // Strip out all permutations that have been selected.
    // E.g. "BlueID", "XSID".
    // This is required to satisfy the format needed for the json body.
    const allVariations = permutations.map(permutation =>
      Object.keys(chosenVariations).map(key => ({
        variant: permutation[`${key}_id`]
      }))
    );

    setOpenDialog(true);

    const response = await productService.addProduct(
      props.productName,
      props.productDescription,
      props.category,
      props.featured,
      props.images,
      props.price,
      props.locations,
      permutations,
      allVariations
    );

    if (response.status == StatusCodes.CREATED) {
      setOpenDialog(false);
      toast.success("Product added successfully");
      navigate("/admin/product/management");
    } else {
      setOpenDialog(false);
      toast.error(response.errorMessage)
    }
  }, [permutations, chosenVariations])

  /**
   * Handles selecting or deselecting a product variation.
   *
   * @param type      The variation type (e.g., "Color", "Size").
   * @param value     The variation value to toggle (e.g., "Red", "XL").
   * @param variantId The unique backend ID for the variation.
   * @returns Updates chosenVariations state with the toggled variation.
   */
  const handleVariationPick = useCallback(
    (type: string, value: string, variantId: string) => {
      setChosenVariations(definedVariations => {
        const definedValues = definedVariations[type] || [];

        const newValues = definedValues.some(v => v.value === value)
          // Remove if already selected.
          ? definedValues.filter(v => v.value !== value)
          // Add if not selected.
          : [...definedValues, { value, id: variantId }];

        return {
          ...definedVariations,
          [type]: newValues,
        };
      });
    },
    []
  );

  return (
    <Box maxHeight={"100%"}>
      <Grid container spacing={3}>
        <Grid size={2}>
          <Card sx={{ height: "75vh", maxHeight: "75vh" }}>
            <Box
              sx={{
                backgroundColor: "#212E4A",
                color: "#8EB5C0",
                px: 2,
                py: 2,
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
                textAlign: "center"
              }}
            >
              <Typography variant="h6" fontWeight="bold" fontSize={15}>
                Variations
              </Typography>
            </Box>
            <CardContent sx={{
              height: "100%", overflowY: "auto",
              "&::-webkit-scrollbar": { width: "6px" },
              "&::-webkit-scrollbar-thumb": { backgroundColor: "#888", borderRadius: "3px" },
              "&::-webkit-scrollbar-thumb:hover": { backgroundColor: "#555" }
            }}>
              {listOfVariants && listOfVariants.length > 0 ?
                listOfVariants
                  .map((variant) => {
                    return (
                      <Box>
                        <Typography variant={"body1"}>{variant.name}</Typography>
                        <Typography variant={"body1"} fontSize={12} color={"textSecondary"} paddingBottom={1}>Pick Available {variant.name}</Typography>
                        {variant.variant_values.map((v) => {
                          const isSelected = chosenVariations[variant.name]?.some((selected) => selected.value === v.value);
                          return (
                            <Button
                              key={v.id}
                              variant="text"
                              sx={{
                                pb: 1.5,
                                mr: 1,
                                mb: 1,
                                backgroundColor: isSelected ? "primary.main" : "lightgrey",
                                color: isSelected ? "white" : "black",
                                maxWidth: "10%"
                              }}
                              color="secondary"
                              onClick={() => handleVariationPick(variant.name, v.value, v.id)}
                            >
                              {v.value}
                            </Button>
                          );
                        })}
                      </Box>
                    )
                  })
                : <Typography>No listed variants for this product</Typography>}
            </CardContent>
          </Card>
        </Grid>
        <Grid size={10}>
          <Paper>
            <TableContainer sx={{
              maxHeight: "75vh", minHeight: "75vh"
            }}>
              <Table stickyHeader sx={{ tableLayout: "fixed" }}>
                <TableHead>
                  <TableRow>
                    {listOfVariants?.map(variation => (
                      <TableCell sx={{
                        backgroundColor: "#212E4A",
                        color: "#8EB5C0",
                        fontWeight: "bold"
                      }}>{variation.name}</TableCell>
                    ))}
                    <TableCell sx={{
                      backgroundColor: "#212E4A",
                      color: "#8EB5C0",
                      fontWeight: "bold"
                    }}>Location</TableCell>
                    <TableCell sx={{
                      backgroundColor: "#212E4A",
                      color: "#8EB5C0",
                      fontWeight: "bold"
                    }}>SKU</TableCell>
                    <TableCell sx={{
                      backgroundColor: "#212E4A",
                      color: "#8EB5C0",
                      fontWeight: "bold"
                    }}>Stock</TableCell>
                    <TableCell sx={{
                      backgroundColor: "#212E4A",
                      color: "#8EB5C0",
                      fontWeight: "bold"
                    }}>Controls</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {permutations.map((permutation, rowIdx) => (
                    <TableRow key={rowIdx}>
                      {listOfVariants?.map((variant) => (
                        <TableCell key={variant.name}>
                          {permutation[variant.name] ?? ""}
                        </TableCell>
                      ))}

                      <TableCell>
                        <TextField
                          select
                          value={permutation["location"]}
                          onChange={(e) => {
                            setPermutations((prev) =>
                              prev.map((p, idx) =>
                                idx === rowIdx ? { ...p, location: e.target.value } : p
                              )
                            )
                          }}
                          sx={{ minWidth: "33%", mr: "10px" }}
                          fullWidth
                        >
                          <MenuItem key={"initial"} value={"initial"} disabled>
                            Choose listing location...
                          </MenuItem>
                          {props.locations && props.locations.map((location) => (
                            <MenuItem key={location} value={location}>
                              {location}
                            </MenuItem>
                          ))}
                        </TextField>
                      </TableCell>

                      <TableCell>
                        <TextField
                          value={permutation["sku"] ?? ""}
                          onChange={(e) =>
                            setPermutations((prev) =>
                              prev.map((p, idx) =>
                                idx === rowIdx ? { ...p, sku: e.target.value } : p
                              )
                            )
                          }
                        />
                      </TableCell>

                      <TableCell>
                        <TextField
                          value={permutation["stock"] ?? ""}
                          onChange={(e) =>
                            setPermutations((prev) =>
                              prev.map((p, idx) =>
                                idx === rowIdx ? { ...p, stock: e.target.value } : p
                              )
                            )
                          }
                        />
                      </TableCell>

                      <TableCell>
                        <Tooltip title="Remove variation">
                          <IconButton
                            onClick={() => {
                              setPermutations((prev) =>
                                prev.filter((_, idx) => idx !== rowIdx)
                              );
                              setRemovedPermutations((prev) => [...prev, permutation]);
                            }}
                          >
                            <CancelIcon fontSize="medium" color="error" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}

                  <TableRow>
                    <TableCell sx={{ textAlign: "center" }} colSpan={(listOfVariants?.length ?? 0) + 4}>
                      <Button
                        endIcon={<AddCircleIcon />}
                        variant="outlined"
                        onClick={() => {
                          if (!listOfVariants) return;

                          // build an empty row with all variant names
                          const emptyRow: Record<string, string> = listOfVariants.reduce(
                            (acc, variant) => ({ ...acc, [variant.name]: "" }),
                            { sku: "", stock: "" }
                          );

                          // append it to permutations
                          setPermutations((prev) => [...prev, emptyRow]);
                        }}
                      >
                        Add row
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>

              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid >
      <Box display={"flex"} justifyContent={"right"} pt={2}>
        <Button variant={"contained"} onClick={handleClickOpen} sx={{ mr: 2 }}>
          Show deleted variations
        </Button>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            List of deleted variations
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <List sx={{ width: '100%', maxWidth: 500, bgcolor: 'background.paper' }}>
                {removedPermutations.length > 0 ? removedPermutations.map((value) => {
                  const labelId = `checkbox-list-label-${value}`;
                  return (
                    <ListItem
                      disablePadding
                    >
                      <ListItemButton role={undefined} dense>
                        <ListItemIcon>
                          <Checkbox
                            edge="start"
                            tabIndex={-1}
                            disableRipple
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedRemoved(perms => [...perms, value]);
                              } else {
                                setSelectedRemoved(perms => perms.filter(v => v !== value));
                              }
                            }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          id={labelId}
                          primary={
                            Object.entries(value)
                              .filter(([key, _]) => !key.endsWith("_id"))
                              .map(([key, value]) => `${key}: ${value}`)
                              .join("\n")} sx={{ whiteSpace: "pre-line" }
                              }
                        />
                      </ListItemButton>
                    </ListItem>
                  );
                }) : <Typography>No current variations have been deleted</Typography>}
              </List>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Close</Button>
            <Button onClick={handleRevert} autoFocus disabled={selectedRemoved.length < 1}>
              Add selected rows back
            </Button>
          </DialogActions>
        </Dialog>
        <Tooltip
          title={"Ensure your variations are set and each have their own SKU and stock set"}
          disableHoverListener={!isDisabled()}
          arrow
          placement={"top"}
        >
          <span>
            <Button
              variant={"contained"}
              onClick={handleAdditionOfProduct}
              disabled={isDisabled()}
            >
              Add Product
            </Button>
          </span>
        </Tooltip>
      </Box>
      <ProcessingDialog openDialog={openDialog} dialogHeading={"Processing new product"} />
    </Box >
  )
}
