import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { CONFIG } from "@/config/configEnv";
import { useAuthStore } from "@/store/use-auth-store";

const AUTH_COOKIE_NAME = CONFIG.auth.cookieName;

export const apiClient = axios.create({
  baseURL: CONFIG.api.baseUrl,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  if (typeof window === "undefined") return config;

  const storeToken = useAuthStore.getState().token;
  const cookieToken = Cookies.get(AUTH_COOKIE_NAME);
  const token = storeToken || cookieToken;

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
