import {
  Button,
  Card,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { CategoryService } from "@/services/category-service";
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { CategoryModel } from "@/domain/models/CategoryModel";
import { toast } from "react-toastify";

export interface EditCategoryInformationProps {
  category: CategoryModel;
  draft: Partial<CategoryModel>;
  setDraft: Dispatch<SetStateAction<Partial<CategoryModel>>>;
}

const categoryService = new CategoryService();

/**
 * A component to be shown on the edit category page to show category details
 * which can be edited and configured.
 */
export default function EditCategoryInformation(props: EditCategoryInformationProps) {
  const [listOfCategories, setListOfCategories] = useState<CategoryModel[]>();
  const [isDisabled, setIsDisabled] = useState(true);

  /**
   * A useEffect required to get required information.
   */
  useEffect(() => {
    fetchRequiredInformation();
  }, []);

  /**
   * Helper function to determine whether an admin has altered a field to
   * be updated.
   * @returns A True or False depending on whether there have been changes.
   */
  const isDraftChanged = (): boolean => {
    if (!props.category) return false;

    // Compare each relevant field.
    return (
      props.draft.name !== props.category.name ||
      props.draft.description !== props.category.description ||
      props.draft.parentCategory !== props.category.parentCategory
    );
  };

  /**
   * Helper function to check if the form is valid
   * @returns A True or False depending on whether the form is valid.
   */
  const isFormValid = (): boolean => {
    return (
      (props.draft.description ?? "").length <= 255 &&
      (props.draft.name ?? "").trim() !== ""
    );
  };

  /**
   * A function that gets the required information for parent categories.
   */
  const fetchRequiredInformation = async () => {
    try {
      const categories = await categoryService.getFlatCategoryList();
      setListOfCategories(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories");
    }
  };

  /**
   * Handles the saving of changes to category information.
   * via updates to the database.
   */
  const handleSaveChanges = useCallback(async () => {
    if (!props.category) return;

    const updates: {
      name?: string;
      description?: string;
      parentCategory?: string | null;
    } = {};
    
    if (props.draft.name !== props.category.name) {
      updates.name = props.draft.name;
    }
    if (props.draft.description !== props.category.description) {
      updates.description = props.draft.description;
    }
    if (props.draft.parentCategory !== props.category.parentCategory) {
      updates.parentCategory = props.draft.parentCategory === "" || props.draft.parentCategory === null ? null : props.draft.parentCategory;
    }

    try {
      const response = await categoryService.updateCategory(props.category.internalName, updates);
      toast.success("Category updated successfully!");
      setIsDisabled(true);
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Failed to update category");
    }
  }, [props.category, props.draft]);

  return (
    <Grid container spacing={3}>
      {/* Category Information Form */}
      <Grid size={{ xs: 12 }}>
        <Card sx={{ padding: 3 }}>
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            Category Information
          </Typography>
          
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography>Parent Category</Typography>
              <TextField
                select
                fullWidth
                value={props.draft.parentCategory ?? ""}
                onChange={(e) => 
                  props.setDraft((prev) => ({ 
                    ...prev, 
                    parentCategory: e.target.value || null 
                  }))
                }
                disabled={isDisabled}
                slotProps={{
                  select: {
                    displayEmpty: true
                  }
                }}
              >
                <MenuItem value="">
                  <em>No Parent Category</em>
                </MenuItem>
                {(listOfCategories ?? [])
                  .filter(cat => cat.internalName !== props.category.internalName)
                  .map((option) => (
                    <MenuItem key={option.internalName} value={option.internalName}>
                      {option.name}
                    </MenuItem>
                  ))}
              </TextField>
            </Grid>

            <Grid size={12}>
              <Typography>Name</Typography>
              <TextField
                fullWidth
                value={props.draft.name ?? ""}
                disabled={isDisabled}
                onChange={(e) => 
                  props.setDraft((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Category Display Name"
              />
            </Grid>

            <Grid size={12}>
              <Typography>Description</Typography>
              <TextField
                fullWidth
                multiline
                minRows={3}
                value={props.draft.description ?? ""}
                disabled={isDisabled}
                onChange={(e) => 
                  props.setDraft((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="Description of the category..."
                slotProps={{
                  htmlInput: { maxLength: 255 }
                }}
                helperText={`${(props.draft.description ?? "").length}/255 characters`}
                error={(props.draft.description ?? "").length > 255}
              />
            </Grid>

            <Grid size={12} display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                onClick={() => setIsDisabled(!isDisabled)}
                color={isDisabled ? "primary" : "error"}
              >
                {isDisabled ? "Edit" : "Cancel"}
              </Button>
              {!isDisabled && (
                <Button
                  sx={{ ml: 2 }}
                  variant="contained"
                  color="success"
                  onClick={handleSaveChanges}
                  disabled={!isDraftChanged() || !isFormValid()}
                >
                  Apply
                </Button>
              )}
            </Grid>
          </Grid>
        </Card>
      </Grid>

    </Grid>
  );
}
