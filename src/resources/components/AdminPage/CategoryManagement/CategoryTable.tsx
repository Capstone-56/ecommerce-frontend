import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { CategoryModel } from '@/domain/models/CategoryModel';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import { Button, IconButton, Popover, TablePagination, Tooltip, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import { useCallback, useEffect, useState } from "react";
import React from 'react';
import { CategoryService } from '@/services/category-service';
import { useNavigate } from 'react-router-dom';

/**
 * Category table props.
 */
export interface CategoryTableProps {
  // The search term provided by a user to search for.
  searchTerm: string
}

const categoryService = new CategoryService();

// Extended CategoryModel with level information for display
type CategoryWithLevel = CategoryModel & { level: number };

export default function CategoryTable(props: CategoryTableProps) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryModel | null>(null);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [categories, setCategories] = useState<Array<CategoryWithLevel>>([]);
  const [filteredCategories, setFilteredCategories] = useState<Array<CategoryWithLevel>>([]);

  /**
   * A useEffect required to get category data upon mount and when the search term changes.
   */
  useEffect(() => {
    fetchCategories();
  }, []);

  /**
   * Filter categories based on search term
   * Uses Client-side filtering since the API does not support search yet.
   */
  useEffect(() => {
    if (!props.searchTerm.trim()) {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter(category =>
        category.name.toLowerCase().includes(props.searchTerm.toLowerCase()) ||
        category.description?.toLowerCase().includes(props.searchTerm.toLowerCase()) ||
        category.internalName.toLowerCase().includes(props.searchTerm.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
    setPage(0); // Reset to first page when filtering
  }, [categories, props.searchTerm]);

  /**
   * A callback to handle deletion of an entry in the table.
   * @param event    User's interaction with the delete button.
   * @param category The selected category in the table.
   */
  const handleDeleteClick = useCallback((event: React.MouseEvent<HTMLButtonElement>, category: CategoryModel) => {
    setAnchorEl(event.currentTarget);
    setSelectedCategory(category);
  }, [setAnchorEl, setSelectedCategory]);

  /**
   * A callback to handle editing an entry in the table.
   * @param categoryInternalName The category to be edited.
   */
  const handleEditClick = useCallback((categoryInternalName: string) => {
    navigate(`/admin/category/management/${categoryInternalName}`, { 
      state: { categoryInternalName: categoryInternalName } 
    })
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
   * Fetch all categories.
   */
  const fetchCategories = async () => {
    try {
      const response = await categoryService.getFlatCategoryList();
      // Add level information for display (all categories are at level 0 in flat list)
      const categoriesWithLevel = response.map(category => ({ ...category, level: 0 }));
      setCategories(categoriesWithLevel);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };


  /**
   * Delete a category from the database.
   * @param category The selected category to remove.
   */
  const deleteCategory = async (category: CategoryModel) => {
    try {
      await categoryService.deleteCategory(category.internalName);
      toast.success(`Category "${category.name}" deleted successfully`);
      // Refresh the category list
      fetchCategories();
      handleClose();
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
    }
  };

  // TODO: update internalName field to be parentCategory or show both.

  // Get categories for current page
  const paginatedCategories = filteredCategories.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Paper>
      <TableContainer sx={{ maxHeight: "70vh", minHeight: "70vh" }}>
        <Table stickyHeader sx={{ minWidth: 650 }} aria-label="category table">
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  backgroundColor: "#212E4A",
                  color: "#8EB5C0", 
                  width: "30%",
                  fontWeight: "bold"
                }}>
                Category Name
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "#212E4A",
                  color: "#8EB5C0", 
                  width: "20%",
                  fontWeight: "bold"
                }}>
                Internal Name (ID)
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
                  width: "15%",
                  fontWeight: "bold"
                }}>
                Controls
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedCategories.map((category) => (
              <TableRow
                key={category.internalName}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <Typography sx={{ 
                    fontSize: '1rem',
                    whiteSpace: 'pre'  // ← Add this to preserve spaces
                  }}>
                    {category.name}
                  </Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography sx={{ fontSize: '1rem' }}>
                    {category.internalName}
                  </Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography sx={{ fontSize: '1rem' }}>
                    {category.description || 'No description'}
                  </Typography>
                </TableCell>
                <TableCell align="left">
                  <Tooltip title={"Edit category"}>
                    <IconButton onClick={() => handleEditClick(category.internalName)}>
                      <EditIcon fontSize={"medium"} color={"secondary"} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={"Delete category"}>
                    <IconButton onClick={(e) => handleDeleteClick(e, category)}>
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
                      You are about to delete "{selectedCategory?.name}" from the category list.
                    </Typography>
                    <Typography sx={{ p: 2 }}>
                      Are you sure you want to do that?
                    </Typography>
                    <Button
                      variant={"contained"}
                      color={"error"}
                      sx={{ width: "90%", m: 2 }}
                      onClick={() => deleteCategory(selectedCategory!)}>
                      Delete
                    </Button>
                  </Popover>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredCategories.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
