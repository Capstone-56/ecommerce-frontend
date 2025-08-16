import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { TextField, InputAdornment, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchBar: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");

  const handleSearch = () => {
    setSearchParams((params) => {
      if (searchTerm) {
        params.set("search", searchTerm);
      } else {
        params.delete("search");
      }
      params.set("page", "1"); 
      return params;
    });

    navigate(`/products?${searchParams.toString()}`);
  };

  useEffect(() => {
    if (location.pathname !== "/products") {
      setSearchTerm("");
    }
  }, [location.pathname]);

  return (
    <Box sx={{ display: "flex", alignItems: "center", width: "100%"}}>
      <TextField
        variant="outlined"
        size="medium"
        placeholder="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSearch();
        }}
        fullWidth
        // alternatives to inputProps are also deprecated or dont allow sx... I hate MUI
        InputProps={{
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
            height: '40px',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'grey.300',
              borderWidth: '1px',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'grey.400',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'primary.main',
              borderWidth: '2px',
            },
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
          }
        }}
      />
    </Box>
  );
};

export default SearchBar;