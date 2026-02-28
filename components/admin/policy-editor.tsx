"use client";

import { useMemo, useState } from "react";
import { AdminRole, Policy } from "@/data/admin";
import { can } from "@/lib/admin";

type PolicyEditorProps = {
  initialPolicies: Policy[];
  role: AdminRole;
};

export function PolicyEditor({ initialPolicies, role }: PolicyEditorProps) {
  const [items, setItems] = useState<Policy[]>(initialPolicies);
  const [selectedPolicyId, setSelectedPolicyId] = useState(initialPolicies[0]?.id ?? "");
  const [simulationResult, setSimulationResult] = useState<string>("");

  const selectedPolicy = useMemo(
    () => items.find((policy) => policy.id === selectedPolicyId) ?? items[0],
    [items, selectedPolicyId]
  );

  const allowManage = can(role, "manage_policies");
  const allowSimulate = can(role, "simulate_policies");
  const allowEnforce = can(role, "enforce_policies");

  function toggleEnforcement(policyId: string) {
    if (!allowEnforce) return;

    setItems((prev) =>
      prev.map((policy) =>
        policy.id === policyId ? { ...policy, enforcementEnabled: !policy.enforcementEnabled } : policy
      )
    );
  }

  function createPolicy() {
    if (!allowManage) return;

    const newPolicy: Policy = {
      id: `pol-${Date.now()}`,
      name: "New Policy Draft",
      regulation: "GDPR",
      control: "Consent Gate",
      version: "v1.0",
      enforcementEnabled: false,
      code: "IF user_location = EU THEN require explicit consent ELSE allow opt-out",
      updatedAt: new Date().toISOString()
    };

    setItems((prev) => [newPolicy, ...prev]);
    setSelectedPolicyId(newPolicy.id);
  }

  function simulatePolicy() {
    if (!allowSimulate || !selectedPolicy) return;

    const output = `${selectedPolicy.name}: Simulation indicates ${selectedPolicy.enforcementEnabled ? "active enforcement" : "draft mode"}. Estimated impact: 14 blocked pre-consent scripts and 6 consent route corrections.`;
    setSimulationResult(output);
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
      <aside className="rounded-xl border border-border bg-surface p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">Policies</h3>
          <button
            className="rounded-md border border-border px-2 py-1 text-xs font-semibold text-primary disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700"
            disabled={!allowManage}
            onClick={createPolicy}
            type="button"
          >
            Create policy
          </button>
        </div>

        <div className="max-h-[520px] space-y-2 overflow-y-auto pr-1">
          {items.map((policy) => (
            <button
              className={`w-full rounded-lg border p-3 text-left ${
                policy.id === selectedPolicyId
                  ? "border-primary bg-[#eaf0ff] dark:bg-slate-900"
                  : "border-border bg-background dark:border-slate-800 dark:bg-slate-900"
              }`}
              key={policy.id}
              onClick={() => setSelectedPolicyId(policy.id)}
              type="button"
            >
              <p className="text-sm font-semibold text-text dark:text-slate-100">{policy.name}</p>
              <p className="mt-1 text-xs text-muted">{policy.regulation} • {policy.version}</p>
            </button>
          ))}
        </div>
      </aside>

      <section className="space-y-4">
        {selectedPolicy ? (
          <div className="rounded-xl border border-border bg-surface p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-semibold text-text dark:text-slate-100">{selectedPolicy.name}</h2>
                <p className="mt-1 text-sm text-muted">Map regulation → control with versioned policy enforcement.</p>
              </div>
              <button
                className="rounded-lg border border-border px-3 py-2 text-sm font-semibold text-primary disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700"
                disabled={!allowEnforce}
                onClick={() => toggleEnforcement(selectedPolicy.id)}
                type="button"
              >
                {selectedPolicy.enforcementEnabled ? "Disable Enforcement" : "Enable Enforcement"}
              </button>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-border bg-background p-3 dark:border-slate-800 dark:bg-slate-900">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">Regulation</p>
                <p className="mt-1 text-sm text-text dark:text-slate-100">{selectedPolicy.regulation}</p>
              </div>
              <div className="rounded-lg border border-border bg-background p-3 dark:border-slate-800 dark:bg-slate-900">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">Control</p>
                <p className="mt-1 text-sm text-text dark:text-slate-100">{selectedPolicy.control}</p>
              </div>
              <div className="rounded-lg border border-border bg-background p-3 dark:border-slate-800 dark:bg-slate-900">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">Version</p>
                <p className="mt-1 text-sm text-text dark:text-slate-100">{selectedPolicy.version}</p>
              </div>
            </div>
          </div>
        ) : null}

        <div className="rounded-xl border border-border bg-surface p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">Policy-as-Code Preview</h3>
            <button
              className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!allowSimulate || !selectedPolicy}
              onClick={simulatePolicy}
              type="button"
            >
              Policy Simulation
            </button>
          </div>

          <pre className="overflow-x-auto rounded-lg border border-border bg-[#0f172a] p-4 text-xs text-[#cbd5e1] dark:border-slate-800">
            <code>{selectedPolicy?.code}</code>
          </pre>

          {simulationResult ? (
            <div className="mt-4 rounded-lg border border-border bg-background p-3 text-sm text-muted dark:border-slate-800 dark:bg-slate-900">
              {simulationResult}
            </div>
          ) : null}
        </div>

        {!allowManage ? (
          <p className="text-sm text-warning">Current role has limited write access. Switch role in the header to manage policies.</p>
        ) : null}
      </section>
    </div>
  );
}
