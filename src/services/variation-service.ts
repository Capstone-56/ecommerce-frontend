import api from "@/api";
import { VariationModel } from "@/domain/models/VariationModel";

export class VariationService {

  /**
   * An endpoint to retrieve variations stored in the database.
   */
  async listVariations(category: string): Promise<VariationModel[]> {
    try {
      const response = (await api.get(`/api/variation?category=${category}`));
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
