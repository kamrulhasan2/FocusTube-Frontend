"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { cn } from "@/lib/utils";
import { navItems } from "./nav-items";
import { LibraryService } from "@/features/library/services/library.service";

export function Sidebar() {
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const handlePrefetch = (href: string) => {
    if (href === "/library") {
      void queryClient.prefetchQuery({
        queryKey: ["my-library"],
        queryFn: () => LibraryService.getMyLibrary(),
        staleTime: 1000 * 60 * 10,
      });
    }
  };

  return (
    <aside className="hidden h-screen w-[260px] shrink-0 border-r border-white/10 bg-slate-950 md:flex md:flex-col md:sticky md:top-0">
      <div className="flex items-center gap-2 px-6 py-6">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950/60 ring-1 ring-white/10">
          <Image
            src="/FocusTube.png"
            alt="FocusTube logo"
            width={28}
            height={28}
            className="h-7 w-7 rounded-full object-contain"
            priority
          />
        </span>
        <Link href="/dashboard" className="text-lg font-semibold text-white">
          FocusTube
        </Link>
      </div>
      <nav aria-label="Primary" className="flex-1 px-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onMouseEnter={() => handlePrefetch(item.href)}
                  className={cn(
                    "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-300 transition-all duration-200 hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600",
                    isActive &&
                      "bg-white/5 text-white border-l-2 border-indigo-500 pl-2.5",
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className="h-4 w-4 text-slate-400 group-hover:text-white" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="px-6 py-4 text-xs text-slate-500">
        Distraction-free learning
      </div>
    </aside>
  );
}
