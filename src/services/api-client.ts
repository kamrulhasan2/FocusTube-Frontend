import axios, { AxiosError } from "axios";
import { CONFIG } from "@/config/configEnv";

export const apiClient = axios.create({
  baseURL: CONFIG.api.baseUrl,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem(CONFIG.storageKeys.authToken);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (typeof window !== "undefined") {
      const status = error.response?.status;
      if (status === 401) {
        window.localStorage.removeItem(CONFIG.storageKeys.authToken);
      }
    }
    return Promise.reject(error);
  },
);
