import api from "@/api";

import { UserModel } from "@/domain/models/UserModel";

export class UserService {
  /**
   * Calls /api/user
   * @params null
   * @returns list of all users (Array\<UserModel\>)
   */
  async listUsers(): Promise<Array<UserModel>> {
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
  async getUser(id: string) {
    try {
      const response = await api.get(`/api/user/${id}`);

      return response.data;
    } catch (error) {
      console.error("Error getting user:", error);
      throw error;
    }
  }

  async updateUser(details: UserModel) {
    try {
      const id = sessionStorage.getItem("id");
      const response = await api.put(`api/user/${id}`);
    } catch (error) {
      console.error("Error updating user details: ", error);
      throw error;
    }
  }
}
