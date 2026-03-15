import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { CONFIG } from "@/config/configEnv";
import { useAuthStore } from "@/store/use-auth-store";

const AUTH_COOKIE_NAME = CONFIG.auth.cookieName;
const AUTH_STORAGE_KEY = CONFIG.storageKeys.authToken || "focustube_token";
const AUTH_STATE_KEY = CONFIG.storageKeys.authState || "focustube-auth";

const getPersistedToken = () => {
  if (typeof window === "undefined") return null;
  try {
    const directToken = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (directToken) return directToken;
    const raw = window.localStorage.getItem(AUTH_STATE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { state?: { token?: string | null } };
    return parsed?.state?.token ?? null;
  } catch {
    return null;
  }
};

export const apiClient = axios.create({
  baseURL: CONFIG.api.baseUrl,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  if (typeof window === "undefined") return config;

  const storeToken = useAuthStore.getState().token;
  const cookieToken = Cookies.get(AUTH_COOKIE_NAME);
  const persistedToken = getPersistedToken();
  const token = storeToken || cookieToken || persistedToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle Global Errors
    const defaultMessage = "Something went wrong";
    const data = error.response?.data as { message?: string };
    const errorMessage = data?.message || defaultMessage;

    if (typeof window !== "undefined") {
      const status = error.response?.status;
      if (status === 401) {
        useAuthStore.getState().clearAuth();
        window.location.href = "/login";
      }
    }
    return Promise.reject({ ...error, message: errorMessage });
  },
);
