import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  SelectChangeEvent,
} from "@mui/material";
import { Close, LocationOn } from "@mui/icons-material";
import { grey, blue } from "@mui/material/colors";
import { Location } from "@/domain/enum/location";
import { locationState } from "@/domain/state";

interface LocationModalProps {
  open: boolean;
  onClose: () => void;
}

const LocationModal: React.FC<LocationModalProps> = ({ open, onClose }) => {
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const setLocation = locationState((state) => state.setLocation);

  // Convert enum to array for dropdown options
  const locationOptions = Object.entries(Location).map(([code, name]) => ({
    code,
    name,
  }));

  const handleLocationChange = (event: SelectChangeEvent<string>) => {
    setSelectedLocation(event.target.value);
  };

  const handleConfirm = () => {
    if (selectedLocation) {
      setLocation(selectedLocation);
      onClose();
    }
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 2,
          maxWidth: 480,
          margin: 2,
        },
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        {/* Header with close button */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mb: 2,
          }}
        >
          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              color: grey[500],
              "&:hover": {
                backgroundColor: grey[100],
              },
            }}
          >
            <Close />
          </IconButton>
        </Box>

        {/* Location icon */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 3,
          }}
        >
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              backgroundColor: blue[50],
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LocationOn sx={{ color: blue[500], fontSize: 24 }} />
          </Box>
        </Box>

        {/* Title */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            textAlign: "center",
            mb: 2,
            color: grey[900],
          }}
        >
          Location Access Declined
        </Typography>

        {/* Description */}
        <Typography
          variant="body2"
          sx={{
            color: grey[600],
            textAlign: "center",
            mb: 3,
            lineHeight: 1.5,
          }}
        >
          We understand you prefer not to share your precise location. We use
          location information to:
        </Typography>

        {/* Benefits list */}
        <Box sx={{ mb: 4, ml: 1 }}>
          <Typography
            variant="body2"
            sx={{
              color: grey[600],
              mb: 1,
              display: "flex",
              alignItems: "flex-start",
            }}
          >
            • Show products available in your region
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: grey[600],
              mb: 1,
              display: "flex",
              alignItems: "flex-start",
            }}
          >
            • Provide accurate shipping options and costs
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: grey[600],
              mb: 1,
              display: "flex",
              alignItems: "flex-start",
            }}
          >
            • Display relevant local offers and promotions
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: grey[600],
              mb: 3,
              display: "flex",
              alignItems: "flex-start",
            }}
          >
            • Allow you to save addresses in your account to make checking out
            easier
          </Typography>
        </Box>

        {/* Manual selection prompt */}
        <Typography
          variant="body2"
          sx={{
            color: grey[600],
            textAlign: "center",
            mb: 2,
          }}
        >
          To help us provide the best experience, please manually select your
          general region:
        </Typography>

        {/* Region selection */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="body2"
            sx={{
              color: grey[700],
              fontWeight: 500,
              mb: 1,
            }}
          >
            Select your region
          </Typography>
          <FormControl fullWidth>
            <Select
              value={selectedLocation}
              onChange={handleLocationChange}
              displayEmpty
              sx={{
                "& .MuiSelect-select": {
                  py: 1.5,
                  color: selectedLocation ? grey[900] : grey[500],
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: grey[300],
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: grey[400],
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: blue[500],
                },
              }}
            >
              <MenuItem value="" disabled>
                <Typography variant="body2" color="text.secondary">
                  Choose your region...
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

        {/* Action buttons */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "center",
          }}
        >
          <Button
            variant="outlined"
            onClick={handleSkip}
            sx={{
              px: 3,
              py: 1,
              borderColor: grey[300],
              color: grey[700],
              "&:hover": {
                borderColor: grey[400],
                backgroundColor: grey[50],
              },
            }}
          >
            Skip for now
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirm}
            disabled={!selectedLocation}
            sx={{
              px: 3,
              py: 1,
              backgroundColor: grey[900],
              "&:hover": {
                backgroundColor: grey[800],
              },
              "&:disabled": {
                backgroundColor: grey[300],
                color: grey[500],
              },
            }}
          >
            Confirm
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default LocationModal;
