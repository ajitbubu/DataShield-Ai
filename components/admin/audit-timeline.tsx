"use client";

import { useMemo, useState } from "react";
import { AuditEvent } from "@/data/admin";

type AuditTimelineProps = {
  events: AuditEvent[];
};

export function AuditTimeline({ events }: AuditTimelineProps) {
  const [userFilter, setUserFilter] = useState("All");
  const [actionFilter, setActionFilter] = useState("");
  const [regulationFilter, setRegulationFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");

  const users = Array.from(new Set(events.map((event) => event.user)));
  const regulations = Array.from(new Set(events.map((event) => event.regulation)));

  const filtered = useMemo(() => {
    const action = actionFilter.trim().toLowerCase();

    return events.filter((event) => {
      const byUser = userFilter === "All" || event.user === userFilter;
      const byRegulation = regulationFilter === "All" || event.regulation === regulationFilter;
      const byAction = action.length === 0 || event.action.toLowerCase().includes(action);
      const byDate = dateFilter.length === 0 || event.timestamp.startsWith(dateFilter);

      return byUser && byRegulation && byAction && byDate;
    });
  }, [events, userFilter, actionFilter, regulationFilter, dateFilter]);

  return (
    <section className="rounded-xl border border-border bg-surface shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="space-y-3 border-b border-border px-4 py-4 dark:border-slate-800">
        <h2 className="text-xl font-semibold text-text dark:text-slate-100">Audit Ledger Timeline</h2>
        <div className="grid gap-2 md:grid-cols-4">
          <select
            className="rounded-md border border-border bg-background px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
            onChange={(event) => setUserFilter(event.target.value)}
            value={userFilter}
          >
            <option value="All">All users</option>
            {users.map((user) => (
              <option key={user} value={user}>
                {user}
              </option>
            ))}
          </select>
          <input
            className="rounded-md border border-border bg-background px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
            onChange={(event) => setActionFilter(event.target.value)}
            placeholder="Filter action"
            value={actionFilter}
          />
          <select
            className="rounded-md border border-border bg-background px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
            onChange={(event) => setRegulationFilter(event.target.value)}
            value={regulationFilter}
          >
            <option value="All">All regulations</option>
            {regulations.map((regulation) => (
              <option key={regulation} value={regulation}>
                {regulation}
              </option>
            ))}
          </select>
          <input
            className="rounded-md border border-border bg-background px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
            onChange={(event) => setDateFilter(event.target.value)}
            type="date"
            value={dateFilter}
          />
        </div>
        <button className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold text-primary dark:border-slate-700" type="button">
          Export (UI)
        </button>
      </div>

      <ol className="space-y-3 p-4">
        {filtered.map((event) => (
          <li className="rounded-lg border border-border bg-background p-3 dark:border-slate-800 dark:bg-slate-900" key={event.id}>
            <p className="text-xs text-muted">{new Date(event.timestamp).toLocaleString()}</p>
            <p className="mt-1 text-sm font-semibold text-text dark:text-slate-100">{event.action}</p>
            <p className="mt-1 text-xs text-muted">{event.user} • {event.regulation}</p>
            <p className="mt-2 text-sm text-muted">{event.details}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
