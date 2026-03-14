import { apiClient } from "@/services/api-client";
import { LoginSchema, RegisterSchema } from "../types/auth.schema";
import { z } from "zod";

type LoginPayload = z.infer<typeof LoginSchema>;
type RegisterPayload = z.infer<typeof RegisterSchema>;

type AuthPayload = {
  user: {
    id: string;
    name?: string;
    email?: string;
    avatar?: string | null;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
};

export const AuthAPI = {
  login: async (data: LoginPayload): Promise<AuthPayload> => {
    const response = await apiClient.post("/auth/login", data);
    return response.data?.data;
  },
  register: async (data: RegisterPayload): Promise<AuthPayload> => {
    // Excluding confirmPassword before sending to backend if necessary
    const { confirmPassword, ...payload } = data;
    const response = await apiClient.post("/auth/register", payload);
    return response.data?.data;
  },
};
