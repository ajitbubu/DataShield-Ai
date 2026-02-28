import { auditEvents, integrations, policies, risks, users } from "@/data/admin";

const globalAdminStore = globalThis as unknown as {
  adminPolicies?: typeof policies;
  adminRisks?: typeof risks;
  adminUsers?: typeof users;
  adminAudit?: typeof auditEvents;
  adminIntegrations?: typeof integrations;
};

if (!globalAdminStore.adminPolicies) globalAdminStore.adminPolicies = [...policies];
if (!globalAdminStore.adminRisks) globalAdminStore.adminRisks = [...risks];
if (!globalAdminStore.adminUsers) globalAdminStore.adminUsers = [...users];
if (!globalAdminStore.adminAudit) globalAdminStore.adminAudit = [...auditEvents];
if (!globalAdminStore.adminIntegrations) globalAdminStore.adminIntegrations = [...integrations];

export const adminPoliciesStore = globalAdminStore.adminPolicies;
export const adminRisksStore = globalAdminStore.adminRisks;
export const adminUsersStore = globalAdminStore.adminUsers;
export const adminAuditStore = globalAdminStore.adminAudit;
export const adminIntegrationsStore = globalAdminStore.adminIntegrations;
