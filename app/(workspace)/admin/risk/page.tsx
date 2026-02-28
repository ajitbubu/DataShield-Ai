"use client";

import { RiskTable } from "@/components/admin/risk-table";
import { useAdminContext } from "@/components/admin/admin-context";
import { risks } from "@/data/admin";

export default function AdminRiskPage() {
  const { role } = useAdminContext();

  return (
    <div className="space-y-4">
      <header>
        <h2 className="text-3xl font-bold text-text dark:text-slate-100">AI Risk Monitoring</h2>
        <p className="mt-1 text-sm text-muted dark:text-slate-300">
          Auto-triage risk signals, assign ownership, and drive closure workflows.
        </p>
      </header>
      <RiskTable initialRisks={risks} role={role} />
    </div>
  );
}
