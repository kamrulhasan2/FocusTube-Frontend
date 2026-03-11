const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export const CONFIG = {
  api: {
    baseUrl: API_BASE_URL,
  },
  storageKeys: {
    authToken: "focustube_token",
  },
} as const;

export type Config = typeof CONFIG;
