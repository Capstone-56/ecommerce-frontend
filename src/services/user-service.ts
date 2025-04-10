import api from "@/api";

export const UserService = {
  async getUser() {
    try {
      const response = await api.get("/api/user");

      return response.data;
    } catch (error) {
      console.error("Error getting user:", error);
      throw error;
    }
  },
};
