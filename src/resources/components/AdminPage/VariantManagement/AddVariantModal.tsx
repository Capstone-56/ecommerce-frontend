import React, { useState, useEffect } from 'react';
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

interface VariantValue {
  id: string;
  value: string;
}

interface AddVariantModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (variantData: { name: string; values: string[]; categories: string[] }) => void;
}

const categoryService = new CategoryService();

export default function AddVariantModal({ open, onClose, onSave }: AddVariantModalProps) {
  const [variantName, setVariantName] = useState('');
  const [variantValues, setVariantValues] = useState<VariantValue[]>([
    { id: '1', value: '' },
    { id: '2', value: '' }
  ]);
  const [nameError, setNameError] = useState('');
  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<CategoryModel[]>([]);

  /**
   * Fetch categories on component mount
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

  const handleClose = () => {
    // Reset form
    setVariantName('');
    setVariantValues([
      { id: '1', value: '' },
      { id: '2', value: '' }
    ]);
    setNameError('');
    setSelectedCategories([]);
    onClose();
  };

  const handleAddValue = () => {
    const newId = (variantValues.length + 1).toString();
    setVariantValues([...variantValues, { id: newId, value: '' }]);
  };

  const handleRemoveValue = (id: string) => {
    if (variantValues.length > 1) {
      setVariantValues(variantValues.filter(value => value.id !== id));
    }
  };

  const handleValueChange = (id: string, newValue: string) => {
    setVariantValues(variantValues.map(value => 
      value.id === id ? { ...value, value: newValue } : value
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
      .map(value => value.value.trim());

    if (filledValues.length === 0) {
      alert('Please add at least one variant value');
      return;
    }

    // Call the onSave callback with the data
    onSave({
      name: variantName.trim(),
      values: filledValues,
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
          Add Variation Type
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
              <Box key={value.id} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TextField
                  fullWidth
                  placeholder={index === 0 ? "Cotton" : index === 1 ? "Polyester" : index === 2 ? "Wool" : "Enter value"}
                  value={value.value}
                  onChange={(e) => handleValueChange(value.id, e.target.value)}
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '6px',
                      backgroundColor: 'white'
                    }
                  }}
                />
                <IconButton
                  onClick={() => handleRemoveValue(value.id)}
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
          disabled={!variantName.trim() || filledValuesCount === 0}
        >
          Create Variation Type
        </Button>
      </DialogActions>
    </Dialog>
  );
}
