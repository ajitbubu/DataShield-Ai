import { RoleMatrix } from "@/components/admin/role-matrix";

export default function AdminRolesPage() {
  return (
    <div className="space-y-5">
      <header>
        <h2 className="text-3xl font-bold text-text dark:text-slate-100">Role Governance</h2>
        <p className="mt-1 text-sm text-muted dark:text-slate-300">
          Permission architecture for Super Admin, Privacy Officer, Security Engineer, and Legal Viewer.
        </p>
      </header>
      <RoleMatrix />
    </div>
  );
}
