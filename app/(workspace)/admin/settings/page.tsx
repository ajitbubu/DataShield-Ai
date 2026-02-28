"use client";

import { useMemo } from "react";
import { useAdminContext } from "@/components/admin/admin-context";
import { settingsGroups } from "@/data/admin";
import { can } from "@/lib/admin";

export default function AdminSettingsPage() {
  const { role } = useAdminContext();
  const canManageSettings = useMemo(() => can(role, "manage_settings"), [role]);

  return (
    <div className="space-y-5">
      <header>
        <h2 className="text-3xl font-bold text-text dark:text-slate-100">Settings</h2>
        <p className="mt-1 text-sm text-muted dark:text-slate-300">
          Configure data retention, regional defaults, AI confidence thresholds, and notification rules.
        </p>
      </header>

      <div className="space-y-4">
        {settingsGroups.map((group) => (
          <section className="rounded-xl border border-border bg-surface p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950" key={group.id}>
            <h3 className="text-xl font-semibold text-text dark:text-slate-100">{group.title}</h3>
            <p className="mt-1 text-sm text-muted dark:text-slate-300">{group.description}</p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {group.fields.map((field) => (
                <label className="space-y-1" key={field.key}>
                  <span className="text-xs font-semibold uppercase tracking-wide text-muted">{field.label}</span>
                  <input
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900"
                    defaultValue={field.value}
                    disabled={!canManageSettings}
                  />
                </label>
              ))}
            </div>
          </section>
        ))}
      </div>

      {!canManageSettings ? (
        <p className="text-sm text-warning">Current role is read-only for platform settings.</p>
      ) : (
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white" type="button">
          Save Settings
        </button>
      )}
    </div>
  );
}
