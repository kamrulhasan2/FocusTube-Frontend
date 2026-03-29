import { z } from "zod";

export const UpdateProfileSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(120, { message: "Name must be 120 characters or less." }),
});

export const UpdatePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(8, { message: "Current password must be at least 8 characters." }),
    newPassword: z
      .string()
      .min(8, { message: "New password must be at least 8 characters." })
      .regex(/[0-9]/, { message: "Include at least one number." })
      .regex(/[^a-zA-Z0-9]/, {
        message: "Include at least one special character.",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type UpdateProfileValues = z.infer<typeof UpdateProfileSchema>;
export type UpdatePasswordValues = z.infer<typeof UpdatePasswordSchema>;
