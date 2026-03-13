import { ReactNode } from "react";

import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";

type DashboardLayoutProps = {
  children: ReactNode;
};

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 md:flex">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col md:h-screen">
        <Navbar />
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-6">
          {children}
        </main>
      </div>
    </div>
  );
}
