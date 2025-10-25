import {
  Card,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { CategoryService } from "@/services/category-service";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { CategoryModel } from "@/domain/models/CategoryModel";
import { toast } from "react-toastify";

export interface CategoryInformationProps {
  categoryName: string;
  setCategoryName: Dispatch<SetStateAction<string>>;
  categoryDescription: string;
  setCategoryDescription: Dispatch<SetStateAction<string>>;
  parentCategory: string;
  setParentCategory: Dispatch<SetStateAction<string>>;
}

const categoryService = new CategoryService();

/**
 * A component to be shown on the add category page to input category details.
 */
export default function CategoryInformation(props: CategoryInformationProps) {
  const [listOfCategories, setListOfCategories] = useState<CategoryModel[]>([]);

  /**
   * A useEffect required to get required information.
   */
  useEffect(() => {
    fetchRequiredInformation();
  }, []);

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



  return (
    <Grid container spacing={3}>
      {/* Category Information Form */}
      <Grid size={{ xs: 12 }}>
        <Card sx={{ padding: 3 }}>
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            Category Information
          </Typography>
          
          <Grid container spacing={2}>
            <Grid size={12}>
              <Typography>Name</Typography>
              <TextField
                fullWidth
                value={props.categoryName}
                onChange={(e) => props.setCategoryName(e.target.value)}
                placeholder="Enter category name..."
                required
              />
            </Grid>

            <Grid size={12}>
              <Typography>Parent Category</Typography>
              <TextField
                select
                value={props.parentCategory}
                onChange={(e) => props.setParentCategory(e.target.value)}
                slotProps={{
                  select: {
                    displayEmpty: true
                  }
                }}
              >
                <MenuItem value="">
                  <em>No Parent Category</em>
                </MenuItem>
                {listOfCategories.map((option) => (
                  <MenuItem key={option.internalName} value={option.internalName}>
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={12}>
              <Typography>Description</Typography>
              <TextField
                fullWidth
                multiline
                minRows={3}
                value={props.categoryDescription}
                onChange={(e) => props.setCategoryDescription(e.target.value)}
                placeholder="Description of the category..."
                required
                slotProps={{
                  htmlInput: { maxLength: 255 }
                }}
                helperText={`${props.categoryDescription.length}/255 characters`}
                error={props.categoryDescription.length > 255}
              />
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </Grid>
  );
}