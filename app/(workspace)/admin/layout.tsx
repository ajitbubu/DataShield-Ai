import type { Metadata } from "next";
import { AdminProvider } from "@/components/admin/admin-context";
import { AdminLayout as AdminShell } from "@/components/admin/admin-layout";

export const metadata: Metadata = {
  title: "Admin Control Panel | DataPrivacy Shield",
  description:
    "Privacy Intelligence & Enforcement Command Center for governance, policy automation, and compliance posture monitoring."
};

export default function AdminRouteLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <AdminShell>{children}</AdminShell>
    </AdminProvider>
  );
}
