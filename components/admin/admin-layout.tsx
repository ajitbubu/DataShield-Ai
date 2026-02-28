"use client";

import { AdminRole } from "@/data/admin";
import { SidebarNav } from "@/components/admin/sidebar-nav";
import { useAdminContext } from "@/components/admin/admin-context";

const roles: AdminRole[] = ["Super Admin", "Privacy Officer", "Security Engineer", "Legal Viewer"];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { role, setRole, theme, toggleTheme } = useAdminContext();

  return (
    <div className="flex min-h-screen bg-background text-text dark:bg-slate-950 dark:text-slate-100">
      <SidebarNav />
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 border-b border-border bg-background/95 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">Privacy Intelligence & Enforcement Command Center</p>
              <h1 className="text-lg font-semibold">Admin Control Panel</h1>
            </div>
            <div className="flex items-center gap-2">
              <select
                className="rounded-lg border border-border bg-surface px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
                onChange={(event) => setRole(event.target.value as AdminRole)}
                value={role}
              >
                {roles.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <button
                className="rounded-lg border border-border px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted dark:border-slate-700"
                onClick={toggleTheme}
                type="button"
              >
                {theme === "dark" ? "Light" : "Dark"}
              </button>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
