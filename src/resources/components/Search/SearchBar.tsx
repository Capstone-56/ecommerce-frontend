import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { TextField, IconButton, Box } from "@mui/material";
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
    setSearchTerm("");
  }, [location.pathname]);

  return (
    <Box sx={{ display: "flex", alignItems: "center", padding: "2px" }}>
      <IconButton onClick={handleSearch} color="primary">
        <SearchIcon />
      </IconButton>
      <TextField
        variant="outlined"
        size="small"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSearch();
        }}
      />
    </Box>
  );
};

export default SearchBar;