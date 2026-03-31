export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
}

export type UpdateProfileDto = {
  name: string;
};

export type UpdateAvatarDto = {
  avatar: string;
};

export type UpdatePasswordDto = {
  currentPassword: string;
  newPassword: string;
};

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
