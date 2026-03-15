import { ReactNode } from "react";

import { Navbar } from "./Navbar";
import { DevDebugPanelClient } from "@/components/shared/DevDebugPanelClient";

type DashboardLayoutProps = {
  children: ReactNode;
};

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <main className="flex-1 overflow-y-auto px-4 py-6 md:px-6">
        {children}
      </main>
      <DevDebugPanelClient />
    </div>
  );
}
