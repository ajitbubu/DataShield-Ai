export type CopilotRegulation = "GDPR" | "CPRA" | "DPDP" | "HIPAA" | "GLBA" | "CPA";
export type RiskLevel = "Low" | "Medium" | "High";

export type CopilotRisk = {
  title: string;
  level: RiskLevel;
  detail: string;
};

export type CopilotResponse = {
  summary: string;
  risks: CopilotRisk[];
  recommendations: string[];
  relatedProducts: string[];
  confidence: number;
  legalReferences: string[];
  nextActions: string[];
  complianceScore: number;
  querySnippet: string;
};

export type CopilotChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  response?: CopilotResponse;
};

export type CopilotSession = {
  id: string;
  title: string;
  regulation: CopilotRegulation;
  updatedAt: string;
  preview: string;
  messages: CopilotChatMessage[];
};

export const copilotRegulations: CopilotRegulation[] = ["GDPR", "CPRA", "DPDP", "HIPAA", "GLBA", "CPA"];

export const copilotTemplates = [
  "Generate DPIA",
  "Cookie Audit Review",
  "DSAR Compliance Check",
  "Consent Risk Analysis"
] as const;

const nowIso = new Date().toISOString();

export const copilotSessions: CopilotSession[] = [
  {
    id: "gdpr-cookie-readiness",
    title: "GDPR Cookie Readiness",
    regulation: "GDPR",
    updatedAt: nowIso,
    preview: "Need risk review for third-party trackers and consent propagation.",
    messages: [
      {
        id: "m-1",
        role: "user",
        content: "Audit our GDPR cookie controls for analytics and ad pixels.",
        createdAt: nowIso
      },
      {
        id: "m-2",
        role: "assistant",
        content: "Generated GDPR cookie compliance assessment.",
        createdAt: nowIso,
        response: {
          summary:
            "Your cookie controls are partially compliant. Prior consent enforcement exists, but evidence retention and vendor governance controls require tightening.",
          risks: [
            {
              title: "Tracker drift across landing pages",
              level: "High",
              detail: "Unmanaged scripts can bypass consent checks during campaign launches."
            },
            {
              title: "Inconsistent preference propagation",
              level: "Medium",
              detail: "Web and mobile preference states are not fully synchronized."
            }
          ],
          recommendations: [
            "Enable pre-deployment cookie scans in release workflows",
            "Enforce consent state sync across all analytics and ad destinations",
            "Retain consent event evidence with policy version references"
          ],
          relatedProducts: ["cookie-governance", "consent-management", "compliance-audit"],
          confidence: 87,
          legalReferences: ["GDPR Art. 6", "GDPR Art. 7", "ePrivacy consent guidance"],
          nextActions: [
            "Run weekly tracker drift report",
            "Map vendors to lawful basis register",
            "Generate audit packet for QBR"
          ],
          complianceScore: 72,
          querySnippet: "SELECT domain, cookie_name, category, consent_state FROM consent_events WHERE consent_state != 'granted';"
        }
      }
    ]
  },
  {
    id: "cpra-dsar-latency",
    title: "CPRA DSAR Latency",
    regulation: "CPRA",
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    preview: "Response times exceed SLA for deletion and correction requests.",
    messages: [
      {
        id: "m-3",
        role: "user",
        content: "Where are we exposed in CPRA DSAR response handling?",
        createdAt: nowIso
      }
    ]
  },
  {
    id: "hipaa-telemetry-exposure",
    title: "HIPAA Telemetry Exposure",
    regulation: "HIPAA",
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    preview: "Review PHI leakage risk in monitoring logs and third-party telemetry.",
    messages: [
      {
        id: "m-4",
        role: "user",
        content: "Assess HIPAA risk from observability tools in patient portals.",
        createdAt: nowIso
      }
    ]
  }
];

export function getCopilotSessionById(id: string) {
  return copilotSessions.find((session) => session.id === id);
}
