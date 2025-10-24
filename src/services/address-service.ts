import api from "@/api";

import {
  AddressModelData,
  MutateAddressData,
} from "@/domain/models/AddressModel";

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

  /**
   * Calls DELETE /api/address/:id
   * @param id id of the address
   * @returns a status code
   */
  async deleteAddress(id: string): Promise<any> {
    try {
      return (await api.delete(`/api/address/${id}`)).status;
    } catch (error) {
      console.error("Error deleting user address: ", error);
      throw error;
    }
  }

  async updateAddress(id: string, address: MutateAddressData): Promise<any> {
    try {
      return await api.put(`/api/address/${id}`, address);
    } catch (error) {
      console.error("Error updating user address: ", error);
      throw error;
    }
  }

  async addAddress(address: MutateAddressData): Promise<any> {
    try {
      return await api.post("/api/address", address);
    } catch (error) {
      console.error("Error posting new user address: ", error);
      throw error;
    }
  }
}
