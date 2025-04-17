// Corresponding backend model: CategoryModel.py
export interface CategoryModel {
    id: string; // UUID as string
    name: string;
    description: string;
    parentCategoryId: string | null;
  }