import { apiClient } from "@/services/api-client";

import type {
  ApiResponse,
  UpdatePasswordDto,
  UpdateProfileDto,
  UpdateAvatarDto,
  UserProfile,
} from "../types/profile.types";

type RawUser = UserProfile & {
  _id?: string;
};

const normalizeUser = (user: RawUser): UserProfile => ({
  id: user.id || user._id || "",
  name: user.name,
  email: user.email,
  avatar: user.avatar ?? null,
});

export const ProfileService = {
  updateProfile: async (
    payload: UpdateProfileDto
  ): Promise<ApiResponse<UserProfile>> => {
    const response = await apiClient.patch("/users/me", payload);
    const data = response.data as ApiResponse<RawUser>;
    return { ...data, data: normalizeUser(data.data) };
  },
  updatePassword: async (
    payload: UpdatePasswordDto
  ): Promise<ApiResponse<Record<string, never>>> => {
    const response = await apiClient.patch("/users/change-password", payload);
    return response.data as ApiResponse<Record<string, never>>;
  },
  uploadAvatar: async (
    payload: UpdateAvatarDto
  ): Promise<ApiResponse<UserProfile>> => {
    const response = await apiClient.patch("/users/me", payload);
    const data = response.data as ApiResponse<RawUser>;
    return { ...data, data: normalizeUser(data.data) };
  },
};
