import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import Cookies from "js-cookie";
import { CONFIG } from "@/config/configEnv";

type AuthUser = {
  id: string;
  name?: string;
  email?: string;
  avatar?: string | null;
};

type AuthState = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  setAuth: (user: AuthUser, token: string) => void;
  clearAuth: () => void;
  hydrateAuth: () => void;
};

const AUTH_COOKIE_NAME = CONFIG.auth.cookieName || "focustube-auth-token";
const AUTH_STORAGE_KEY = CONFIG.storageKeys.authToken || "focustube_token";
const AUTH_STATE_KEY = CONFIG.storageKeys.authState || "focustube-auth";

const getSecureCookieFlag = () => {
  if (typeof window === "undefined") return true;
  return window.location.protocol === "https:";
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isHydrated: false,
      setAuth: (user, token) => {
        Cookies.set(AUTH_COOKIE_NAME, token, {
          sameSite: "strict",
          secure: getSecureCookieFlag(),
        });
        if (typeof window !== "undefined") {
          window.localStorage.setItem(AUTH_STORAGE_KEY, token);
        }
        set({ user, token, isAuthenticated: true });
      },
      clearAuth: () => {
        Cookies.remove(AUTH_COOKIE_NAME);
        if (typeof window !== "undefined") {
          window.localStorage.removeItem(AUTH_STORAGE_KEY);
        }
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isHydrated: true,
        });
      },
      hydrateAuth: () => {
        set({ isHydrated: true });
      },
    }),
    {
      name: AUTH_STATE_KEY,
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      storage:
        typeof window !== "undefined"
          ? createJSONStorage(() => localStorage)
          : undefined,
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          Cookies.set(AUTH_COOKIE_NAME, state.token, {
            sameSite: "strict",
            secure: getSecureCookieFlag(),
          });
        }
        state?.hydrateAuth();
      },
    },
  ),
);
