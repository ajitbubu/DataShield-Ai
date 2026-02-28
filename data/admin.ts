export type AdminRole = "Super Admin" | "Privacy Officer" | "Security Engineer" | "Legal Viewer";

export type PermissionKey =
  | "manage_policies"
  | "simulate_policies"
  | "enforce_policies"
  | "assign_risk"
  | "resolve_risk"
  | "manage_users"
  | "view_audit"
  | "manage_integrations"
  | "manage_settings";

export type DashboardMetric = {
  id: string;
  label: string;
  value: string;
  trend: string;
  trendUp: boolean;
};

export type Policy = {
  id: string;
  name: string;
  regulation: "GDPR" | "CPRA" | "DPDP" | "HIPAA" | "GLBA" | "CPA";
  control: string;
  version: string;
  enforcementEnabled: boolean;
  code: string;
  updatedAt: string;
};

export type RiskItem = {
  id: string;
  type: string;
  source: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  regulationImpacted: string;
  status: "Open" | "In Progress" | "Resolved";
  owner: string;
  aiAutoTriage: boolean;
};

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  status: "Active" | "Invited";
};

export type AuditEvent = {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  regulation: string;
  details: string;
};

export type IntegrationItem = {
  id: string;
  name: string;
  status: "Connected" | "Needs Attention" | "Disconnected";
  lastSync: string;
};

export type SettingGroup = {
  id: string;
  title: string;
  description: string;
  fields: { key: string; label: string; value: string }[];
};

export const adminNavItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/roles", label: "Roles" },
  { href: "/admin/policies", label: "Policies" },
  { href: "/admin/risk", label: "Risk" },
  { href: "/admin/integrations", label: "Integrations" },
  { href: "/admin/audit", label: "Audit" },
  { href: "/admin/settings", label: "Settings" }
] as const;

export const rolePermissionMatrix: Record<AdminRole, PermissionKey[]> = {
  "Super Admin": [
    "manage_policies",
    "simulate_policies",
    "enforce_policies",
    "assign_risk",
    "resolve_risk",
    "manage_users",
    "view_audit",
    "manage_integrations",
    "manage_settings"
  ],
  "Privacy Officer": [
    "manage_policies",
    "simulate_policies",
    "enforce_policies",
    "assign_risk",
    "resolve_risk",
    "view_audit"
  ],
  "Security Engineer": ["simulate_policies", "assign_risk", "resolve_risk", "view_audit", "manage_integrations"],
  "Legal Viewer": ["view_audit"]
};

export const dashboardMetrics: DashboardMetric[] = [
  { id: "compliance", label: "Global Compliance Score", value: "91", trend: "+4.2%", trendUp: true },
  { id: "risks", label: "Active Risks", value: "12", trend: "-3", trendUp: true },
  { id: "consent", label: "Consent Coverage %", value: "97.6%", trend: "+1.1%", trendUp: true },
  { id: "dsar", label: "Open DSAR Requests", value: "18", trend: "-2", trendUp: true },
  { id: "violations", label: "Recent Violations", value: "5", trend: "+1", trendUp: false },
  { id: "alerts", label: "AI Alerts", value: "9", trend: "+2", trendUp: false }
];

const now = Date.now();

export const complianceTrend = [72, 74, 76, 80, 83, 85, 88, 89, 91];

export const aiFeatureHighlights = [
  "AI detected new tracker",
  "AI predicted consent violation risk",
  "AI recommended policy adjustment",
  "AI anomaly detection"
];

export const policies: Policy[] = [
  {
    id: "pol-001",
    name: "EU Explicit Consent Enforcement",
    regulation: "GDPR",
    control: "Consent Gate",
    version: "v3.4",
    enforcementEnabled: true,
    code: "IF user_location = EU THEN require explicit consent ELSE allow opt-out",
    updatedAt: new Date(now - 1000 * 60 * 60 * 5).toISOString()
  },
  {
    id: "pol-002",
    name: "CPRA Do Not Sell/Share Policy",
    regulation: "CPRA",
    control: "Preference Routing",
    version: "v2.1",
    enforcementEnabled: true,
    code: "IF signal = GPC OR do_not_sell = true THEN block ad-sharing endpoints",
    updatedAt: new Date(now - 1000 * 60 * 60 * 26).toISOString()
  },
  {
    id: "pol-003",
    name: "HIPAA Telemetry Minimization",
    regulation: "HIPAA",
    control: "Log Redaction",
    version: "v1.8",
    enforcementEnabled: false,
    code: "IF data_field IN [patient_name, MRN] THEN redact BEFORE log_export",
    updatedAt: new Date(now - 1000 * 60 * 60 * 50).toISOString()
  }
];

