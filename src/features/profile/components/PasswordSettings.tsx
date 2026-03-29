"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";

import {
  UpdatePasswordSchema,
  type UpdatePasswordValues,
} from "../schemas/profile.schema";
import { useUpdatePassword } from "../hooks/use-profile-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";

const buildStrength = (password: string) => {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;

  if (!password) return { label: "Enter a new password", color: "text-slate-500" };
  if (score <= 2) return { label: "Weak", color: "text-red-400" };
  if (score === 3) return { label: "Good", color: "text-amber-400" };
  return { label: "Strong", color: "text-emerald-400" };
};

export function PasswordSettings() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const updatePassword = useUpdatePassword();

  const form = useForm<UpdatePasswordValues>({
    resolver: zodResolver(UpdatePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPasswordValue = form.watch("newPassword");
  const strength = useMemo(
    () => buildStrength(newPasswordValue ?? ""),
    [newPasswordValue],
  );

  const onSubmit = async (values: UpdatePasswordValues) => {
    try {
      await updatePassword.mutateAsync({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      form.reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch {
      // Errors are surfaced via the mutation toast.
    }
  };

  return (
    <section className="rounded-xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-300">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">Password Security</h2>
          <p className="text-sm text-slate-400">
            Rotate credentials regularly to keep your learning space secure.
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Current Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showCurrent ? "text" : "password"}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      className="pr-10 focus-visible:ring-indigo-500"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent((state) => !state)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      aria-label={showCurrent ? "Hide password" : "Show password"}
                    >
                      {showCurrent ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">New Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showNew ? "text" : "password"}
                      placeholder="At least 8 characters"
                      autoComplete="new-password"
                      className="pr-10 focus-visible:ring-indigo-500"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew((state) => !state)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      aria-label={showNew ? "Hide password" : "Show password"}
                    >
                      {showNew ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <p className={cn("mt-2 text-xs", strength.color)}>
                  Strength: {strength.label} — include a number and special
                  character.
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Confirm Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showConfirm ? "text" : "password"}
                      placeholder="Re-enter new password"
                      autoComplete="new-password"
                      className="pr-10 focus-visible:ring-indigo-500"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((state) => !state)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      aria-label={showConfirm ? "Hide password" : "Show password"}
                    >
                      {showConfirm ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full sm:w-auto"
            disabled={updatePassword.isPending}
          >
            {updatePassword.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Update password
          </Button>
        </form>
      </Form>
    </section>
  );
}
