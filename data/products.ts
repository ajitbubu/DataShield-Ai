export type ProductCategory =
  | "Consent"
  | "Discovery"
  | "Governance"
  | "DSAR"
  | "Security"
  | "AI";

export type Product = {
  slug: string;
  title: string;
  category: ProductCategory;
  summary: string;
  roi: string;
  features: string[];
  benefits: string[];
  howItWorks: string[];
  integrations: string[];
  regulations: string[];
  faq: { question: string; answer: string }[];
};

export const products: Product[] = [
  {
    slug: "consent-management",
    title: "Consent Management",
    category: "Consent",
    summary:
      "Capture, store, and enforce granular user preferences across web and mobile touchpoints.",
    roi: "Lower consent handling effort by up to 40% with automated preference orchestration.",
    features: [
      "Region-aware consent templates",
      "Preference center with self-service controls",
      "Consent event versioning and history"
    ],
    benefits: [
      "Improve opt-in trust with transparent notices",
      "Reduce manual handoffs between legal and engineering",
      "Activate consistent policy across channels"
    ],
    howItWorks: [
      "Deploy consent banner and preference SDK",
      "Map purposes to systems and data flows",
      "Automatically enforce user choices in downstream tools",
      "Track and export evidence for audits"
    ],
    integrations: ["Snowflake", "Segment", "Salesforce", "OneLogin", "BigQuery"],
    regulations: ["gdpr", "cpra-ccpa", "dpdp", "ctdpa", "vcdpa"],
    faq: [
      {
        question: "Can consent be synced across devices?",
        answer:
          "Yes. Identity resolution rules can synchronize preferences across known user profiles and channels."
      },
      {
        question: "Does it support geo-targeted banners?",
        answer:
          "Yes. You can apply location-aware templates with policy fallback for unknown regions."
      }
    ]
  },
  {
    slug: "cookie-governance",
    title: "Cookie Governance",
    category: "Governance",
    summary:
      "Scan websites, classify trackers, and enforce policy-based cookie controls continuously.",
    roi: "Reduce unknown trackers by up to 70% within one quarter.",
    features: [
      "Automated cookie discovery and classification",
      "Script blocking and conditional loading",
      "Policy alerts for drift and new trackers"
    ],
    benefits: [
      "Faster website compliance reviews",
      "Lower legal risk from unmanaged tags",
      "Clear evidence of tracker governance"
    ],
    howItWorks: [
      "Crawl web properties on a schedule",
      "Classify cookies and scripts by purpose",
      "Apply policy and block non-compliant tags",
      "Generate compliance reports with change history"
    ],
    integrations: ["Google Tag Manager", "Adobe Launch", "Cloudflare", "Datadog"],
    regulations: ["gdpr", "cpra-ccpa", "cpa", "ctdpa"],
    faq: [
      {
        question: "Can we monitor multiple domains?",
        answer: "Yes, multi-domain governance and segmented reporting are supported."
      },
      {
        question: "Does it detect newly added scripts?",
        answer:
          "Yes. Scheduled scans and policy alerts identify newly introduced trackers and page-level changes."
      }
    ]
  },
  {
    slug: "data-discovery",
    title: "Data Discovery",
    category: "Discovery",
    summary:
      "Discover sensitive data across SaaS, data lakes, and databases with AI-assisted classification.",
    roi: "Cut sensitive-data inventory effort by up to 60% using auto-labeling workflows.",
    features: [
      "Connector-based data source scanning",
      "PII and sensitive-class detection",
      "Data lineage and ownership mapping"
    ],
    benefits: [
      "Build accurate records of processing",
      "Prioritize remediation by risk",
      "Accelerate readiness for audits"
    ],
    howItWorks: [
      "Connect data repositories",
      "Run discovery scans with classifier packs",
      "Review confidence scores and ownership",
      "Push classifications to governance workflows"
    ],
    integrations: ["AWS S3", "Azure SQL", "Google Cloud Storage", "PostgreSQL", "MongoDB"],
    regulations: ["gdpr", "hipaa", "glba", "dpdp"],
    faq: [
      {
        question: "Can we tune classifiers for our domain?",
        answer: "Yes. Custom patterns and dictionaries can be configured for internal schemas."
      },
      {
        question: "Is scan execution agentless?",
        answer:
          "Most cloud connectors are agentless; on-prem sources can use lightweight secure gateways."
      }
    ]
  },
  {
    slug: "pii-redaction",
    title: "PII Redaction",
    category: "Security",
    summary:
      "Automatically redact personal data in logs, tickets, and analytics streams before exposure.",
    roi: "Reduce sensitive-data leakage incidents and triage costs with automated masking controls.",
    features: [
      "Streaming and batch redaction pipelines",
      "Tokenization and reversible vaulting options",
      "Policy-based masking by role and system"
    ],
    benefits: [
      "Protect internal observability environments",
      "Enable safer cross-team collaboration",
      "Support least-privilege data access"
    ],
    howItWorks: [
      "Define protected fields and patterns",
      "Apply redaction policy in transit",
      "Log transformations and access decisions",
      "Continuously monitor leakage indicators"
    ],
    integrations: ["Splunk", "Sentry", "ServiceNow", "Elastic", "Kafka"],
    regulations: ["gdpr", "hipaa", "glba", "cpra-ccpa"],
    faq: [
      {
        question: "Can we preserve analytics utility after masking?",
        answer:
          "Yes. You can apply format-preserving masking and tokenization to retain operational signals."
      },
      {
        question: "How is redaction policy audited?",
        answer:
          "Each transformation is logged with policy version, timestamp, and service identity for audit review."
      }
    ]
  },
  {
    slug: "dsar-automation",
    title: "DSAR Automation",
    category: "DSAR",
    summary:
      "Orchestrate intake, identity verification, data retrieval, and response workflows for data subject rights.",
    roi: "Shorten average request response cycle time by up to 50%.",
    features: [
      "Intake portal and workflow routing",
      "Identity verification checkpoints",
      "Deadline tracking and SLA monitoring"
    ],
    benefits: [
      "Meet rights request deadlines with confidence",
      "Reduce legal and ops workload",
      "Maintain full response evidence"
    ],
    howItWorks: [
      "Collect request details from portal",
      "Run verification and scope checks",
      "Query connected systems for records",
      "Package responses and archive evidence"
    ],
    integrations: ["Zendesk", "Jira", "Workday", "Salesforce", "Box"],
    regulations: ["gdpr", "cpra-ccpa", "cpa", "ctdpa", "vcdpa", "dpdp"],
    faq: [
      {
        question: "Can we configure workflows by request type?",
        answer:
          "Yes. Separate workflows are supported for access, deletion, correction, and opt-out requests."
      },
      {
        question: "How are SLA breaches handled?",
        answer: "Automated alerts and escalations can notify legal and operational owners."
      }
    ]
  },
  {
    slug: "compliance-audit",
    title: "Compliance Audit Hub",
    category: "AI",
    summary:
      "AI-powered compliance copilot with evidence mapping, control guidance, and audit-ready reporting.",
    roi: "Reduce audit preparation hours by centralizing controls, tests, and regulatory mappings.",
    features: [
      "Control library mapped to regulations",
      "AI assistant for implementation guidance",
      "Immutable evidence timeline and export"
    ],
    benefits: [
      "Improve audit readiness and control visibility",
      "Accelerate policy interpretation for teams",
      "Create a single source of compliance truth"
    ],
    howItWorks: [
      "Ingest policies, controls, and evidence artifacts",
      "Map controls to regulatory obligations",
      "Use copilot for gap analysis and guidance",
      "Export auditor-ready evidence packs"
    ],
    integrations: ["Confluence", "Notion", "GitHub", "Okta", "Slack"],
    regulations: ["gdpr", "cpra-ccpa", "hipaa", "glba", "dpdp", "cpa"],
    faq: [
      {
        question: "Is legal advice provided by the AI assistant?",
        answer:
          "No. The copilot provides implementation guidance and references controls; legal interpretation remains with your counsel."
      },
      {
        question: "Can evidence be shared externally?",
        answer: "Yes. You can export scoped evidence reports for internal and external stakeholders."
      }
    ]
  }
];

export const productCategories: ProductCategory[] = [
  "Consent",
  "Discovery",
  "Governance",
  "DSAR",
  "Security",
  "AI"
];

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}
