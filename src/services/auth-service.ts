import api from "@/api";
import { AuthenticationState } from "@/domain/state";

export class AuthService {

    async logout(): Promise<number> {
        try {
            const response = await api.delete("/auth/logout", {
                withCredentials: true
            })

            return response.status;
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
};
