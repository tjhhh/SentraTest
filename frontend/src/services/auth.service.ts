import { api } from "./api";
import { User } from "../types/auth";

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export const authService = {
  login: (credentials: any) => 
    api.post<AuthResponse>("/auth/login", credentials),
  register: (userData: any) => 
    api.post<AuthResponse>("/auth/register", userData),
  refresh: (refreshToken: string) => 
    api.post<AuthResponse>("/auth/refresh", { refreshToken }),
  logout: (refreshToken: string) => 
    api.post("/auth/logout", { refreshToken }),
};
