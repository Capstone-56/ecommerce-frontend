import api from "@/api";
import { PagedList } from "@/domain/abstract-models/PagedList";
import { CategoryModel } from "@/domain/models/CategoryModel";

export class CategoryService {
  /**
   * An endpoint to retrieve categories stored in the database.
   * @param page     The page number to retrieve.
   * @param pageSize Size of the page / number of categories to be returned.
   * @returns A paged result of categories.
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
   * Get a specific category by ID
   * @param internalName The category internalName to retrieve
   * @returns The category model
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
}
