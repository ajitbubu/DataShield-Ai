"use client";

import { IntegrationCard } from "@/components/admin/integration-card";
import { useAdminContext } from "@/components/admin/admin-context";
import { integrations } from "@/data/admin";
import { can } from "@/lib/admin";

export default function AdminIntegrationsPage() {
  const { role } = useAdminContext();
  const canManage = can(role, "manage_integrations");

  return (
    <div className="space-y-4">
      <header>
        <h2 className="text-3xl font-bold text-text dark:text-slate-100">Integrations</h2>
        <p className="mt-1 text-sm text-muted dark:text-slate-300">
          Connect privacy controls to operational systems for continuous enforcement.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {integrations.map((item) => (
          <IntegrationCard canManage={canManage} item={item} key={item.id} />
        ))}
      </div>
    </div>
  );
}
