import api from "@/api";
import { PagedList } from "@/domain/abstract-models/PagedList";
import { CategoryModel } from "@/domain/models/CategoryModel";

export class CategoryService {
  /**
   * An endpoint to retrieve top-level categories (categories with no parent).
   * @returns An array of top-level categories with their children.
   */
  async listCategories(): Promise<CategoryModel[]> {
    try {
      const response = await api.get('/api/category');
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Get a specific category by internal name
   * @param internalName The category internalName to retrieve
   * @returns The category model with its children
   */
  async getCategory(internalName: string): Promise<CategoryModel> {
    try {
      const response = await api.get(`/api/category/${internalName}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to get category ${internalName}:`, error);
      return Promise.reject(error);
    }
  }

  /**
   * Create a new category
   * @param categoryData The category data to create
   * @returns The created category
   */
  async createCategory(categoryData: {
    name: string;
    description?: string;
    parentCategory?: string;
  }): Promise<CategoryModel> {
    try {
      const response = await api.post('/api/category', categoryData);
      return response.data;
    } catch (error) {
      console.error('Failed to create category:', error);
      return Promise.reject(error);
    }
  }

  /**
   * Update an existing category
   * @param internalName The internal name of the category to update
   * @param categoryData The updated category data
   * @returns The updated category
   */
  async updateCategory(
    internalName: string, 
    categoryData: {
      name?: string;
      description?: string;
      parentCategory?: string;
    }
  ): Promise<CategoryModel> {
    try {
      const response = await api.put(`/api/category/${internalName}`, categoryData);
      return response.data;
    } catch (error) {
      console.error(`Failed to update category ${internalName}:`, error);
      return Promise.reject(error);
    }
  }

  /**
   * Delete a category and optionally move its children to another parent
   * @param internalName The internal name of the category to delete
   * @param moveChildrenTo Optional parent to move children to before deletion
   * @returns The new parent category if children were moved, or void if no children
   */
  async deleteCategory(
    internalName: string, 
    moveChildrenTo?: string
  ): Promise<CategoryModel | void> {
    try {
      const params = moveChildrenTo ? { moveChildren: moveChildrenTo } : {};
      const response = await api.delete(`/api/category/${internalName}`, { params });
      
      // Returns 204 No Content if no children were moved
      // Returns 200 with new parent data if children were moved
      return response.status === 200 ? response.data : undefined;
    } catch (error) {
      console.error(`Failed to delete category ${internalName}:`, error);
      return Promise.reject(error);
    }
  }

  /**
   * Admin endpoint: Get all categories in a flat list
   * @returns A flat array of all categories
   */
  async getFlatCategoryList(): Promise<CategoryModel[]> {
    try {
      const response = await api.get('/api/category/flat-list');
      return response.data;
    } catch (error) {
      console.error('Failed to get flat category list:', error);
      return Promise.reject(error);
    }
  }
}
