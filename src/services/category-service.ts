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
  async listCategories(
    page?: number,
    pageSize?: number
  ): Promise<PagedList<CategoryModel>> {
    try {
      const params = new URLSearchParams();
      if (page) params.append("page", page.toString());
      if (pageSize) params.append("page_size", pageSize.toString());

      const baseUrl = `/api/category?${params.toString()}`;

      const categories = await api.get(baseUrl);
      return categories.data;
    } catch (error) {
      return Promise.reject(error);
    }
  }
  /**
   * Get a specific category by ID
   * @param id The category ID to retrieve
   * @returns The category model
   */
  async getCategory(id: string): Promise<CategoryModel> {
    try {
      const response = await api.get(`/api/category/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to get category ${id}:`, error);
      return Promise.reject(error);
    }
  }
}
