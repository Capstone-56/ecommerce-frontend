import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { VariationModel } from '@/domain/models/VariationModel';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import { Button, Chip, IconButton, Popover, TablePagination, Tooltip, Typography, Box } from '@mui/material';
import { useCallback, useEffect, useState } from "react";
import React from 'react';
import { VariationService } from '@/services/variation-service';
import { toast } from 'react-toastify';

/**
 * Variant table props.
 */
export interface VariantTableProps {
  // The search term provided by a user to search for.
  searchTerm: string;
  // Refresh trigger to force re-fetch of data
  refreshTrigger?: number;
  // Callback when edit button is clicked
  onEditVariant: (variant: VariationModel) => void;
}

const variationService = new VariationService();

export default function VariantTable(props: VariantTableProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<VariationModel | null>(null);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [variants, setVariants] = useState<Array<VariationModel>>([]);
  const [filteredVariants, setFilteredVariants] = useState<Array<VariationModel>>([]);

  /**
   * A useEffect required to get variant data upon mount and when refresh is triggered.
   */
  useEffect(() => {
    fetchVariants();
  }, [props.refreshTrigger]);

  /**
   * Filter variants based on search term
   */
  useEffect(() => {
    let filtered = variants;

    // Filter by search term (variant name)
    if (props.searchTerm.trim() !== '') {
      filtered = filtered.filter(variant =>
        variant.name.toLowerCase().includes(props.searchTerm.toLowerCase())
      );
    }

    setFilteredVariants(filtered);
  }, [variants, props.searchTerm]);

  /**
   * Gets variant data from the API for all categories.
   */
  const fetchVariants = useCallback(async () => {
    try {
      // Fetch all variants regardless of category
      const variantList = await variationService.listVariations();
      setVariants(variantList);
    } catch (error) {
      console.error("Error fetching variants:", error);
      setVariants([]);
    }
  }, []);

  /**
   * Handles the change of page in the pagination.
   */
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  /**
   * Handles the change of rows per page in the pagination.
   */
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  /**
   * Handles opening the delete confirmation popover.
   */
  const handleDeleteClick = (event: React.MouseEvent<HTMLButtonElement>, variant: VariationModel) => {
    setAnchorEl(event.currentTarget);
    setSelectedVariant(variant);
  };

  /**
   * Handles closing the delete confirmation popover.
   */
  const handleClose = () => {
    setAnchorEl(null);
    setSelectedVariant(null);
  };

  /**
   * Handles the deletion of a variant.
   */
  const handleDeleteVariant = async () => {
    if (selectedVariant) {
      try {
        await variationService.deleteVariation(selectedVariant.id);
        toast.success('Variation type deleted successfully');
        await fetchVariants(); // Refresh the list
        handleClose();
      } catch (error) {
        console.error("Error deleting variant:", error);
        toast.error("Failed to delete variation type. Please try again.");
      }
    }
  };

  /**
   * Handles opening the edit variant modal.
   */
  const handleEditVariant = (variant: VariationModel) => {
    props.onEditVariant(variant);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  // Paginated data
  const paginatedVariants = filteredVariants.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer>
        <Table stickyHeader aria-label="variant table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Variant Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Categories</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Values</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedVariants.length > 0 ? (
              paginatedVariants.map((variant) => (
                <TableRow
                  key={variant.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {variant.id}
                  </TableCell>
                  <TableCell>
                    {variant.name}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, maxWidth: 400 }}>
                      {variant.categories && variant.categories.length > 0 ? (
                        variant.categories.map((categoryName) => (
                          <Chip
                            key={categoryName}
                            label={categoryName}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        ))
                      ) : (
                        <Typography variant="caption" color="text.secondary">
                          No Assigned Categories
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, maxWidth: 400 }}>
                      {variant.variations.length > 0 ? (
                        variant.variations.map((value) => (
                          <Chip
                            key={value.id}
                            label={value.value}
                            size="small"
                            variant="outlined"
                          />
                        ))
                      ) : (
                        <Typography variant="caption" color="text.secondary">
                          No values defined
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Edit Variant">
                      <IconButton
                        color="primary"
                        onClick={() => handleEditVariant(variant)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Variant">
                      <IconButton
                        color="error"
                        onClick={(event) => handleDeleteClick(event, variant)}
                      >
                        <CancelIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="body2" color="text.secondary">
                    No variants found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredVariants.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Delete Confirmation Popover */}
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Box sx={{ p: 2, maxWidth: 300 }}>
          <Typography variant="h6" gutterBottom>
            Delete Variant
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Are you sure you want to delete the variant "{selectedVariant?.name}"? 
            This action cannot be undone and will affect all products using this variant.
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="contained" color="error" onClick={handleDeleteVariant}>
              Delete
            </Button>
          </Box>
        </Box>
      </Popover>
    </Paper>
  );
}
