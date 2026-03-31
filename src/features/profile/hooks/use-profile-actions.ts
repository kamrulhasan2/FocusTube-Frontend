"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { ProfileService } from "../services/profile.service";
import type {
  UpdatePasswordDto,
  UpdateProfileDto,
  UpdateAvatarDto,
  UserProfile,
} from "../types/profile.types";
import { useAuthStore } from "@/store/use-auth-store";

type OptimisticContext = {
  previousUser?: UserProfile | null;
};

type UploadAvatarPayload = {
  file: File;
  previewUrl?: string;
  avatar: string;
};

const resolveErrorMessage = (error: unknown, fallback: string) => {
  if (typeof error === "object" && error && "message" in error) {
    const message = String((error as { message?: string }).message);
    if (message) return message;
  }
  return fallback;
};

const applyUserPatch = (patch: Partial<UserProfile>) => {
  useAuthStore.setState((state) => ({
    user: state.user ? { ...state.user, ...patch } : null,
  }));
};

const applyUserSnapshot = (snapshot: UserProfile) => {
  useAuthStore.setState((state) => ({
    user: state.user ? { ...state.user, ...snapshot } : snapshot,
  }));
};

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProfileDto) =>
      ProfileService.updateProfile(payload),
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: ["user", "me"] });
      const previousUser = useAuthStore.getState().user;
      applyUserPatch({ name: payload.name });
      return { previousUser };
    },
    onError: (error, _payload, context) => {
      if (context?.previousUser) {
        useAuthStore.setState({ user: context.previousUser });
      }
      toast.error(resolveErrorMessage(error, "Unable to update profile."));
    },
    onSuccess: (response) => {
      applyUserSnapshot(response.data);
      toast.success("Profile updated");
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ["user", "me"] });
    },
  });
}

export function useUpdatePassword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdatePasswordDto) =>
      ProfileService.updatePassword(payload),
    onError: (error) => {
      toast.error(resolveErrorMessage(error, "Unable to update password."));
    },
    onSuccess: () => {
      toast.success("Password updated");
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ["user", "me"] });
    },
  });
}

export function useUploadAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ avatar }: UploadAvatarPayload) => {
      const payload: UpdateAvatarDto = { avatar };
      return ProfileService.uploadAvatar(payload);
    },
    onMutate: async ({ previewUrl }: UploadAvatarPayload) => {
      await queryClient.cancelQueries({ queryKey: ["user", "me"] });
      const previousUser = useAuthStore.getState().user;
      if (previewUrl) {
        applyUserPatch({ avatar: previewUrl });
      }
      return { previousUser };
    },
    onError: (error, _payload, context) => {
      if (context?.previousUser) {
        useAuthStore.setState({ user: context.previousUser });
      }
      toast.error(resolveErrorMessage(error, "Unable to upload avatar."));
    },
    onSuccess: (response) => {
      applyUserSnapshot(response.data);
      toast.success("Avatar updated");
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ["user", "me"] });
    },
  });
}
