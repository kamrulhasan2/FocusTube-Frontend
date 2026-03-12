import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication | FocusTube",
  description: "Sign in to your FocusTube account or create a new one.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh items-center justify-center p-4 selection:bg-indigo-500/30">
      {children}
    </div>
  );
}
