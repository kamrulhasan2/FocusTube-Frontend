const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export const CONFIG = {
  auth: {
    cookieName:
      process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME ||
      process.env.NEXT_AUTH_COOKIE_NAME ||
      "focustube_token",
  },

  api: {
    baseUrl: API_BASE_URL,
  },
  storageKeys: {
    authToken:
      process.env.NEXT_PUBLIC_AUTH_TOKEN_STORAGE_KEY ||
      process.env.NEXT_STORAGE_KEY ||
      "focustube_token",
    authState:
      process.env.NEXT_PUBLIC_AUTH_STATE_STORAGE_KEY || "focustube-auth",
  },
} as const;

export type Config = typeof CONFIG;
