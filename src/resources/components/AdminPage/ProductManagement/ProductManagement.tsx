import {
  Box,
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ManagementTable from "./ProductTable";
import { useNavigate } from "react-router";
import { useCallback, useEffect, useState } from "react";
import { CategoryService } from "@/services/category-service";
import { CategoryModel } from "@/domain/models/CategoryModel";
import { ProductService } from "@/services/product-service";

const categoryService = new CategoryService();
const productService = new ProductService();

/**
 * Product management page to be shown to admins so they can
 * manage their products and either add, remove or update.
 */
export default function ProductManagement() {
  const navigate = useNavigate();
  const [category, setCategory] = useState('');
  const [searchTerm, setSearchTerms] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [listOfCategories, setListOfCategories] = useState<CategoryModel[]>();

  /**
   * A useEffect required to get product categories.
   */
  useEffect(() => {
    fetchCategories();
  }, []);

  /**
   * Sets list of categories from categories in the database.
   */
  const fetchCategories = async () => {
    setListOfCategories(await categoryService.listCategories());
  }

  /**
   * Sets the category based on the users selection from the dropdown.
   * @param event The selection of category.
   */
  const handleChange = (event: SelectChangeEvent) => {
    setCategory(event.target.value as string);
  };

  /**
   * Callback to set search terms based on the users input in the textfield.
   */
  const handleSearch = useCallback(() => {
    setSearchTerms(searchInput);
  }, [setSearchTerms, searchInput]);

  return (
    <Box>
      <Typography variant={"h4"} sx={{ minWidth: "75%" }}>Product Management</Typography>
      <Box sx={{ display: "flex", maxWidth: "100%", paddingTop: "15px", paddingBottom: "15px" }}>
        <Box sx={{ minWidth: "60%", backgroundColor: "white", borderRadius: "10px", marginRight: "20px" }}>
          <TextField
            variant="standard"
            size="medium"
            placeholder="Search"
            onChange={(e) => { setSearchInput(e.target.value) }}
            onKeyDown={(e) => {
              if (e.key === "Enter") { /* empty */ };
            }}
            fullWidth
            // alternatives to inputProps are also deprecated or dont allow sx... I hate MUI
            InputProps={{
              disableUnderline: true,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon
                    sx={{
                      color: 'grey.600',
                      cursor: 'pointer'
                    }}
                    onClick={() => { }}
                  />
                </InputAdornment>
              ),
              sx: {
                borderRadius: '50px',
                backgroundColor: '#FDFDFD',
                height: '100%',
                paddingLeft: '14px',
              }
            }}
            sx={{
              '& .MuiInputBase-input': {
                padding: '12px 0 12px 0',
                fontSize: '16px',
              },
              '& .MuiInputBase-input::placeholder': {
                color: 'grey.500',
                opacity: 1,
              },
              maxWidth: "70%"
            }}
          />
          <FormControl sx={{ minWidth: "30%" }}>
            <InputLabel id="category-select">Filter by Category</InputLabel>
            <Select
              labelId="category-select"
              id="category-simple-select"
              value={category}
              onChange={handleChange}
              variant="standard"
              disableUnderline
            >
              {listOfCategories ? listOfCategories.map((category) => (
                <MenuItem value={category.internalName}>{category.name}</MenuItem>
              )) : null}
            </Select>
          </FormControl>
        </Box>
        <Button variant="contained" onClick={handleSearch}>Search</Button>
      </Box>
      <Box>
        <ManagementTable categoryFilter={category} searchTerm={searchTerm} />
      </Box>
      <Box sx={{ paddingTop: "15px", paddingBottom: "15px", display: "flex", justifyContent: "right" }}>
        <Button variant="contained" onClick={() => navigate("/admin/product/management/add")}>+ Add Product</Button>
      </Box>
    </Box >
  );
};
