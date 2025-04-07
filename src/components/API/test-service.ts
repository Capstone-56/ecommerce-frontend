import api from "../../api";

export const TestService = {
  async createUser(data: any) {
    try {
      const response = await api.post("/api/user", data);

      return response.data;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },

  async testApiCall() {
    try {
      const response = await api.get("/api/user");
      console.log(response.data);
    } catch (error) {
      console.error("API call failed:", error);
    }
  }
};
