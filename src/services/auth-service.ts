import api from "@/api";

import { UserSignUpModel, AuthenticationResponseModel } from "@/domain/models/UserModel";
import { MFAMethod } from "@/domain/type/mfaMethod";

export class AuthService {
  async signup(user: UserSignUpModel) : Promise<boolean> {
    try {
      const response = await api.post("/auth/signup", user);
      return response.status === 201;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async verifySignup(code: string) : Promise<AuthenticationResponseModel> {
    try {
      const response = await api.post("/auth/verify-signup", { code });
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async login(username: string, password: string) : Promise<AuthenticationResponseModel> {
    try {
      const response = await api.post("/auth/login", { username, password });
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async selectMFAMethod(method: MFAMethod) : Promise<string> {
    try {
      const response = await api.get("/auth/mfa-method", { params: { method } });
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async loginMFA(code: string) : Promise<AuthenticationResponseModel> {
    try {
      const response = await api.post("/auth/login-mfa", { code });
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async resendMFA(method: MFAMethod) : Promise<string> {
    try {
      const response = await api.get("/auth/mfa/resend", { params: { method } });
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async toggleMFA(enable: boolean) : Promise<boolean> {
    try {
      const response = await api.put("/auth/mfa/toggle", { params: { enable } });
      return response.status === 204;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async logout(): Promise<number> {
    try {
      const response = await api.delete("/auth/logout");
      return response.status;
    }
    catch (error) {
      return Promise.reject(error);
    }
  }
};
