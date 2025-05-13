import api from "@/api";

import { UserModel } from "@/domain/models/UserModel";

export class UserService {
  /**
   * Calls /api/user
   * @params null
   * @returns list of all users (Array\<UserModel\>)
   */
  async listUsers() : Promise<Array<UserModel>> {
    try {
      const response = await api.get("/api/user");

      return response.data;
    } catch (error) {
      console.error("Error getting user:", error);
      throw error;
    }
  }

  /**
   * Calls /api/user/id
   * @params id (userId)
   * @returns a UserModel
   */
  async getUser(id: string) : Promise<UserModel> {
    try {
      const response = await api.get(`/api/user/${id}`);

      return response.data;
    } catch (error) {
      console.error("Error getting user:", error);
      throw error;
    }
  }

  /**
   * Calls /api/user/id to delete a user.
   * @param id ID of the user to delete.
   * @returns An error or HTTP 204 status.
   */
  async deleteUser(id: string): Promise<number> {
    try {
      const response = await api.delete(`/api/user/${id}`);

      return response.status;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }
};
