import { ReactNode } from "react"

import { Navbar } from "./Navbar"

type DashboardLayoutProps = {
  children: ReactNode;
};

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Suspense
        fallback={
          <div className="border-b border-white/10 bg-black/40 px-4 py-3 md:px-6">
            <Skeleton className="h-6 w-56" />
          </div>
        }
      >
        <Navbar />
      </Suspense>
      <main className="flex-1 overflow-y-auto px-4 py-6 md:px-6">
        {children}
      </main>
    </div>
  )
}
