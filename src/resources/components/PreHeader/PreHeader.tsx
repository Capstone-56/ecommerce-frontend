import React, { useEffect, useRef } from "react";
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
  const userCurrency = locationState((state) => state.getUserCurrency());
  const setLocation = locationState((state) => state.setLocation);
  const invisibleElemRef = useRef<HTMLDivElement>(null);
  const locationElemRef = useRef<HTMLDivElement>(null);

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

  useEffect((): void => {
    if (!invisibleElemRef.current || !locationElemRef.current) {
      return;
    }

    invisibleElemRef.current.style.width = `${locationElemRef.current.clientWidth}px`;
    invisibleElemRef.current.style.height = `${locationElemRef.current.clientHeight}px`;
  }, []);

  return (
    <div className="bg-sky-100 py-2 px-4 border-b border-sky-200">
      <div className="relative flex md:flex-row flex-col md:justify-between justify-start items-center max-w-[1680px]">
        <div
          ref={invisibleElemRef}
          className="md:block hidden opacity-0"
        >
          .
        </div>

        <p>
          Exclusive Quality for Better Living
        </p>

        {/* Right side - Country selection and currency display */}
        <div
          ref={locationElemRef}
          className="flex items-center gap-1"
        >
          <Typography variant="body2" color="text.secondary">
            Deliver to
          </Typography>
          <FormControl size="small" sx={{ minWidth: "auto" }}>
            <Select
              value={userLocation || ""}
              onChange={handleLocationChange}
              displayEmpty
              IconComponent={ExpandMore}
              sx={{
                backgroundColor: "none",
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
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem"
                    }}
                  >
                    <Box
                      component="img"
                      src={`/country-flags/${location.code}.svg`}
                      width="1.25rem"
                    />
                    <Typography variant="body2">{location.name}</Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Currency display */}
          {userCurrency && (
            <>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                {userCurrency}
              </Typography>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreHeader;
