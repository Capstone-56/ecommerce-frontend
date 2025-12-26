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

  async getMe(): Promise<Me | null> {
    try {
      return (await api.get("/api/user/me")).data;
    } catch (error) {
      return null;
    }
  }

  async uploadPfp(image: Blob): Promise<void> {
    const formData = new FormData();

    formData.append("pfp", image);

    return await api.postForm("/api/user/upload_pfp", formData);
  }

  async getUserDates(): Promise<DateItemType[]> {
    return Array.from((await api.get("/api/user-dates/all")).data).map((date_item: any): DateItemType => {
      return {
        id: date_item.id,
        name: date_item.name,
        remarks: date_item.remarks,
        date: parseInt(date_item.date),
        month: parseInt(date_item.month)
      }
    });
  }

  async addUserDate(name: UserDateTitleType, remarks: string, date: number, month: number): Promise<DateItemType> {
    const response = await api.post("/api/user-dates/add", {
      name,
      remarks,
      date,
      month
    });

    return {
      id: response.data.id,
      name,
      remarks,
      date,
      month
    };
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
