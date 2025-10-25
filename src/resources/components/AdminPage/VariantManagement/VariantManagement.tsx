import {
  Box,
  Button,
  InputAdornment,
  TextField,
  Typography
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import VariantTable from "./VariantTable";
import AddVariantModal from "./AddVariantModal";
import { useNavigate } from "react-router";
import { useCallback, useState } from "react";
import { VariationService } from "@/services/variation-service";

const variationService = new VariationService();

/**
 * Variant Management page that will help admins manage
 * their product variants.
 */
export default function VariantManagement() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  /**
   * Callback to set search terms based on the users input in the textfield.
   */
  const handleSearch = useCallback(() => {
    setSearchTerm(searchInput);
  }, [setSearchTerm, searchInput]);

  /**
   * Handle opening the add variant modal
   */
  const handleAddVariant = () => {
    setIsAddModalOpen(true);
  };

  /**
   * Handle closing the add variant modal
   */
  const handleCloseModal = () => {
    setIsAddModalOpen(false);
  };

  /**
   * Handle saving a new variant
   */
  const handleSaveVariant = async (variantData: { name: string; values: string[]; categories: string[] }) => {
    try {
      await variationService.createVariation({
        name: variantData.name,
        categories: variantData.categories,
        variations: variantData.values.map(value => ({ value }))
      });
      
      // Trigger refresh of the table
      setRefreshTrigger(prev => prev + 1);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error saving variant:', error);
      alert('Error saving variant. Please try again.');
    }
  };

  return (
    <Box>
      <Typography variant={"h4"} sx={{ minWidth: "75%" }}>Variant Management</Typography>
      <Box sx={{ display: "flex", maxWidth: "100%", paddingTop: "15px", paddingBottom: "15px" }}>
        <Box sx={{ minWidth: "60%", backgroundColor: "white", borderRadius: "10px", marginRight: "20px" }}>
          <TextField
            variant="standard"
            size="medium"
            placeholder="Search variants..."
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
              maxWidth: "100%"
            }}
          />
        </Box>
        <Button variant="contained" onClick={handleSearch}>Search</Button>
      </Box>
      <Box>
        <VariantTable 
          searchTerm={searchTerm} 
          refreshTrigger={refreshTrigger}
        />
      </Box>
      <Box sx={{ paddingTop: "15px", paddingBottom: "15px", display: "flex", justifyContent: "right" }}>
        <Button variant="contained" onClick={handleAddVariant}>+ Add Variant Type</Button>
      </Box>

      {/* Add Variant Modal */}
      <AddVariantModal
        open={isAddModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveVariant}
      />
    </Box>
  );
};
