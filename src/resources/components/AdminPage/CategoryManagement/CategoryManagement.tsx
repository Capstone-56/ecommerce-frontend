import {
  Box,
  Button,
  InputAdornment,
  TextField,
  Typography
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CategoryTable from "./CategoryTable";
import { useNavigate } from "react-router";
import { useCallback, useState } from "react";

/**
 * Category Management page that will help admins manage
 * their categories.
 */
export default function CategoryManagement() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');

  /**
   * Callback to set search terms based on the users input in the textfield.
   */
  const handleSearch = useCallback(() => {
    setSearchTerm(searchInput);
  }, [setSearchTerm, searchInput]);

  return (
    <Box>
      <Typography variant={"h4"} sx={{ minWidth: "75%" }}>Category Management</Typography>
      <Box sx={{ display: "flex", maxWidth: "100%", paddingTop: "15px", paddingBottom: "15px" }}>
        <Box sx={{ minWidth: "60%", backgroundColor: "white", borderRadius: "10px", marginRight: "20px" }}>
          <TextField
            variant="standard"
            size="medium"
            placeholder="Search categories..."
            onChange={(e) => { setSearchInput(e.target.value) }}
            onKeyDown={(e) => {
              if (e.key === "Enter") { 
                handleSearch();
              }
            }}
            fullWidth
            InputProps={{
              disableUnderline: true,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon
                    sx={{
                      color: 'grey.600',
                      cursor: 'pointer'
                    }}
                    onClick={handleSearch}
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
        </Box>
        <Button variant="contained" onClick={handleSearch}>Search</Button>
      </Box>
      <Box>
        <CategoryTable searchTerm={searchTerm} />
      </Box>
      <Box sx={{ paddingTop: "15px", paddingBottom: "15px", display: "flex", justifyContent: "right" }}>
        <Button variant="contained" onClick={() => navigate("/admin/category/management/add")}>+ Add Category</Button>
      </Box>
    </Box>
  );
};
