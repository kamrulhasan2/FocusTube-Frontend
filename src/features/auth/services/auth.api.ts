import { apiClient } from "@/services/api-client";
import { LoginSchema, RegisterSchema } from "../types/auth.schema";
import { z } from "zod";

type LoginPayload = z.infer<typeof LoginSchema>;
type RegisterPayload = z.infer<typeof RegisterSchema>;

export const AuthAPI = {
  login: async (data: LoginPayload) => {
    const response = await apiClient.post("/auth/login", data);
    return response.data;
  },
  register: async (data: RegisterPayload) => {
    // Excluding confirmPassword before sending to backend if necessary
    const { confirmPassword, ...payload } = data;
    const response = await apiClient.post("/auth/register", payload);
    return response.data;
  },
};
