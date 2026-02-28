"use client";

import { PolicyEditor } from "@/components/admin/policy-editor";
import { useAdminContext } from "@/components/admin/admin-context";
import { policies } from "@/data/admin";

export default function AdminPoliciesPage() {
  const { role } = useAdminContext();

  return (
    <div className="space-y-4">
      <header>
        <h2 className="text-3xl font-bold text-text dark:text-slate-100">Policy Engine</h2>
        <p className="mt-1 text-sm text-muted dark:text-slate-300">
          Create policies, map regulations to controls, version logic, and simulate enforcement.
        </p>
      </header>
      <PolicyEditor initialPolicies={policies} role={role} />
    </div>
  );
}
