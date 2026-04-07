"use client";

import { useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LogOut, Settings, UserCircle, CreditCard } from "lucide-react";

import { useAuthStore } from "@/store/use-auth-store";
import { useShallow } from "zustand/react/shallow";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const getInitials = (name?: string) => {
  if (!name) return "FT";
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

export function UserNav() {
  const router = useRouter();
  const { user, clearAuth } = useAuthStore(
    useShallow((state) => ({
      user: state.user,
      clearAuth: state.clearAuth,
    })),
  );

  const initials = useMemo(() => getInitials(user?.name), [user?.name]);

  const handleLogout = () => {
    clearAuth();
    router.replace("/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <button
          type="button"
          aria-label="Open user menu"
          className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-sm text-slate-200 transition-all duration-200 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
        >
          <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-indigo-600/20 text-xs font-semibold text-white">
            {user?.avatar ? (
              <Image
                src={user.avatar}
                alt={user?.name ?? "User avatar"}
                width={32}
                height={32}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <span>{initials}</span>
            )}
          </div>
          <span className="hidden text-left md:block">
            <span className="block text-xs text-slate-400">Signed in as</span>
            <span className="block text-sm font-medium text-white">
              {user?.name ?? "FocusTube User"}
            </span>
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          <div className="space-y-1">
            <p className="text-sm font-medium text-white">
              {user?.name ?? "FocusTube User"}
            </p>
            <p className="text-xs text-slate-400">
              {user?.email ?? "user@focustube.com"}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onSelect={() => router.replace("/profile")}>
          <UserCircle className="mr-2 h-4 w-4 text-slate-400" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onSelect={() => router.replace("/billing")}>
          <CreditCard className="mr-2 h-4 w-4 text-slate-400" />
          Billing
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onSelect={() => router.replace("/settings")}>
          <Settings className="mr-2 h-4 w-4 text-slate-400" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={handleLogout}
          className="cursor-pointer text-red-500 focus:text-red-500"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
