import { ReactNode } from "react";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

export default function DashboardShell({
  children,
}: {
  children: ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
