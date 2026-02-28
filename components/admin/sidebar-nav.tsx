"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminNavItems } from "@/data/admin";
import { useAdminContext } from "@/components/admin/admin-context";
import { cn } from "@/lib/utils";

export function SidebarNav() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useAdminContext();

  return (
    <aside
      className={cn(
        "hidden border-r border-border bg-surface dark:border-slate-800 dark:bg-slate-950 lg:flex lg:flex-col",
        sidebarCollapsed ? "w-20" : "w-72"
      )}
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-4 dark:border-slate-800">
        {sidebarCollapsed ? null : (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">DataPrivacy Shield</p>
            <p className="text-sm font-semibold text-text dark:text-slate-100">Admin Command Center</p>
          </div>
        )}
        <button
          className="rounded-md border border-border px-2 py-1 text-xs text-muted transition-colors hover:text-primary dark:border-slate-700"
          onClick={toggleSidebar}
          type="button"
        >
          {sidebarCollapsed ? "→" : "←"}
        </button>
      </div>

      <nav className="space-y-1 p-3">
        {adminNavItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              className={cn(
                "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-[#eaf0ff] text-primary dark:bg-slate-900"
                  : "text-muted hover:text-primary dark:text-slate-300"
              )}
              href={item.href}
              key={item.href}
            >
              {sidebarCollapsed ? item.label.charAt(0) : item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
