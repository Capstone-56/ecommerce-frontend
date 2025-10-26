import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Chip,
  Paper,
  Autocomplete
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { CategoryService } from '@/services/category-service';
import { CategoryModel } from '@/domain/models/CategoryModel';
import { VariationModel } from '@/domain/models/VariationModel';

interface VariantValue {
  id?: string;
  value: string;
}

interface EditVariantModalProps {
  open: boolean;
  variant: VariationModel | null;
  onClose: () => void;
  onSave: (variantId: string, variantData: { name: string; variations: VariantValue[]; categories: string[] }) => void;
}

const categoryService = new CategoryService();

export default function EditVariantModal({ open, variant, onClose, onSave }: EditVariantModalProps) {
  const [variantName, setVariantName] = useState('');
  const [variantValues, setVariantValues] = useState<VariantValue[]>([]);
  const [nameError, setNameError] = useState('');
  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<CategoryModel[]>([]);
  
  // Store original values for change detection
  const [originalName, setOriginalName] = useState('');
  const [originalValues, setOriginalValues] = useState<VariantValue[]>([]);
  const [originalCategories, setOriginalCategories] = useState<CategoryModel[]>([]);

  /**
   * Fetch categories when modal opens
   */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryList = await categoryService.getFlatCategoryList();
        setCategories(categoryList);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    if (open) {
      fetchCategories();
    }
  }, [open]);

  /**
   * Pre-populate form when variant or categories change
   */
  useEffect(() => {
    if (open && variant && categories.length > 0) {
      const variantVals = variant?.variations?.map(v => ({ id: v.id, value: v.value })) || [];
      const selected = variant.categories && variant.categories.length > 0
        ? categories.filter(cat => variant.categories.includes(cat.internalName))
        : [];
      
      setVariantName(variant.name);
      setVariantValues(variantVals);
      setSelectedCategories(selected);
      
      // Store original values for comparison
      setOriginalName(variant.name);
      setOriginalValues(variantVals);
      setOriginalCategories(selected);
    }
  }, [open, variant, categories]);

  const handleClose = () => {
    // Reset form
    setVariantName('');
    setVariantValues([]);
    setNameError('');
    setSelectedCategories([]);
    setOriginalName('');
    setOriginalValues([]);
    setOriginalCategories([]);
    onClose();
  };

  /**
   * Check if any changes have been made to the form
   */
  const hasChanges = () => {
    // Check if name changed
    if (variantName !== originalName) return true;

    // Check if categories changed (compare by internalName)
    const currentCategoryNames = selectedCategories.map(c => c.internalName).sort();
    const originalCategoryNames = originalCategories.map(c => c.internalName).sort();
    if (JSON.stringify(currentCategoryNames) !== JSON.stringify(originalCategoryNames)) {
      return true;
    }

    // Check if values changed (compare both id and value)
    if (variantValues.length !== originalValues.length) return true;
    
    for (let i = 0; i < variantValues.length; i++) {
      const current = variantValues[i];
      const original = originalValues[i];
      
      if (current.id !== original.id || current.value !== original.value) {
        return true;
      }
    }

    return false;
  };

  const handleAddValue = () => {
    setVariantValues([...variantValues, { value: '' }]);
  };

  const handleRemoveValue = (index: number) => {
    if (variantValues.length > 1) {
      setVariantValues(variantValues.filter((_, idx) => idx !== index));
    }
  };

  const handleValueChange = (index: number, newValue: string) => {
    setVariantValues(variantValues.map((value, idx) => 
      idx === index ? { ...value, value: newValue } : value
    ));
  };

  const handleSave = () => {
    // Validation
    if (!variantName.trim()) {
      setNameError('Variation Type Name is required');
      return;
    }

    const filledValues = variantValues
      .filter(value => value.value.trim() !== '')
      .map(value => ({
        ...(value.id && { id: value.id }), // Include id if it exists (existing values)
        value: value.value.trim()
      }));

    if (filledValues.length === 0) {
      alert('Please add at least one variant value');
      return;
    }

    if (!variant) {
      alert('No variant selected for editing');
      return;
    }

    // Call the onSave callback with the data
    onSave(variant.id, {
      name: variantName.trim(),
      variations: filledValues,
      categories: selectedCategories.map(cat => cat.internalName)
    });

    handleClose();
  };

  const filledValuesCount = variantValues.filter(value => value.value.trim() !== '').length;

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: '12px',
          minHeight: '500px'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 2,
        borderBottom: '1px solid #e0e0e0'
      }}>
        <Typography variant="h6" component="div">
          Edit Variation Type
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3, pb: 2 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="body2" sx={{ mb: 1, mt: 3, fontWeight: 500 }}>
            Variation Type Name <span style={{ color: 'red' }}>*</span>
          </Typography>
          <TextField
            fullWidth
            placeholder="Material"
            value={variantName}
            onChange={(e) => {
              setVariantName(e.target.value);
              if (nameError) setNameError('');
            }}
            error={!!nameError}
            helperText={nameError || "The name of the variation type (e.g., Size, Color, Material)"}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
              }
            }}
          />
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
            Assign to Categories
          </Typography>
          <Autocomplete
            multiple
            options={categories}
            getOptionLabel={(option) => option.name}
            value={selectedCategories}
            onChange={(event, newValue) => {
              setSelectedCategories(newValue);
            }}
            renderOption={(props, option) => (
              <Box component="li" {...props} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography>{option.name}</Typography>
                <Chip 
                  label={option.internalName} 
                  size="small" 
                  sx={{ 
                    height: '20px',
                    fontSize: '0.75rem',
                    backgroundColor: '#e3f2fd',
                    color: '#1976d2'
                  }} 
                />
              </Box>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Select categories"
                helperText="Choose which categories this variation type applies to."
              />
            )}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
              }
            }}
          />
        </Box>

        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Variant Values
            </Typography>
            <Chip 
              label={`${filledValuesCount} values`} 
              size="small" 
              sx={{ ml: 2, backgroundColor: '#f5f5f5' }}
            />
          </Box>

          <Paper sx={{ p: 2, backgroundColor: '#fafafa', border: '1px dashed #ddd', boxShadow: 'none', elevation: 0 }}>
            {variantValues.map((value, index) => (
              <Box key={value.id || index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TextField
                  fullWidth
                  placeholder="Enter value"
                  value={value.value}
                  onChange={(e) => handleValueChange(index, e.target.value)}
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '6px',
                      backgroundColor: 'white'
                    }
                  }}
                />
                <IconButton
                  onClick={() => handleRemoveValue(index)}
                  disabled={variantValues.length === 1}
                  size="small"
                  sx={{ ml: 1, color: '#999' }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}

            <Button
              startIcon={<AddIcon />}
              onClick={handleAddValue}
              variant="text"
              sx={{ 
                mt: 1,
                color: '#666',
                textTransform: 'none',
                fontSize: '14px'
              }}
            >
              Add Variant Value
            </Button>
          </Paper>

          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Add at least one variant value. You can add more values later.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
        <Button 
          onClick={handleClose}
          variant="outlined"
          sx={{ mr: 1 }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSave}
          variant="contained"
          disabled={!variantName.trim() || filledValuesCount === 0 || !hasChanges()}
        >
          Update Variation Type
        </Button>
      </DialogActions>
    </Dialog>
  );
}

