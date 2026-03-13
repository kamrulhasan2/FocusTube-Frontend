import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { z } from "zod";
import { toast } from "sonner";

import { AuthAPI } from "../services/auth.api";
import { LoginSchema, RegisterSchema } from "../types/auth.schema";
import { useAuthStore } from "@/store/use-auth-store";

type AuthResponse = {
  user: {
    id: string;
    name?: string;
    email?: string;
    avatar?: string | null;
  };
  token: string;
};

type AuthErrorResponse = {
  message?: string;
};

const resolveAuthErrorMessage = (error: unknown) => {
  if (error instanceof AxiosError) {
    const data = error.response?.data as AuthErrorResponse | undefined;
    if (data?.message) return data.message;
  }
  if (error instanceof Error && error.message) return error.message;
  return "Something went wrong. Please try again.";
};

export const useRegisterMutation = () => {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation<AuthResponse, unknown, z.infer<typeof RegisterSchema>>({
    mutationFn: async (values) => AuthAPI.register(values),
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      toast.success("Registration successful");
      router.replace("/dashboard");
    },
    onError: (error) => {
      toast.error(resolveAuthErrorMessage(error));
    },
  });
};

export const useLoginMutation = () => {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation<AuthResponse, unknown, z.infer<typeof LoginSchema>>({
    mutationFn: async (values) => AuthAPI.login(values),
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      toast.success("Welcome back");
      router.replace("/dashboard");
    },
    onError: (error) => {
      toast.error(resolveAuthErrorMessage(error));
    },
  });
};
