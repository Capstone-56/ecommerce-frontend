import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { ProductModel } from '@/domain/models/ProductModel';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import { Button, IconButton, Popover, Popper, TablePagination, Tooltip, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from "react";
import React from 'react';
import { ProductService } from '@/services/product-service';
import { useNavigate } from 'react-router-dom';

/**
 * Product table props.
 */
export interface ProductTableProps {
  // The current selected category to search for.
  categoryFilter: string,
  // The search term provided by a user to search for.
  searchTerm: string
}

const productService = new ProductService();

export default function ManagementTable(props: ProductTableProps) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductModel | null>(null);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [products, setProducts] = useState<Array<ProductModel>>();
  const [numberOfProducts, setNumberProducts] = useState<number>(0);

  /**
   * A useEffect required to get product data upon mount and when either the page, rows or 
   * category changes.
   */
  useEffect(() => {
    fetchProducts();
  }, [page, rowsPerPage, props.categoryFilter, props.searchTerm]);

  /**
   * A callback to handle deletion of an entry in the table.
   * @param event   User's interaction with the delete button.
   * @param product The selected product in the table.
   */
  const handleDeleteClick = useCallback((event: React.MouseEvent<HTMLButtonElement>, product: ProductModel) => {
    setAnchorEl(event.currentTarget);
    setSelectedProduct(product);
  }, [setAnchorEl, setSelectedProduct]);

  /**
   * A callback to handle editing an entry in the table.
   * @param productId The product to be edited.
   */
  const handleEditClick = useCallback((productId: string) => {
    navigate(`/admin/product/management/${productId}`, { state: { productId: productId } })
  }, [navigate])

  /**
   * A callback to handle the closing of delete popover.
   */
  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, [setAnchorEl]);

  /**
   * Handles page change for the table.
   * @param event   The triggered event from user interaction.
   * @param newPage The new page the user wishes to travel to.
   */
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  /**
   * Handles row size changes for user display.
   * @param event The triggered event from user interaction.
   */
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  /**
   * Fetch products based on current search params.
   */
  const fetchProducts = async () => {
    try {
      const response = await productService.listProducts(page + 1, rowsPerPage, undefined, undefined, undefined, undefined, props.categoryFilter, props.searchTerm);
      setProducts(response.results);
      setNumberProducts(response.count);
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  };

  /**
   * Soft delete's a product from the database.
   * @param product The selected product to remove.
   */
  // TODO: Implement the soft deleting API. 
  function deleteProduct(product: ProductModel) {
    console.log("hello")
  }

  return (
    <Paper>
      <TableContainer sx={{ maxHeight: "60vh", minHeight: "60vh" }}>
        <Table stickyHeader sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  backgroundColor: "#212E4A",
                  color: "#8EB5C0", width: "25%",
                  fontWeight: "bold"
                }}>
                Product Name
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "#212E4A",
                  color: "#8EB5C0", width: "10%",
                  fontWeight: "bold"
                }}>
                Price
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "#212E4A",
                  color: "#8EB5C0",
                  width: "10%",
                  fontWeight: "bold"
                }}>
                Average Rating
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "#212E4A",
                  color: "#8EB5C0",
                  width: "35%",
                  fontWeight: "bold"
                }}>
                Description
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "#212E4A",
                  color: "#8EB5C0",
                  width: "10%",
                  fontWeight: "bold"
                }}>
                Controls
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products ? products.map((row) => (
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="left">{row.price}</TableCell>
                <TableCell align="center">{row.avgRating}</TableCell>
                <TableCell align="left">{row.description}</TableCell>
                <TableCell align="left">
                  <Tooltip title={"Edit product"}>
                    <IconButton onClick={() => handleEditClick(row.id)}>
                      <EditIcon fontSize={"medium"} color={"secondary"} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={"Delete product"}>
                    <IconButton onClick={(e) => handleDeleteClick(e, row)}>
                      <CancelIcon fontSize={"medium"} color={"error"} />
                    </IconButton>
                  </Tooltip>
                  <Popover
                    elevation={1}
                    open={Boolean(anchorEl)}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                  >
                    <Typography sx={{ pl: 2, pr: 2, pt: 2, maxWidth: "300px" }}>
                      You are about to delete {selectedProduct?.name} from the inventory list.
                    </Typography>
                    <Typography sx={{ p: 2 }}>
                      Are you sure you want to do that?
                    </Typography>
                    <Button
                      variant={"contained"}
                      color={"error"}
                      sx={{ width: "90%", m: 2 }}
                      onClick={() => deleteProduct(selectedProduct!)}>
                      Delete
                    </Button>
                  </Popover>
                </TableCell>
              </TableRow>
            )) : null}
          </TableBody>
        </Table>
      </TableContainer >
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={numberOfProducts}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
