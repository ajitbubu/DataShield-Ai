import { CopilotRegulation, CopilotResponse, CopilotRisk, RiskLevel } from "@/data/copilot";

function scoreFromRisks(risks: CopilotRisk[]) {
  const penalties = risks.reduce((sum, risk) => {
    if (risk.level === "High") return sum + 18;
    if (risk.level === "Medium") return sum + 10;
    return sum + 4;
  }, 0);

  return Math.max(32, 100 - penalties);
}

function confidenceFromQuestion(question: string, base: number) {
  const signal = Math.min(10, Math.floor(question.trim().length / 18));
  return Math.min(96, base + signal);
}

type TemplatePayload = {
  summary: string;
  risks: CopilotRisk[];
  recommendations: string[];
  legalReferences: string[];
  nextActions: string[];
  relatedProducts: string[];
  querySnippet: string;
  baseConfidence: number;
};

function byKeyword(question: string, regulation: CopilotRegulation): TemplatePayload {
  const q = question.toLowerCase();

  if (q.includes("cookie") || q.includes("tracker") || q.includes("banner")) {
    return {
      summary:
        "Cookie governance controls are partially mature. Consent capture exists, but blocker enforcement and evidence consistency are likely incomplete.",
      risks: [
        {
          title: "Unclassified third-party trackers",
          level: "High",
          detail: "Scripts may load before consent in edge deployment scenarios."
        },
        {
          title: "Weak regional policy routing",
          level: "Medium",
          detail: "Rulesets may not fully adapt to jurisdiction-specific requirements."
        }
      ],
      recommendations: [
        "Run continuous tracker discovery with release-gating alerts",
        "Enforce tag firing rules by consent state and region",
        "Capture immutable logs for each policy evaluation"
      ],
      legalReferences: [`${regulation} consent obligations`, "Cookie/transparency notice requirements"],
      nextActions: [
        "Perform 7-day tracker variance analysis",
        "Review banner content and default choices",
        "Generate legal evidence snapshot"
      ],
      relatedProducts: ["cookie-governance", "consent-management", "compliance-audit"],
      querySnippet:
        "SELECT page_url, script_vendor, blocked_by_policy FROM tracker_inventory WHERE status = 'new' ORDER BY discovered_at DESC;",
      baseConfidence: 82
    };
  }

  if (q.includes("dsar") || q.includes("deletion") || q.includes("access request") || q.includes("rights")) {
    return {
      summary:
        "DSAR execution appears operational but bottlenecked at identity verification and system-of-record retrieval steps.",
      risks: [
        {
          title: "SLA breach risk",
          level: "High",
          detail: "Manual handoffs can delay fulfillment near statutory deadlines."
        },
        {
          title: "Incomplete evidence trails",
          level: "Medium",
          detail: "Case closure artifacts are not consistently attached to responses."
        }
      ],
      recommendations: [
        "Automate request triage and identity validation workflows",
        "Standardize case evidence payloads before closure",
        "Escalate aging cases with role-based notifications"
      ],
      legalReferences: ["Data subject rights timelines", "Verification and response record obligations"],
      nextActions: [
        "Instrument DSAR cycle-time dashboard",
        "Set policy for exception handling documentation",
        "Run monthly fulfillment quality review"
      ],
      relatedProducts: ["dsar-automation", "compliance-audit", "data-discovery"],
      querySnippet:
        "SELECT request_type, avg(response_time_days), overdue_count FROM dsar_cases GROUP BY request_type;",
      baseConfidence: 84
    };
  }

  if (q.includes("consent") || q.includes("preference") || q.includes("opt-out") || q.includes("opt out")) {
    return {
      summary:
        "Consent lifecycle controls are in place, but preference propagation and change-verification controls need stronger operational guardrails.",
      risks: [
        {
          title: "Preference desynchronization",
          level: "High",
          detail: "Different channels may process stale consent state during identity merges."
        },
        {
          title: "Policy drift",
          level: "Medium",
          detail: "Regional policy revisions are not fully version-controlled across systems."
        }
      ],
      recommendations: [
        "Centralize preference state with deterministic conflict resolution",
        "Automate policy version rollouts across destination systems",
        "Add consent state monitoring and anomaly alerts"
      ],
      legalReferences: ["Consent validity criteria", "Withdrawal and opt-out enforceability"],
      nextActions: [
        "Audit channel-level preference sync latency",
        "Validate rollback behavior for policy updates",
        "Publish monthly consent compliance report"
      ],
      relatedProducts: ["consent-management", "compliance-audit", "cookie-governance"],
      querySnippet:
        "SELECT user_id, source_channel, consent_state, updated_at FROM preference_state WHERE updated_at > NOW() - INTERVAL '7 days';",
      baseConfidence: 81
    };
  }

  if (q.includes("policy") || q.includes("hipaa") || q.includes("phi") || q.includes("security")) {
    return {
      summary:
        "Policy and technical control mapping is moderately mature. Primary exposure sits in log minimization, role scoping, and periodic control attestation.",
      risks: [
        {
          title: "Sensitive telemetry exposure",
          level: "High",
          detail: "Operational logs may contain regulated identifiers without masking policies."
        },
        {
          title: "Over-privileged access",
          level: "Medium",
          detail: "Access grants are broader than least-privilege norms in some workflows."
        }
      ],
      recommendations: [
        "Apply field-level redaction to logs and ticketing systems",
        "Review RBAC grants and remove dormant access",
        "Automate monthly control attestation workflows"
      ],
      legalReferences: ["Security safeguard requirements", "Access accountability principles"],
      nextActions: [
        "Run PHI/PII exposure scan in telemetry platforms",
        "Publish least-privilege remediation backlog",
        "Package control test evidence for auditors"
      ],
      relatedProducts: ["pii-redaction", "data-discovery", "compliance-audit"],
      querySnippet:
        "SELECT service, field_name, exposure_count FROM telemetry_exposure WHERE sensitivity IN ('PHI','PII') ORDER BY exposure_count DESC;",
      baseConfidence: 79
    };
  }

  return {
    summary:
      "Initial compliance posture appears stable, with opportunities to strengthen control traceability and cross-functional execution consistency.",
    risks: [
      {
        title: "Control ownership ambiguity",
        level: "Medium",
        detail: "Legal, privacy, and engineering roles are not consistently mapped to obligations."
      },
      {
        title: "Evidence fragmentation",
        level: "Medium",
        detail: "Audit artifacts remain distributed across disconnected systems."
      }
    ],
    recommendations: [
      "Define regulation-to-control ownership matrix",
      "Consolidate evidence into a centralized compliance ledger",
      "Schedule recurring AI-assisted gap analysis reviews"
    ],
    legalReferences: ["Accountability and governance obligations", "Documentation and audit-readiness expectations"],
    nextActions: [
      "Create governance RACI by regulation",
      "Set quarterly compliance readiness checkpoints",
      "Prioritize high-risk control automation"
    ],
    relatedProducts: ["compliance-audit", "consent-management", "data-discovery"],
    querySnippet:
      "SELECT control_id, owner, evidence_status FROM control_registry WHERE evidence_status != 'current' ORDER BY owner;",
    baseConfidence: 76
  };
}

export function generateMockCopilotResponse(question: string, regulation: CopilotRegulation): CopilotResponse {
  const template = byKeyword(question, regulation);

  return {
    summary: template.summary,
    risks: template.risks,
    recommendations: template.recommendations,
    relatedProducts: template.relatedProducts,
    confidence: confidenceFromQuestion(question, template.baseConfidence),
    legalReferences: template.legalReferences,
    nextActions: template.nextActions,
    complianceScore: scoreFromRisks(template.risks),
    querySnippet: template.querySnippet
  };
}

export function highestRiskLevel(risks: CopilotRisk[]): RiskLevel {
  if (risks.some((risk) => risk.level === "High")) return "High";
  if (risks.some((risk) => risk.level === "Medium")) return "Medium";
  return "Low";
}
