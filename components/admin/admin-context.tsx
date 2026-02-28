"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { AdminRole } from "@/data/admin";

type AdminContextState = {
  role: AdminRole;
  setRole: (role: AdminRole) => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
};

const AdminContext = createContext<AdminContextState | null>(null);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<AdminRole>("Privacy Officer");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const value = useMemo(
    () => ({
      role,
      setRole,
      sidebarCollapsed,
      toggleSidebar: () => setSidebarCollapsed((prev) => !prev),
      theme,
      toggleTheme: () => setTheme((prev) => (prev === "light" ? "dark" : "light"))
    }),
    [role, sidebarCollapsed, theme]
  );

  return (
    <AdminContext.Provider value={value}>
      <div className={theme === "dark" ? "dark" : ""}>{children}</div>
    </AdminContext.Provider>
  );
}

export function useAdminContext() {
  const context = useContext(AdminContext);

  if (!context) {
    throw new Error("useAdminContext must be used inside AdminProvider");
  }

  return context;
}
