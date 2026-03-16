"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { DrawerSidebar } from "./DrawerSidebar";
import { UserNav } from "./UserNav";

const breadcrumbLabels: Record<string, string> = {
  dashboard: "Dashboard",
  library: "Library",
  search: "Search",
  player: "Player",
  profile: "Profile",
  settings: "Settings",
  billing: "Billing",
};

const formatSegment = (segment: string) =>
  breadcrumbLabels[segment] ??
  segment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

export function Navbar() {
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 0) return ["Dashboard"];

    const base = segments[0] === "dashboard" ? [] : ["dashboard"];
    return [...base, ...segments]
      .filter((segment) => segment !== "")
      .map(formatSegment);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-black/40 backdrop-blur-md">
      <div className="flex items-center justify-between gap-4 px-4 py-3 md:px-6">
        <div className="flex items-center gap-3">
          <DrawerSidebar />
          <nav aria-label="Breadcrumb" className="max-w-[55vw]">
            <ol className="flex items-center gap-2 text-sm text-slate-400 overflow-hidden">
              {breadcrumbs.map((crumb, index) => (
                <li
                  key={`${crumb}-${index}`}
                  className="flex items-center gap-2 min-w-0"
                >
                  <span className="text-slate-200 truncate">{crumb}</span>
                  {index < breadcrumbs.length - 1 ? (
                    <span className="text-slate-600">/</span>
                  ) : null}
                </li>
              ))}
            </ol>
          </nav>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <Input
              placeholder="Search your library"
              aria-label="Global search"
              className="h-9 w-64 border-white/10 bg-white/5 pl-9 text-sm text-slate-200 placeholder:text-slate-500 focus-visible:ring-indigo-600"
            />
          </div>
          <UserNav />
        </div>

        <div className="md:hidden">
          <UserNav />
        </div>
      </div>
    </header>
  );
}
