import {
  Button,
  Card,
  CardMedia,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { CategoryService } from "@/services/category-service";
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { CategoryModel } from "@/domain/models/CategoryModel";
import { StatusCodes } from "http-status-codes";
import { toast } from "react-toastify";
import ModifyImages from "@/resources/components/ModifyImages/ModifyImages";

export interface EditCategoryInformationProps {
  category: CategoryModel;
  draft: Partial<CategoryModel>;
  setDraft: Dispatch<SetStateAction<Partial<CategoryModel>>>;
  onImagesUpdated: () => void;
}

const categoryService = new CategoryService();

/**
 * A component to be shown on the edit category page to show category details
 * which can be edited and configured.
 */
export default function EditCategoryInformation(props: EditCategoryInformationProps) {
  const [listOfCategories, setListOfCategories] = useState<CategoryModel[]>();
  const [isDisabled, setIsDisabled] = useState(true);
  const [categoryImage, setCategoryImage] = useState<string>("");

  /**
   * A useEffect required to get required information.
   */
  useEffect(() => {
    fetchRequiredInformation();
    // Set a placeholder image for template
    setCategoryImage("https://v0-ecommerce-website-creation-bice.vercel.app/placeholder.svg?height=300&width=300");
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
      props.draft.internalName !== props.category.internalName ||
      props.draft.name !== props.category.name ||
      props.draft.description !== props.category.description ||
      props.draft.parentCategory !== props.category.parentCategory
    );
  };

  /**
   * A function that gets the required information for parent categories.
   */
  const fetchRequiredInformation = async () => {
    try {
      const categories = await categoryService.listCategories();
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

    const updates: Partial<CategoryModel> = {};
    Object.keys(props.draft).forEach((key) => {
      if ((props.draft as any)[key] !== (props.category as any)[key]) {
        (updates as any)[key] = (props.draft as any)[key];
      }
    });

    try {
      // TODO: Implement updateCategory method in CategoryService
      // const response = await categoryService.updateCategory(props.category.internalName, updates);
      // mock response
      toast.success("Category updated successfully!");
      setIsDisabled(true);
      
      console.log("Category updates to be applied:", updates);
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Failed to update category");
    }
  }, [props.category, props.draft]);

  return (
    <Grid container spacing={3}>
      {/* Category Information Form */}
      <Grid size={{ xs: 12, lg: 8 }}>
        <Card sx={{ padding: 3 }}>
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            Category Information
          </Typography>
          
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography>ID (lowercase)</Typography>
              <TextField
                fullWidth
                value={props.draft.internalName ?? ""}
                disabled={isDisabled}
                onChange={(e) => 
                  props.setDraft((prev) => ({ 
                    ...prev, 
                    internalName: e.target.value.toLowerCase() 
                  }))
                }
                placeholder="category-id"
                helperText="Internal identifier for the category (lowercase, no spaces)"
              />
            </Grid>

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
                  disabled={!isDraftChanged()}
                >
                  Apply
                </Button>
              )}
            </Grid>
          </Grid>
        </Card>
      </Grid>

      {/* Category Image */}
      <Grid size={{ xs: 12, lg: 4 }} height={"100%"}>
        <Card>
          <CardMedia
            component="img"
            image={categoryImage}
            alt={props.category.name}
            sx={{
              width: "100%",
              height: "auto",
              objectFit: "cover",
              aspectRatio: 1 / 1,
            }}
          />
          {/* TODO: Implement category-specific ModifyImages component */}
          <div style={{ padding: 16 }}>
            <Typography variant="body2" color="text.secondary">
              Category Image Management
            </Typography>
            <Typography variant="caption" display="block">
              Image upload functionality will be implemented later
            </Typography>
          </div>
        </Card>
      </Grid>
    </Grid>
  );
}
