export const CONFIG = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1",
  STORAGE_KEYS: {
    AUTH_TOKEN: process.env.NEXT_STORAGE_KEY || "focustube_token",
  },
} as const;
