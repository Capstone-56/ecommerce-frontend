import { VariationModel } from "@/domain/models/VariationModel";
import { VariationService } from "@/services/variation-service";
import {
  Box,
  Button,
  IconButton,
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
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import { FileWithPreview } from "./AddProduct";
import { LocationPricing } from "@/domain/models/ProductModel";
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
  locationPricing: LocationPricing[],
  images: FileWithPreview[],
  featured: string
}

interface ProductItemRow {
  [key: string]: string; // Dynamic variant fields + location, sku, stock
}

/**
 * Component to be shown on the AddProduct page. Has input fields for specific
 * information about a products variants and items using dropdown-based selection.
 */
export default function StockInformation(props: StockInformationProps) {
  const [listOfVariants, setListOfVariants] = useState<VariationModel[]>([]);
  const [rows, setRows] = useState<ProductItemRow[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  /**
   * Fetch variations for the chosen category on mount.
   */
  useEffect(() => {
    fetchRequiredInformation();
  }, []);

  /**
   * Sets list of variations from the database for this particular category.
   */
  const fetchRequiredInformation = async () => {
    const variants = await variationService.listVariations(props.category);
    setListOfVariants(variants || []);
  };

  /**
   * Adds a new empty row to the table.
   */
  const addNewRow = () => {
    const newRow: ProductItemRow = {
      location: "",
      sku: "",
      stock: ""
    };

    // Add empty fields for each variant type
    listOfVariants.forEach((variant) => {
      newRow[variant.name] = "";
      newRow[`${variant.name}_id`] = "";
    });

    setRows((prev) => [...prev, newRow]);
  };

  /**
   * Generates SKU based on selected variant values and location.
   * Format: VARIANT1-VARIANT2-VARIANT3-COUNTRYCODE (e.g., "RED-LARGE-COTTON-US")
   */
  const generateSKU = (row: ProductItemRow): string => {
    const variantValues = listOfVariants
      .map((variant) => row[variant.name])
      .filter((value) => value && value !== "");
    
    if (variantValues.length === 0 && !row.location) return "";
    
    const skuParts = variantValues.map((value) => 
      value.toUpperCase().replace(/\s+/g, "-")
    );
    
    // Add location/country code at the end if present
    if (row.location) {
      skuParts.push(row.location.toUpperCase());
    }
    
    return skuParts.join("-");
  };

  /**
   * Copies a row and appends it to the end of the table.
   */
  const copyRow = (rowIdx: number) => {
    const rowToCopy = rows[rowIdx];
    setRows((prev) => [...prev, { ...rowToCopy }]);
  };

  /**
   * Deletes a row from the table.
   */
  const deleteRow = (rowIdx: number) => {
    setRows((prev) => prev.filter((_, idx) => idx !== rowIdx));
  };

  /**
   * Determines whether the add product button is disabled or not.
   * Ensures that required information is filled in for all rows.
   */
  function isDisabled() {
    if (rows.length === 0) return true;
    
    return rows.some((row) => {
      // Check if location, sku, and stock are filled
      if (!row.location || !row.sku || !row.stock) return true;
      
      // Check if all variant fields are filled
      return listOfVariants.some((variant) => !row[variant.name] || !row[`${variant.name}_id`]);
    });
  }

  /**
   * Callback that handles the addition of a product to the database.
   * Calls API with user filled in information and returns to the product
   * management page if a success.
   */
  const handleAdditionOfProduct = useCallback(async () => {
    // Build variations array from rows
    const allVariations = rows.map(row =>
      listOfVariants.map(variant => ({
        variant: row[`${variant.name}_id`]
      }))
    );

    setOpenDialog(true);

    const response = await productService.addProduct(
      props.productName,
      props.productDescription,
      props.category,
      props.featured,
      props.images,
      rows,
      allVariations,
      props.locationPricing
    );

    if (response.status == StatusCodes.CREATED) {
      setOpenDialog(false);
      toast.success("Product added successfully");
      navigate("/admin/product/management");
    } else {
      setOpenDialog(false);
      toast.error(response.errorMessage)
    }
  }, [rows, listOfVariants, props, navigate]);

  return (
    <Box maxHeight={"100%"}>
      <Paper>
        <TableContainer sx={{ maxHeight: "75vh", minHeight: "75vh" }}>
          <Table stickyHeader sx={{ tableLayout: "auto" }}>
            <TableHead>
              <TableRow>
                {listOfVariants?.map((variation) => (
                  <TableCell
                    key={variation.name}
                    sx={{
                      backgroundColor: "#212E4A",
                      color: "#8EB5C0",
                      fontWeight: "bold",
                      textTransform: "uppercase"
                    }}
                  >
                    {variation.name}
                  </TableCell>
                ))}
                <TableCell
                  sx={{
                    backgroundColor: "#212E4A",
                    color: "#8EB5C0",
                    fontWeight: "bold",
                    textTransform: "uppercase"
                  }}
                >
                  LOCATION
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "#212E4A",
                    color: "#8EB5C0",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    minWidth: "300px"
                  }}
                >
                  SKU
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "#212E4A",
                    color: "#8EB5C0",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    width: "80px",
                    maxWidth: "80px",
                    padding: "8px"
                  }}
                >
                  STOCK
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "#212E4A",
                    color: "#8EB5C0",
                    fontWeight: "bold",
                    textTransform: "uppercase"
                  }}
                >
                  ACTIONS
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.map((row, rowIdx) => (
                <TableRow key={rowIdx}>
                  {/* Dynamic variant dropdowns */}
                  {listOfVariants?.map((variant) => (
                    <TableCell key={variant.name}>
                      <TextField
                        select
                        value={row[variant.name] || ""}
                        onChange={(e) => {
                          const selectedVariation = variant.variations?.find(
                            (v) => v.value === e.target.value
                          );
                          setRows((prev) =>
                            prev.map((r, idx) => {
                              if (idx === rowIdx) {
                                const updatedRow = {
                                  ...r,
                                  [variant.name]: e.target.value,
                                  [`${variant.name}_id`]: selectedVariation?.id || ""
                                };
                                // Auto-generate SKU only if it hasn't been manually edited
                                const currentGeneratedSKU = generateSKU(r);
                                if (!r.sku || r.sku === currentGeneratedSKU) {
                                  updatedRow.sku = generateSKU(updatedRow);
                                }
                                return updatedRow;
                              }
                              return r;
                            })
                          );
                        }}
                        fullWidth
                        size="small"
                        sx={{ minWidth: "120px" }}
                      >
                        <MenuItem value="" disabled>
                          Select
                        </MenuItem>
                        {variant.variations?.map((v) => (
                          <MenuItem key={v.id} value={v.value}>
                            {v.value}
                          </MenuItem>
                        ))}
                      </TextField>
                    </TableCell>
                  ))}

                  {/* Location dropdown */}
                  <TableCell>
                    <TextField
                      select
                      value={row.location || ""}
                      onChange={(e) => {
                        setRows((prev) =>
                          prev.map((r, idx) => {
                            if (idx === rowIdx) {
                              const updatedRow: ProductItemRow = {
                                ...r,
                                location: e.target.value
                              };
                              // Auto-generate SKU only if it hasn't been manually edited
                              const currentGeneratedSKU = generateSKU(r);
                              if (!r.sku || r.sku === currentGeneratedSKU) {
                                updatedRow.sku = generateSKU(updatedRow);
                              }
                              return updatedRow;
                            }
                            return r;
                          })
                        );
                      }}
                      fullWidth
                      size="small"
                      sx={{ minWidth: "120px" }}
                    >
                      <MenuItem value="" disabled>
                        Select
                      </MenuItem>
                      {props.locationPricing?.map((locationPrice) => (
                        <MenuItem
                          key={locationPrice.country_code}
                          value={locationPrice.country_code}
                        >
                          {locationPrice.country_code}
                        </MenuItem>
                      ))}
                    </TextField>
                  </TableCell>

                  {/* SKU field */}
                  <TableCell sx={{ minWidth: "300px" }}>
                    <TextField
                      value={row.sku || ""}
                      onChange={(e) =>
                        setRows((prev) =>
                          prev.map((r, idx) =>
                            idx === rowIdx ? { ...r, sku: e.target.value } : r
                          )
                        )
                      }
                      placeholder="Auto-generated from variants"
                      fullWidth
                      size="small"
                      sx={{ minWidth: "150px" }}
                    />
                  </TableCell>

                  {/* Stock field */}
                  <TableCell sx={{ width: "80px", maxWidth: "100px", padding: "8px" }}>
                    <TextField
                      type="number"
                      value={row.stock || ""}
                      onChange={(e) =>
                        setRows((prev) =>
                          prev.map((r, idx) =>
                            idx === rowIdx ? { ...r, stock: e.target.value } : r
                          )
                        )
                      }
                      placeholder="0"
                      fullWidth
                      size="small"
                      sx={{ minWidth: "80px", maxWidth: "100px" }}
                    />
                  </TableCell>

                  {/* Actions */}
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <Tooltip title="Copy row">
                        <IconButton onClick={() => copyRow(rowIdx)} size="small">
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete row">
                        <IconButton
                          onClick={() => deleteRow(rowIdx)}
                          size="small"
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}

              {/* Add Row Button */}
              <TableRow>
                <TableCell
                  sx={{ textAlign: "center", borderBottom: "none" }}
                  colSpan={(listOfVariants?.length ?? 0) + 4}
                >
                  <Button
                    startIcon={<AddCircleIcon />}
                    variant="outlined"
                    onClick={addNewRow}
                    sx={{ mt: 2 }}
                  >
                    Add Row
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <Box display="flex" justifyContent="flex-end" pt={2}>
        <Tooltip
          title={
            rows.length === 0
              ? "Add at least one product variant row"
              : "Ensure all fields are filled in for each row"
          }
          disableHoverListener={!isDisabled()}
          arrow
          placement="top"
        >
          <span>
            <Button
              variant="contained"
              onClick={handleAdditionOfProduct}
              disabled={isDisabled()}
            >
              Add Product
            </Button>
          </span>
        </Tooltip>
      </Box>
      <ProcessingDialog
        openDialog={openDialog}
        dialogHeading={"Processing new product"}
      />
    </Box>
  );
}
