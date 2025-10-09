import api from "@/api";

import { AddressModelData } from "@/domain/models/AddressModel";

/**
 * Calls GET /api/address
 * @returns list of addresses for the logged in user
 */
export class AddressService {
  async listAddresses(): Promise<Array<AddressModelData>> {
    try {
      const response = await api.get("/api/address");
      return response.data;
    } catch (error) {
      console.error("Error fetching user addresses: ", error);
      throw error;
    }
  }
}
