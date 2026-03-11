import { create } from "zustand";
import { CONFIG } from "@/config/configEnv";

type AuthUser = {
  id: string;
  name?: string;
  email?: string;
  avatarUrl?: string;
};

type AuthState = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (payload: { user: AuthUser; token: string }) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  setAuth: ({ user, token }) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(CONFIG.storageKeys.authToken, token);
    }
    set({ user, token, isAuthenticated: true });
  },
  clearAuth: () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(CONFIG.storageKeys.authToken);
    }
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
