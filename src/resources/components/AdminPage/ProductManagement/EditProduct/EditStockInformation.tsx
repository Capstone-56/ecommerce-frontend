import {
  Box,
  Button,
  Chip,
  ChipProps,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
  Typography,
} from "@mui/material";
import { ProductService } from "@/services/product-service";
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { ProductItemModel } from "@/domain/models/ProductItemModel";
import { toast } from "react-toastify";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneIcon from '@mui/icons-material/Done';
import ClearIcon from '@mui/icons-material/Clear';
import { VariationService } from "@/services/variation-service";
import { VariationModel } from "@/domain/models/VariationModel";
import { ProductModel } from "@/domain/models/ProductModel";
import { ProductItemService } from "@/services/product-item-service";

export interface EditStockInformationProps {
  product: ProductModel
  productId: string
  categoryId?: string
  draft: Partial<ProductModel>
  setDraft: Dispatch<SetStateAction<Partial<ProductModel>>>;
}

const productService = new ProductService();
const variationService = new VariationService();
const productItemService = new ProductItemService();

/**
 * A component to be shown on the edit product page to show specific product stock
 * which can be edited and configured.
 */
export default function EditStockInformation(props: EditStockInformationProps) {
  const [stock, setStock] = useState<ProductItemModel[]>();
  const [newStockAmount, setNewStockAmount] = useState<number | null>(null);
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [variations, setVariations] = useState<VariationModel[]>();
  const [addItemStockCount, setAddItemStockCount] = useState(0);
  const [SKU, setSKU] = useState('');
  const [location, setLocation] = useState('');

  /**
   * A useEffect required to get required information.
   */
  useEffect(() => {
    fetchRequiredInformation();
  }, []);

  /**
   * Gets a products related product items.
   */
  async function fetchRequiredInformation() {
    try {
      const response = await productItemService.getProductItems(props.productId);
      setStock(response);
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || "Failed to fetch stock levels");
    }
  };

  /**
   * A callback to handle editing an entry in the table.
   * @param rowId The row to be edited.
   */
  const handleEditClick = useCallback((rowId: string) => {
    setEditingRowId(rowId);
  }, [])

  /**
   * A callback to handle removing an entry in the table.
   * @param rowId The row to be deleted.
   */
  const handleRemoveStock = useCallback(async (rowId: string) => {
    try {
      await productItemService.removeProductItem(rowId);

      // Refetch all items.
      fetchRequiredInformation();
      toast.success("Stock updated successfully");
    } catch (error) {
      toast.error("Failed to update stock");
    }
  }, [stock])

  /**
   * A callback to handle saving an entry in the table.
   * @param variantId The variant to be edited.
   * @param productId The product Id to be updated.
   */
  const handleSaveChanges = useCallback(async (variantId: string, productId: string) => {
    if (newStockAmount != null) {
      try {
        const requestBody = {
          product_items: [
            {
              id: variantId,
              stock: newStockAmount,
            },
          ],
        };
        await productService.updateProductPartial(productId, requestBody);

        // Refetch all items.
        fetchRequiredInformation();

        setEditingRowId(null);
        setNewStockAmount(null);
        toast.success("Stock updated successfully");
      } catch (error) {
        toast.error("Failed to update stock");
      }
    }
  }, [newStockAmount]);

  /**
   * Generates the status label based on stock amount.
   * @param stockCount The stock of a particular product item.
   * @returns A chip.
   */
  function generateStatusLabel(stockCount: number) {
    let colour: ChipProps["color"];
    let text: string;
    if (stockCount == 0) {
      colour = "error"
      text = "Out of Stock"
    } else if (stockCount <= 25) {
      colour = "warning"
      text = "Low Stock"
    } else {
      colour = "success"
      text = "In Stock"
    }

    return <Chip label={text} color={colour} />
  }

  /**
   * Gets all possible variations for the current product.
   */
  async function retrieveVariations() {
    if (!props.categoryId) return;
    const response = await variationService.listVariations(props.categoryId);
    setVariations(response);
    setOpen(true);
  }

  /**
   * A function to add stock (product item).
   */
  async function addStock() {
    const mappedVariations = Object.values(props.draft.variations || {}).flatMap(
      (variantIds) => variantIds.map((id) => ({ variant: id }))
    );

    const requestBody = {
      product: props.productId,
      location: location,
      sku: SKU,
      stock: addItemStockCount,
      price: props.draft.price,
      variations: mappedVariations
    };

    try {
      await productItemService.createProductItem(requestBody);

      // Refetch all items.
      setOpen(false);
      props.setDraft(prev => ({
        ...prev,
        variations: undefined
      }));
      fetchRequiredInformation();
      toast.success("Stock updated successfully");
    } catch (error) {
      toast.error("Failed to update stock");
    }
  }

  return (
    <Box>
      <Paper sx={{ borderRadius: 4 }}>
        <TableContainer sx={{ maxHeight: "70vh", minHeight: "70vh", borderRadius: 4 }}>
          <Table stickyHeader sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell
                  align="center"
                  sx={{
                    backgroundColor: "#212E4A",
                    color: "#8EB5C0", width: "20%",
                    fontWeight: "bold"
                  }}>
                  Location
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    backgroundColor: "#212E4A",
                    color: "#8EB5C0", width: "20%",
                    fontWeight: "bold"
                  }}>
                  SKU
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    backgroundColor: "#212E4A",
                    color: "#8EB5C0", width: "20%",
                    fontWeight: "bold",
                  }}>
                  Stock
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    backgroundColor: "#212E4A",
                    color: "#8EB5C0",
                    width: "20%",
                    fontWeight: "bold",
                    justifyContent: "center"
                  }}>
                  Status
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    backgroundColor: "#212E4A",
                    color: "#8EB5C0",
                    width: "20%",
                    fontWeight: "bold"
                  }}>
                  Controls
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stock ? stock.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row" align="center">
                    {row.location}
                  </TableCell>
                  <TableCell component="th" scope="row" align="center">
                    {row.sku}
                  </TableCell>
                  <TableCell align="center">
                    {editingRowId == row.id ?
                      <TextField
                        type="number"
                        defaultValue={row.stock}
                        sx={{
                          width: "50%",
                          "& .MuiInputBase-input": {
                            textAlign: "center",
                          },
                        }}
                        onChange={(e) => { setNewStockAmount(Number(e.target.value)); console.log(Number(e.target.value)) }}
                      />
                      :
                      row.stock}
                  </TableCell>
                  <TableCell align="center">{generateStatusLabel(row.stock)}</TableCell>
                  <TableCell align="center">
                    {editingRowId == row.id ?
                      <Box>
                        <Tooltip title={"Save changes"}>
                          <IconButton onClick={(e) => handleSaveChanges(row.id, row.product.id)}>
                            <DoneIcon fontSize={"medium"} color={"success"} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={"Cancel changes"}>
                          <IconButton onClick={(e) => setEditingRowId(null)}>
                            <ClearIcon fontSize={"medium"} color={"error"} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                      :
                      <Box>
                        <Tooltip title={"Edit stock"}>
                          <IconButton onClick={() => handleEditClick(row.id)}>
                            <EditIcon fontSize={"medium"} color={"secondary"} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={"Delete stock"}>
                          <IconButton onClick={() => handleRemoveStock(row.id)}>
                            <DeleteIcon fontSize={"medium"} color={"error"} />
                          </IconButton>
                        </Tooltip>
                      </Box>}
                  </TableCell>
                </TableRow>
              )) : null}
            </TableBody>
          </Table>
        </TableContainer >
      </Paper>
      <Box
        display={"flex"}
        justifyContent={"right"}
      >
        <Button
          variant="contained"
          onClick={() => retrieveVariations()}
          sx={{ mt: 1 }}
        >
          Add Stock Item
        </Button>
      </Box>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Add new stock item
        </DialogTitle>
        <DialogContent>
          {variations &&
            <Box>
              {variations.map((variation: VariationModel) =>
                <Box p={1}>
                  <Typography>{variation.name}</Typography>
                  <TextField
                    key={variation.id}
                    select
                    fullWidth
                    value={props.draft.variations?.[variation.id]?.[0] ?? 'initial'}
                    onChange={(e) =>
                      props.setDraft((prev) => ({
                        ...prev,
                        variations: {
                          ...prev.variations,
                          [variation.id]: [e.target.value],
                        },
                      }))
                    }
                  >
                    <MenuItem key={'initial'} value={'initial'}>Choose {variation.name}</MenuItem>
                    {variation.variant_values.map((variant) =>
                      <MenuItem key={variant.id} value={variant.id}>{variant.value}</MenuItem>
                    )}
                  </TextField>
                </Box>
              )}
              <Box p={1}>
                <Typography>Location</Typography>
                <TextField
                  select
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value)
                  }}
                  sx={{ minWidth: "33%", mr: "10px" }}
                  fullWidth
                >
                  <MenuItem key={"initial"} value={"initial"} disabled>
                    Choose listing location...
                  </MenuItem>
                  {props.product && props.product.location_pricing.map((locationPrice) => (
                    <MenuItem key={locationPrice.country_code} value={locationPrice.country_code}>
                      {locationPrice.country_code}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
              <Box p={1}>
                <Typography>SKU</Typography>
                <TextField onChange={(e) => setSKU(e.target.value)}></TextField>
              </Box>
              <Box p={1}>
                <Typography>Stock Count</Typography>
                <TextField type={"number"} onChange={(e) => setAddItemStockCount(parseInt(e.target.value))}></TextField>
              </Box>
            </Box>
          }
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => addStock()}>Add</Button>
        </DialogActions>
      </Dialog>
    </Box >
  );
}
