import api from "@/api";
import { VariationModel } from "@/domain/models/VariationModel";

export class VariationService {
  /**
   * Retrieve all variation types, optionally filtered by category.
   * @param category Optional category internal name to filter by
   * @returns Array of variation types with their variations
   */
  async listVariations(category?: string): Promise<VariationModel[]> {
    try {
      const url = category 
        ? `/api/variation?category=${category}` 
        : '/api/variation';
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Failed to list variations:', error);
      return Promise.reject(error);
    }
  }

  /**
   * Get a specific variation type by ID.
   * @param id The variation type ID
   * @returns The variation type with its variations
   */
  async getVariation(id: string): Promise<VariationModel> {
    try {
      const response = await api.get(`/api/variation/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to get variation ${id}:`, error);
      return Promise.reject(error);
    }
  }

  /**
   * Create a new variation type with nested variations.
   * @param data The variation type data to create
   * @returns The created variation type
   */
  async createVariation(data: {
    name: string;
    categories?: string[]; // Array of category internalNames
    variations?: { value: string }[];
  }): Promise<VariationModel> {
    try {
      const response = await api.post('/api/variation', data);
      return response.data;
    } catch (error) {
      console.error('Failed to create variation:', error);
      return Promise.reject(error);
    }
  }

  /**
   * Update an existing variation type (full update).
   * @param id The variation type ID to update
   * @param data The updated variation type data
   * @returns The updated variation type
   */
  async updateVariation(
    id: string,
    data: {
      name: string;
      categories?: string[];
      variations?: { id?: string; value: string }[];
    }
  ): Promise<VariationModel> {
    try {
      const response = await api.put(`/api/variation/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Failed to update variation ${id}:`, error);
      return Promise.reject(error);
    }
  }

  /**
   * Partially update a variation type.
   * @param id The variation type ID to update
   * @param data Partial variation type data to update
   * @returns The updated variation type
   */
  async patchVariation(
    id: string,
    data: {
      name?: string;
      categories?: string[];
      variations?: { id?: string; value: string }[];
    }
  ): Promise<VariationModel> {
    try {
      const response = await api.patch(`/api/variation/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Failed to patch variation ${id}:`, error);
      return Promise.reject(error);
    }
  }

  /**
   * Delete a variation type and all its variants.
   * @param id The variation type ID to delete
   */
  async deleteVariation(id: string): Promise<void> {
    try {
      await api.delete(`/api/variation/${id}`);
    } catch (error) {
      console.error(`Failed to delete variation ${id}:`, error);
      return Promise.reject(error);
    }
  }
}
