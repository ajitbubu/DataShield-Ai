"use client";

import { useMemo, useState } from "react";
import { AdminRole, RiskItem } from "@/data/admin";
import { can, severityTone } from "@/lib/admin";

type RiskTableProps = {
  initialRisks: RiskItem[];
  role: AdminRole;
};

const owners = ["A. Morgan", "K. Singh", "S. Patel", "L. Kim", "N. Alvarez"];

export function RiskTable({ initialRisks, role }: RiskTableProps) {
  const [rows, setRows] = useState(initialRisks);
  const [filter, setFilter] = useState<"All" | RiskItem["status"]>("All");

  const visible = useMemo(
    () => rows.filter((row) => filter === "All" || row.status === filter),
    [rows, filter]
  );

  const allowAssign = can(role, "assign_risk");
  const allowResolve = can(role, "resolve_risk");

  function assignOwner(riskId: string, owner: string) {
    if (!allowAssign) return;
    setRows((prev) => prev.map((row) => (row.id === riskId ? { ...row, owner } : row)));
  }

  function markResolved(riskId: string) {
    if (!allowResolve) return;
    setRows((prev) => prev.map((row) => (row.id === riskId ? { ...row, status: "Resolved" } : row)));
  }

  return (
    <div className="rounded-xl border border-border bg-surface shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3 dark:border-slate-800">
        <h2 className="text-xl font-semibold text-text dark:text-slate-100">AI Risk Monitoring</h2>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted">Status</span>
          <select
            className="rounded-md border border-border bg-background px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-900"
            onChange={(event) => setFilter(event.target.value as "All" | RiskItem["status"])}
            value={filter}
          >
            <option value="All">All</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[980px] w-full text-sm">
          <thead className="bg-[#f8fafc] dark:bg-slate-900">
            <tr>
              {[
                "Risk ID",
                "Type",
                "Source",
                "Severity",
                "Regulation impacted",
                "Status",
                "Assigned owner",
                "AI auto-triage",
                "Actions"
              ].map((col) => (
                <th className="px-3 py-3 text-left font-semibold text-muted" key={col}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border dark:divide-slate-800">
            {visible.map((risk) => (
              <tr className="hover:bg-[#fbfdff] dark:hover:bg-slate-900" key={risk.id}>
                <td className="px-3 py-3 font-semibold text-text dark:text-slate-100">{risk.id}</td>
                <td className="px-3 py-3 text-muted dark:text-slate-300">{risk.type}</td>
                <td className="px-3 py-3 text-muted dark:text-slate-300">{risk.source}</td>
                <td className="px-3 py-3">
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${severityTone(risk.severity)}`}>
                    {risk.severity}
                  </span>
                </td>
                <td className="px-3 py-3 text-muted dark:text-slate-300">{risk.regulationImpacted}</td>
                <td className="px-3 py-3 text-muted dark:text-slate-300">{risk.status}</td>
                <td className="px-3 py-3">
                  <select
                    className="rounded-md border border-border bg-background px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-900"
                    disabled={!allowAssign}
                    onChange={(event) => assignOwner(risk.id, event.target.value)}
                    value={risk.owner}
                  >
                    {owners.map((owner) => (
                      <option key={owner} value={owner}>
                        {owner}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-3 py-3 text-muted dark:text-slate-300">{risk.aiAutoTriage ? "Enabled" : "Disabled"}</td>
                <td className="px-3 py-3">
                  <button
                    className="rounded-md border border-border px-2 py-1 text-xs font-semibold text-primary disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700"
                    disabled={!allowResolve || risk.status === "Resolved"}
                    onClick={() => markResolved(risk.id)}
                    type="button"
                  >
                    Mark Resolved
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