export const risks: RiskItem[] = [
  {
    id: "R-1021",
    type: "Consent Violation",
    source: "Web SDK",
    severity: "High",
    regulationImpacted: "GDPR",
    status: "Open",
    owner: "A. Morgan",
    aiAutoTriage: true
  },
  {
    id: "R-1022",
    type: "Shadow Script",
    source: "Tag Manager",
    severity: "Critical",
    regulationImpacted: "CPRA",
    status: "In Progress",
    owner: "K. Singh",
    aiAutoTriage: true
  },
  {
    id: "R-1023",
    type: "Retention Drift",
    source: "Data Lake",
    severity: "Medium",
    regulationImpacted: "DPDP",
    status: "Open",
    owner: "S. Patel",
    aiAutoTriage: false
  },
  {
    id: "R-1024",
    type: "PHI Exposure Pattern",
    source: "Observability",
    severity: "High",
    regulationImpacted: "HIPAA",
    status: "Resolved",
    owner: "L. Kim",
    aiAutoTriage: true
  }
];

export const users: AdminUser[] = [
  { id: "u-1", name: "Maya Ross", email: "maya@dataprivacyshield.com", role: "Super Admin", status: "Active" },
  {
    id: "u-2",
    name: "Devon Carter",
    email: "devon@dataprivacyshield.com",
    role: "Privacy Officer",
    status: "Active"
  },
  {
    id: "u-3",
    name: "Nina Alvarez",
    email: "nina@dataprivacyshield.com",
    role: "Security Engineer",
    status: "Active"
  },
  { id: "u-4", name: "Leo Grant", email: "leo@dataprivacyshield.com", role: "Legal Viewer", status: "Invited" }
];

export const auditEvents: AuditEvent[] = [
  {
    id: "audit-1",
    timestamp: new Date(now - 1000 * 60 * 15).toISOString(),
    user: "Maya Ross",
    action: "Updated policy v3.4",
    regulation: "GDPR",
    details: "Enabled EU explicit consent enforcement fallback in edge routing."
  },
  {
    id: "audit-2",
    timestamp: new Date(now - 1000 * 60 * 45).toISOString(),
    user: "Devon Carter",
    action: "Assigned risk R-1021",
    regulation: "GDPR",
    details: "Assigned to A. Morgan for remediation by end of week."
  },
  {
    id: "audit-3",
    timestamp: new Date(now - 1000 * 60 * 60 * 2).toISOString(),
    user: "Nina Alvarez",
    action: "Connected integration",
    regulation: "CPRA",
    details: "Added Segment data stream with policy sync enabled."
  },
  {
    id: "audit-4",
    timestamp: new Date(now - 1000 * 60 * 60 * 6).toISOString(),
    user: "Maya Ross",
    action: "Reviewed AI alert",
    regulation: "HIPAA",
    details: "Approved auto-redaction recommendation for PHI telemetry." 
  }
];

export const integrations: IntegrationItem[] = [
  { id: "int-1", name: "Google Tag Manager", status: "Connected", lastSync: new Date(now - 1000 * 60 * 8).toISOString() },
  { id: "int-2", name: "AWS", status: "Connected", lastSync: new Date(now - 1000 * 60 * 12).toISOString() },
  { id: "int-3", name: "Azure", status: "Needs Attention", lastSync: new Date(now - 1000 * 60 * 74).toISOString() },
  { id: "int-4", name: "Segment", status: "Connected", lastSync: new Date(now - 1000 * 60 * 18).toISOString() },
  { id: "int-5", name: "Salesforce", status: "Disconnected", lastSync: new Date(now - 1000 * 60 * 60 * 36).toISOString() },
  { id: "int-6", name: "Snowflake", status: "Connected", lastSync: new Date(now - 1000 * 60 * 22).toISOString() }
];

export const settingsGroups: SettingGroup[] = [
  {
    id: "retention",
    title: "Data Retention",
    description: "Define how long privacy evidence and event logs are retained.",
    fields: [
      { key: "event_log_days", label: "Event Log Retention (days)", value: "365" },
      { key: "audit_ledger_days", label: "Audit Ledger Retention (days)", value: "730" }
    ]
  },
  {
    id: "regional",
    title: "Regional Configuration",
    description: "Set default behavior by jurisdiction.",
    fields: [
      { key: "default_region", label: "Default Region", value: "Global" },
      { key: "fallback_model", label: "Default Consent Model", value: "Opt-in in EU / Opt-out elsewhere" }
    ]
  },
  {
    id: "ai",
    title: "AI Confidence Threshold",
    description: "Tune how conservative AI recommendations should be before auto-actions.",
    fields: [
      { key: "auto_action_threshold", label: "Auto-Action Threshold", value: "88" },
      { key: "anomaly_sensitivity", label: "Anomaly Sensitivity", value: "Medium" }
    ]
  },
  {
    id: "notifications",
    title: "Notification Rules",
    description: "Configure alerting channels and escalation windows.",
    fields: [
      { key: "security_alerts", label: "Security Alerts", value: "Slack + Email" },
      { key: "escalation_window", label: "Escalation Window", value: "4 hours" }
    ]
  }
];
