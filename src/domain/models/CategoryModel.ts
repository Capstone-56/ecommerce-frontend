// Corresponding backend model: CategoryModel.py
export interface CategoryModel {
  internalName: string; 
  name: string;
  description: string;
  parentCategory: string | null;
}