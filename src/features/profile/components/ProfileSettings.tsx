"use client";

import { useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, PencilLine } from "lucide-react";

import {
  UpdateProfileSchema,
  type UpdateProfileValues,
} from "../schemas/profile.schema";
import { useUpdateProfile } from "../hooks/use-profile-actions";
import { useAuthStore } from "@/store/use-auth-store";
import { useShallow } from "zustand/react/shallow";
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

const DEBOUNCE_MS = 600;

export function ProfileSettings() {
  const { user } = useAuthStore(
    useShallow((state) => ({
      user: state.user,
    })),
  );

  const updateProfile = useUpdateProfile();
  const lastSubmitRef = useRef(0);

  const defaultName = user?.name ?? "";
  const defaultEmail = user?.email ?? "";

  const form = useForm<UpdateProfileValues>({
    resolver: zodResolver(UpdateProfileSchema),
    defaultValues: {
      name: defaultName,
    },
  });

  useEffect(() => {
    form.reset({ name: defaultName });
  }, [defaultName, form]);

  const isSubmitDisabled = useMemo(() => {
    return updateProfile.isPending || !form.formState.isDirty;
  }, [form.formState.isDirty, updateProfile.isPending]);

  const onSubmit = async (values: UpdateProfileValues) => {
    const now = Date.now();
    if (now - lastSubmitRef.current < DEBOUNCE_MS) return;
    lastSubmitRef.current = now;
    await updateProfile.mutateAsync({ name: values.name.trim() });
  };

  return (
    <section className="rounded-xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/15 text-indigo-300">
          <PencilLine className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">Profile Details</h2>
          <p className="text-sm text-slate-400">
            Keep your name fresh so teammates recognize you instantly.
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Full Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your name"
                    autoComplete="name"
                    className="focus-visible:ring-indigo-500"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <FormLabel className="text-white">Email Address</FormLabel>
            <Input
              value={defaultEmail}
              readOnly
              aria-readonly="true"
              className="mt-2 border-white/10 bg-white/10 text-slate-300"
            />
            <p className="mt-2 text-xs text-slate-500">
              Email updates are managed by support for security reasons.
            </p>
          </div>

          <Button
            type="submit"
            className="w-full sm:w-auto"
            disabled={isSubmitDisabled}
          >
            {updateProfile.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Save changes
          </Button>
        </form>
      </Form>
    </section>
  );
}
