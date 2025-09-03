import React from "react";
import {
  Box,
  Select,
  MenuItem,
  FormControl,
  Typography,
  SelectChangeEvent,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { grey } from "@mui/material/colors";
import { Location } from "@/domain/enum/location";
import { locationState } from "@/domain/state";

const PreHeader: React.FC = () => {
  const userLocation = locationState((state) => state.userLocation);
  const userCurrency = locationState((state) => state.userCurrency);
  const setLocation = locationState((state) => state.setLocation);

  const handleLocationChange = (event: SelectChangeEvent<string>) => {
    const selectedCountryCode = event.target.value;
    setLocation(selectedCountryCode);
  };

  // Convert enum to array for dropdown options
  const locationOptions = Object.entries(Location).map(([code, name]) => ({
    code,
    name,
  }));

  // Find current location name for display
  const getCurrentLocationName = () => {
    if (!userLocation) return "Select Country";
    const location = Object.entries(Location).find(([code]) => code === userLocation);
    return location ? location[1] : userLocation;
  };

  return (
    <Box
      sx={{
        backgroundColor: grey[100],
        py: 1,
        px: 2,
        borderBottom: `1px solid ${grey[300]}`,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: "1200px",
          mx: "auto",
        }}
      >
        {/* Left side - promotional text */}
        <Typography variant="body2" color="text.secondary">
          
        </Typography>

        {/* Right side - Country selection */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Ship to
          </Typography>
          <FormControl size="small" sx={{ minWidth: "auto" }}>
            <Select
              value={userLocation || ""}
              onChange={handleLocationChange}
              displayEmpty
              IconComponent={ExpandMore}
              sx={{
                backgroundColor: "#F8F8F8",
                "& .MuiSelect-select": {
                  py: 0.5,
                  pl: 0, // Reduce left padding
                  pr: 2, // Reduce right padding
                  fontSize: "0.875rem",
                  minWidth: "auto",
                  width: "auto",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "& .MuiSelect-icon": {
                  color: grey[600],
                  fontSize: "1.2rem",
                  right: 4, // Position chevron closer to text
                },
              }}
            >
              <MenuItem value="" disabled>
                <Typography variant="body2" color="text.secondary">
                  Select Country
                </Typography>
              </MenuItem>
              {locationOptions.map((location) => (
                <MenuItem key={location.code} value={location.code}>
                  <Typography variant="body2">{location.name}</Typography>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>
    </Box>
  );
};

export default PreHeader;
