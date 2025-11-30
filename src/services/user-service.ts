import api from "@/api";

import { UserModel } from "@/domain/models/UserModel";
import { AxiosError } from "axios";

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

  async getMe(): Promise<Me | null> {
    try {
      return (await api.get("/api/user/me")).data;
    } catch (error) {
      return null;
    }
  }

  /**
   * Calls /api/user/{username}
   * @params username: string
   * @returns a UserModel
   */
  async getUser(username: string) {
    try {
      const response = await api.get(`/api/user/${username}`);

      return response.data;
    } catch (error) {
      console.error("Error getting user:", error);
      throw error;
    }
  }

  /**
   * Calls /api/user/{id} to update a user's basic details
   * @param id userId string
   */
  async updateUser(details: UserModel, id: string) {
    try {
      const response = await api.put(`api/user/${id}`, details);
      return response.status;
    } catch (error) {
      console.error("Error updating user details: ", error);
      throw error;
    }
  }
}
