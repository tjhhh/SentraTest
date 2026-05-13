import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthState, User } from "../types/auth";
import { authService } from "../services/auth.service";

const setCookie = (name: string, value: string, days = 7) => {
  if (typeof document === "undefined") return;
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "; expires=" + date.toUTCString();
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
};

const deleteCookie = (name: string) => {
  if (typeof document === "undefined") return;
  document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      setAuth: (user: User, token: string, refreshToken: string) => {
        setAuthCookie(token);
        set({ user, token, refreshToken });
      },
      logout: async () => {
        const { refreshToken } = get();
        if (refreshToken) {
          try {
            await authService.logout(refreshToken);
          } catch (err) {
            console.error("Logout request failed", err);
          }
        }
        deleteCookie("auth-token");
        set({ user: null, token: null, refreshToken: null });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);

function setAuthCookie(token: string) {
  setCookie("auth-token", token);
}

