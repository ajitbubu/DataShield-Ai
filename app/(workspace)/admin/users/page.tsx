"use client";

import { useMemo, useState } from "react";
import { useAdminContext } from "@/components/admin/admin-context";
import { RoleMatrix } from "@/components/admin/role-matrix";
import { AdminRole, users } from "@/data/admin";
import { can } from "@/lib/admin";

const roles: AdminRole[] = ["Super Admin", "Privacy Officer", "Security Engineer", "Legal Viewer"];

export default function AdminUsersPage() {
  const { role } = useAdminContext();
  const [rows, setRows] = useState(users);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<AdminRole>("Legal Viewer");

  const canManageUsers = useMemo(() => can(role, "manage_users"), [role]);

  function inviteUser() {
    if (!canManageUsers || inviteEmail.trim().length < 5) return;

    setRows((prev) => [
      ...prev,
      {
        id: `u-${Date.now()}`,
        name: inviteEmail.split("@")[0],
        email: inviteEmail.trim(),
        role: inviteRole,
        status: "Invited"
      }
    ]);

    setInviteEmail("");
    setInviteRole("Legal Viewer");
    setShowInvite(false);
  }

  function changeRole(userId: string, nextRole: AdminRole) {
    if (!canManageUsers) return;
    setRows((prev) => prev.map((user) => (user.id === userId ? { ...user, role: nextRole } : user)));
  }

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-3xl font-bold text-text dark:text-slate-100">Users & Roles</h2>
          <p className="mt-1 text-sm text-muted dark:text-slate-300">Manage admin identities and role-based access controls.</p>
        </div>
        <button
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!canManageUsers}
          onClick={() => setShowInvite(true)}
          type="button"
        >
          Invite User
        </button>
      </header>

      <section className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <table className="min-w-full divide-y divide-border text-sm dark:divide-slate-800">
          <thead className="bg-[#f8fafc] dark:bg-slate-900">
            <tr>
              <th className="px-3 py-3 text-left font-semibold text-muted">User</th>
              <th className="px-3 py-3 text-left font-semibold text-muted">Email</th>
              <th className="px-3 py-3 text-left font-semibold text-muted">Role</th>
              <th className="px-3 py-3 text-left font-semibold text-muted">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border dark:divide-slate-800">
            {rows.map((user) => (
              <tr key={user.id}>
                <td className="px-3 py-3 font-semibold text-text dark:text-slate-100">{user.name}</td>
                <td className="px-3 py-3 text-muted dark:text-slate-300">{user.email}</td>
                <td className="px-3 py-3">
                  <select
                    className="rounded-md border border-border bg-background px-2 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900"
                    disabled={!canManageUsers}
                    onChange={(event) => changeRole(user.id, event.target.value as AdminRole)}
                    value={user.role}
                  >
                    {roles.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-3 py-3 text-muted dark:text-slate-300">{user.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <RoleMatrix />

      {showInvite ? (
        <div className="fixed inset-0 z-30 grid place-items-center bg-slate-900/40 p-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-surface p-5 shadow-lg dark:border-slate-800 dark:bg-slate-950">
            <h3 className="text-lg font-semibold text-text dark:text-slate-100">Invite User</h3>
            <div className="mt-4 space-y-3">
              <input
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
                onChange={(event) => setInviteEmail(event.target.value)}
                placeholder="email@company.com"
                type="email"
                value={inviteEmail}
              />
              <select
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
                onChange={(event) => setInviteRole(event.target.value as AdminRole)}
                value={inviteRole}
              >
                {roles.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button className="rounded-lg border border-border px-3 py-2 text-sm dark:border-slate-700" onClick={() => setShowInvite(false)} type="button">
                Cancel
              </button>
              <button className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white" onClick={inviteUser} type="button">
                Send Invite
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
