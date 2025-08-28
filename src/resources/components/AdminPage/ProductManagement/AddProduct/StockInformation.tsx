import { VariationModel } from "@/domain/models/VariationModel";
import { VariationService } from "@/services/variation-service";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
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

const variationService = new VariationService();
const productService = new ProductService();

interface StockInformationProps {
  category: string,
  productName: string,
  productDescription: string,
  price: number,
  images: FileWithPreview[],
  location: string,
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
  const navigate = useNavigate();

  /**
   * A useEffect required to get variations of the chosen category.
   */
  useEffect(() => {
    fetchRequiredInformation();
  }, []);

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
    const oldMap = new Map(
      permutations.map(p => [
        Object.keys(chosenVariations).map(k => p[`${k}_id`]).join('|'),
        p
      ])
    );

    const newPermutations = cartesianProduct(Object.values(chosenVariations)).map(values => {
      const combination: Record<string, string> = {};

      Object.keys(chosenVariations).forEach((key, i) => {
        // Display value.
        combination[key] = values[i].value;
        // Store the ID
        combination[`${key}_id`] = values[i].id;
      });

      // Generate a stable key for oldMap lookup.
      const key = Object.keys(chosenVariations).map(k => values.find(v => v.value === combination[k])?.id).join('|');

      // Reuse previous sku and stock if they exist.
      const old = oldMap.get(key);
      combination.sku = old?.sku ?? "";
      combination.stock = old?.stock ?? "";

      return combination;
    });

    setPermutations(newPermutations);
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
    return listOfVariants &&
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

    const response = await productService.addProduct(
      props.productName,
      props.productDescription,
      props.category,
      props.featured,
      props.images,
      props.price,
      props.location,
      permutations,
      allVariations
    );

    if (response == StatusCodes.CREATED) {
      toast.success("Product added successfully");
      navigate("/admin/product/management");
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
          <Card sx={{ maxHeight: "75vh" }}>
            <CardContent>
              {listOfVariants &&
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
              }
            </CardContent>
          </Card>
        </Grid>
        <Grid size={10}>
          <Paper>
            <TableContainer sx={{
              maxHeight: "75vh", minHeight: "75vh"
            }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    {listOfVariants?.map(variation => (
                      <TableCell sx={{
                        backgroundColor: "#212E4A",
                        color: "#8EB5C0", width: "25%",
                        fontWeight: "bold"
                      }}>{variation.name}</TableCell>
                    ))}
                    <TableCell sx={{
                      backgroundColor: "#212E4A",
                      color: "#8EB5C0", width: "25%",
                      fontWeight: "bold"
                    }}>SKU</TableCell>
                    <TableCell sx={{
                      backgroundColor: "#212E4A",
                      color: "#8EB5C0", width: "25%",
                      fontWeight: "bold"
                    }}>Stock</TableCell>
                    <TableCell sx={{
                      backgroundColor: "#212E4A",
                      color: "#8EB5C0", width: "25%",
                      fontWeight: "bold"
                    }}>Controls</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {permutations.map((permutation, rowIdx) => (
                    <TableRow key={rowIdx}>
                      {listOfVariants?.map(variant => (
                        <TableCell key={variant.name}>
                          {permutation[variant.name] ?? ""}
                        </TableCell>
                      ))}
                      <TableCell>
                        <TextField
                          value={permutation["sku"] ?? ""}
                          onChange={(e) => (setPermutations(prev =>
                            prev.map((p, idx) =>
                              idx === rowIdx
                                ? { ...p, sku: e.target.value }  // add or update sku
                                : p
                            )
                          ))
                          }></TextField>
                      </TableCell>
                      <TableCell>
                        <TextField
                          value={permutation["stock"] ?? ""}
                          onChange={(e) => (setPermutations(prev =>
                            prev.map((p, idx) =>
                              idx === rowIdx
                                ? { ...p, stock: e.target.value }  // add or update sku
                                : p
                            )
                          ))
                          }></TextField>
                      </TableCell>
                      <TableCell>
                        <Tooltip title={"Remove variation"}>
                          <IconButton onClick={() => setPermutations(permutations.filter((row) => row !== permutation))}>
                            <CancelIcon fontSize={"medium"} color={"error"} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid >
      <Box display={"flex"} justifyContent={"right"} pt={2}>
        <Tooltip
          title={"Ensure your variations are set and each have their own SKU and stock set"}
          disableHoverListener={!isDisabled()}
          arrow
          placement={"left"}
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
    </Box >
  )
}
