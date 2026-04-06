"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";

import { cn } from "@/lib/utils";
import { navItems } from "./nav-items";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function MobileSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (open) setOpen(false);
  }, [pathname]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label="Open navigation menu"
          className="inline-flex items-center justify-center rounded-md border border-white/10 bg-white/5 p-2 text-slate-200 transition-all duration-200 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25 }}
          className="flex h-full flex-col bg-slate-950"
        >
          <div className="flex items-center gap-2 border-b border-white/10 px-6 py-5">
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
          <nav aria-label="Mobile navigation" className="flex-1 px-4 py-6">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);
                const Icon = item.icon;

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-300 transition-all duration-200 hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600",
                        isActive &&
                          "bg-white/5 text-white border-l-2 border-indigo-500 pl-2.5",
                      )}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <Icon className="h-4 w-4 text-slate-400" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </motion.div>
      </SheetContent>
    </Sheet>
  );
}
