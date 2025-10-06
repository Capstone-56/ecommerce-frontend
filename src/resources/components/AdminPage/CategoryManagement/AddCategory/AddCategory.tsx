import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import CategoryInformation from "./CategoryInformation";
import { toast } from "react-toastify";
import { CategoryModel } from "@/domain/models/CategoryModel";
import { CategoryService } from "@/services/category-service";
import { useNavigate } from "react-router-dom";

const categoryService = new CategoryService();

export interface FileWithPreview {
  file: File;
  previewImage: string;
}

/**
 * Add category page that presents a form to create a new category.
 */
export default function AddCategory() {
  const navigate = useNavigate();
  const [categoryId, setCategoryId] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [files, setFiles] = useState<FileWithPreview[]>([]);

  /**
   * Validates if all required fields are filled
   */
  const isFormValid = (): boolean => {
    return (
      categoryId.trim() !== "" &&
      categoryName.trim() !== "" &&
      categoryDescription.trim() !== ""
    );
  };

  /**
   * Handles the creation of a new category
   */
  const handleCreateCategory = async () => {
    if (!isFormValid()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const newCategory: Partial<CategoryModel> = {
        internalName: categoryId.toLowerCase().replace(/\s+/g, '-'),
        name: categoryName,
        description: categoryDescription,
        parentCategory: parentCategory || null,
      };

      // TODO: Implement createCategory method in CategoryService
      // const response = await categoryService.createCategory(newCategory);
      
      // Mock response
      console.log("Category to be created:", newCategory);
      toast.success("Category created successfully!");
      
      // Navigate back to category management
      navigate("/admin/category");
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("Failed to create category");
    }
  };

  /**
   * Handles canceling the creation process
   */
  const handleCancel = () => {
    navigate("/admin/category");
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ paddingBottom: 2 }}>
        Add Category
      </Typography>
      
      <CategoryInformation
        categoryId={categoryId}
        setCategoryId={setCategoryId}
        categoryName={categoryName}
        setCategoryName={setCategoryName}
        categoryDescription={categoryDescription}
        setCategoryDescription={setCategoryDescription}
        parentCategory={parentCategory}
        setParentCategory={setParentCategory}
        files={files}
        setFiles={setFiles}
      />
      
      <Box display="flex" justifyContent="flex-end" gap={2} sx={{ marginTop: 3 }}>
        <Button
          variant="outlined"
          onClick={handleCancel}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleCreateCategory}
          disabled={!isFormValid()}
        >
          Create Category
        </Button>
      </Box>
    </Box>
  );
}