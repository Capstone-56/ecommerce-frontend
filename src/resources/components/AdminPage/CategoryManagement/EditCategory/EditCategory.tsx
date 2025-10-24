import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import EditCategoryInformation from "./EditCategoryInformation";
import { toast } from "react-toastify";
import { CategoryModel } from "@/domain/models/CategoryModel";
import { CategoryService } from "@/services/category-service";
import { useLocation } from "react-router-dom";

const categoryService = new CategoryService();

/**
 * Edit category page that presents a form to edit an existing category.
 */
export default function EditCategory() {
  const [draft, setDraft] = useState<Partial<CategoryModel>>({});
  const [category, setCategory] = useState<CategoryModel>();

  const location = useLocation();
  // Gets category internal name from url/location state.
  const { categoryInternalName } = location.state || {};

  /**
   * A useEffect required to get required information.
   */
  useEffect(() => {
    fetchRequiredInformation();
  }, []);

  /**
   * A function that gets the required information to display category
   * information properly.
   */
  async function fetchRequiredInformation() {
    try {
      const response = await categoryService.getCategory(categoryInternalName);
      setCategory(response);
      setDraft({
        name: response.name,
        description: response.description,
        parentCategory: response.parentCategory,
      });
    } catch (error) {
      toast.error("Failed to fetch category");
      console.error("Error fetching category:", error);
    }
  }


  return (
    <Box >
      <Typography variant="h4" sx={{ paddingBottom: 2 }}>
        Edit Category
      </Typography>
      
      {category && (
        <EditCategoryInformation
          category={category}
          draft={draft}
          setDraft={setDraft}
        />
      )}
    </Box>
  );
}
