import { AdminRole, PermissionKey, rolePermissionMatrix } from "@/data/admin";

const permissionLabels: Record<PermissionKey, string> = {
  manage_policies: "Manage policies",
  simulate_policies: "Simulate policies",
  enforce_policies: "Enforce policies",
  assign_risk: "Assign risk",
  resolve_risk: "Resolve risk",
  manage_users: "Manage users",
  view_audit: "View audit",
  manage_integrations: "Manage integrations",
  manage_settings: "Manage settings"
};

const roles: AdminRole[] = ["Super Admin", "Privacy Officer", "Security Engineer", "Legal Viewer"];

export function RoleMatrix() {
  const permissions = Object.keys(permissionLabels) as PermissionKey[];

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="overflow-x-auto">
        <table className="min-w-[880px] w-full text-sm">
          <thead className="bg-[#f8fafc] dark:bg-slate-900">
            <tr>
              <th className="px-3 py-3 text-left font-semibold text-muted">Permission Matrix</th>
              {roles.map((role) => (
                <th className="px-3 py-3 text-left font-semibold text-text dark:text-slate-100" key={role}>
                  {role}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border dark:divide-slate-800">
            {permissions.map((permission) => (
              <tr key={permission}>
                <td className="px-3 py-3 font-medium text-text dark:text-slate-100">{permissionLabels[permission]}</td>
                {roles.map((role) => (
                  <td className="px-3 py-3" key={`${role}-${permission}`}>
                    {rolePermissionMatrix[role].includes(permission) ? (
                      <span className="rounded-full bg-success/15 px-2 py-1 text-xs font-semibold text-success">Allowed</span>
                    ) : (
                      <span className="rounded-full bg-border/50 px-2 py-1 text-xs font-semibold text-muted">View only</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
