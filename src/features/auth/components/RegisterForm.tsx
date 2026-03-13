"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Loader2, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";

import { RegisterSchema } from "../types/auth.schema";
import { useRegisterMutation } from "../hooks/use-auth-mutations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";

/**
 * UX Justification:
 * Password strength indicators offer real-time confidence, and animated error states using Framer Motion shake the UI naturally to alert users of validation failures without startling them.
 */
export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const registerMutation = useRegisterMutation();

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (values: z.infer<typeof RegisterSchema>) => {
    await registerMutation.mutateAsync(values);
  };

  const passwordValue = form.watch("password");

  // Simple password strength check
  const strengthChecks = {
    length: passwordValue.length >= 8,
    uppercase: /[A-Z]/.test(passwordValue),
    number: /[0-9]/.test(passwordValue),
  };

  const renderAnimatedMessage = (errorMsg: string | undefined) => (
    <AnimatePresence>
      {errorMsg && (
        <motion.p
          initial={{ opacity: 0, x: -10 }}
          animate={{
            opacity: 1,
            x: [-10, 10, -10, 10, 0],
          }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.4 }}
          className="text-xs font-medium text-rose-500 mt-2"
        >
          {errorMsg}
        </motion.p>
      )}
    </AnimatePresence>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-sm rounded-xl border border-white/10 bg-white/5 p-8 shadow-xl backdrop-blur-md"
    >
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Join FocusTube
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Create an account to start learning
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel className="text-white">Full Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="John Doe"
                    autoComplete="name"
                    className="focus:ring-indigo-500 transition-all duration-200"
                    {...field}
                  />
                </FormControl>
                {renderAnimatedMessage(fieldState.error?.message)}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel className="text-white">Email Address</FormLabel>
                <FormControl>
                  <Input
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="focus:ring-indigo-500 transition-all duration-200"
                    {...field}
                  />
                </FormControl>
                {renderAnimatedMessage(fieldState.error?.message)}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel className="text-white">Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      className="pr-10 focus:ring-indigo-500 transition-all duration-200"
                      {...field}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                
                {/* Strength Indicators */}
                {passwordValue.length > 0 && (
                  <div className="flex gap-2 text-xs mt-2">
                    <span className={cn("flex items-center gap-1", strengthChecks.length ? "text-emerald-400" : "text-slate-500")}>
                      {strengthChecks.length ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />} 8+ chars
                    </span>
                    <span className={cn("flex items-center gap-1", strengthChecks.uppercase ? "text-emerald-400" : "text-slate-500")}>
                      {strengthChecks.uppercase ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />} Uppercase
                    </span>
                    <span className={cn("flex items-center gap-1", strengthChecks.number ? "text-emerald-400" : "text-slate-500")}>
                      {strengthChecks.number ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />} Number
                    </span>
                  </div>
                )}
                {renderAnimatedMessage(fieldState.error?.message)}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel className="text-white">Confirm Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      className="pr-10 focus:ring-indigo-500 transition-all duration-200"
                      {...field}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                {renderAnimatedMessage(fieldState.error?.message)}
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full mt-6 cursor-pointer"
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Create Account
          </Button>

          <p className="text-center text-sm text-slate-400 pt-2">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-indigo-400 transition-colors hover:text-indigo-300"
            >
              Sign in
            </Link>
          </p>
        </form>
      </Form>
    </motion.div>
  );
}
