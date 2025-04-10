import api from "@/api";

import { UserModel } from "@/models/UserModel";

export class UserService {
  async listUsers() : Promise<Array<UserModel>> {
    try {
      const response = await api.get("/api/user");

      return response.data;
    } catch (error) {
      console.error("Error getting user:", error);
      throw error;
    }
  }

  async getUser(id: string) : Promise<UserModel> {
    try {
      const response = await api.get(`/api/user/${id}`);

      return response.data;
    } catch (error) {
      console.error("Error getting user:", error);
      throw error;
    }
  }
};
