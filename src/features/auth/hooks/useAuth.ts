import { useState } from "react";
import { useAuthStore } from "@/store/use-auth-store";
import { AuthAPI } from "../services/auth.api";
import { toast } from "sonner";
import { LoginSchema, RegisterSchema } from "../types/auth.schema";
import { z } from "zod";
import { useRouter } from "next/navigation";

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);
  const router = useRouter();

  const login = async (data: z.infer<typeof LoginSchema>) => {
    setIsLoading(true);
    try {
      const response = await AuthAPI.login(data);
      setAuth({ user: response.user, token: response.token });
      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: z.infer<typeof RegisterSchema>) => {
    setIsLoading(true);
    try {
      const response = await AuthAPI.register(data);
      setAuth({ user: response.user, token: response.token });
      toast.success("Account created successfully!");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return { login, register, isLoading };
};
