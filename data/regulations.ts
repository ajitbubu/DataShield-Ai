export type RegulationRegion = "EU" | "US" | "India" | "Global";
export type RegulationCategory = "Comprehensive" | "Sectoral" | "State" | "Federal";

export type Regulation = {
  id: string;
  name: string;
  slug: string;
  region: RegulationRegion;
  category: RegulationCategory;
  effectiveYear: number;
  summary: string;
  keyRequirements: string[];
  consentRequirements: string[];
  cookieImplications: string[];
  dsarRequirements: string[];
  penalties: string;
  enforcementAuthority: string;
  relatedProducts: string[];
  tags: string[];
  lastUpdated: string;
  implementationChecklist: string[];
  relatedRegulationSlugs: string[];
  popularityScore: number;
};

export const regulationRegions: RegulationRegion[] = ["EU", "US", "India", "Global"];
export const regulationCategories: RegulationCategory[] = ["Comprehensive", "Sectoral", "State", "Federal"];

export const regulationCategorySlugMap: Record<RegulationCategory, string> = {
  Comprehensive: "comprehensive",
  Sectoral: "sectoral",
  State: "state",
  Federal: "federal"
};

export const regulations: Regulation[] = [
  {
    id: "reg-gdpr",
    name: "General Data Protection Regulation (GDPR)",
    slug: "gdpr",
    region: "EU",
    category: "Comprehensive",
    effectiveYear: 2018,
    summary:
      "GDPR is the European Union's comprehensive privacy law governing lawful processing, transparency, accountability, and rights for individuals in the EU/EEA.",
    keyRequirements: [
      "Identify and document a lawful basis before processing personal data",
      "Maintain Records of Processing Activities (RoPA) and clear retention schedules",
      "Implement privacy-by-design controls across systems and product releases",
      "Conduct DPIAs for high-risk processing and document mitigations",
      "Notify supervisory authorities and affected individuals after qualifying breaches"
    ],
    consentRequirements: [
      "Consent must be freely given, specific, informed, and unambiguous",
      "Pre-ticked boxes and bundled consent language are not acceptable",
      "Withdrawal must be as simple as granting consent",
      "Controllers should retain demonstrable proof of consent state and history"
    ],
    cookieImplications: [
      "Non-essential cookies generally require prior opt-in consent in EU jurisdictions",
      "Cookie notices must clearly describe purpose categories and vendors",
      "Preference changes must be propagated to downstream tag execution"
    ],
    dsarRequirements: [
      "Support rights for access, deletion, correction, restriction, portability, and objection",
      "Verify requester identity before disclosure",
      "Respond within one month in most cases, with extension handling documented"
    ],
    penalties:
      "Administrative fines can reach up to EUR 20 million or 4% of annual global turnover, whichever is higher.",
    enforcementAuthority: "EU Supervisory Authorities coordinated through the EDPB",
    relatedProducts: ["consent-management", "dsar-automation", "compliance-audit"],
    tags: ["lawful-basis", "consent", "dsar", "cross-border", "dpo", "privacy-by-design"],
    lastUpdated: "2026-02-12",
    implementationChecklist: [
      "Map processing activities and legal bases across business units",
      "Deploy granular consent and preference controls in customer channels",
      "Automate DSAR intake, identity verification, and fulfillment SLAs",
      "Track policy and control changes in an audit-ready evidence ledger",
      "Run recurring DPIA workflows for high-risk use cases"
    ],
    relatedRegulationSlugs: ["cpra-ccpa", "dpdp", "cpa"],
    popularityScore: 100
  },
  {
    id: "reg-cpra",
    name: "California Privacy Rights Act (CPRA/CCPA)",
    slug: "cpra-ccpa",
    region: "US",
    category: "State",
    effectiveYear: 2023,
    summary:
      "CPRA expands California privacy rights and imposes operational obligations for notice, opt-out, sensitive data handling, and service provider governance.",
    keyRequirements: [
      "Provide notice at collection and maintain transparent privacy disclosures",
      "Enable rights to know, delete, and correct personal information",
      "Support limitation requests for sensitive personal information",
      "Establish contracts and oversight for service providers and contractors"
    ],
    consentRequirements: [
      "Honor opt-out preferences for sale/sharing of personal information",
      "Track and enforce Do Not Sell/Share choices consistently",
      "Apply special handling for minors and sensitive data contexts"
    ],
    cookieImplications: [
      "Ad-tech and cross-context behavioral advertising cookies can trigger opt-out obligations",
      "Cookie controls should map to sale/share logic and signal propagation",
      "Maintain records proving suppression of disallowed trackers"
    ],
    dsarRequirements: [
      "Handle verified consumer requests for access, deletion, correction, and disclosure",
      "Support appeal/escalation paths where applicable",
      "Document response timelines, completion status, and rationale for denials"
    ],
    penalties:
      "Civil penalties may reach USD 2,500 per violation or USD 7,500 per intentional or children's-data violation.",
    enforcementAuthority: "California Privacy Protection Agency (CPPA) and California Attorney General",
    relatedProducts: ["consent-management", "cookie-governance", "dsar-automation"],
    tags: ["opt-out", "sale-share", "sensitive-data", "gpc", "consumer-rights"],
    lastUpdated: "2026-01-22",
    implementationChecklist: [
      "Update notices for collection, sharing, and retention disclosures",
      "Implement opt-out enforcement for ad-tech and sharing workflows",
      "Operationalize DSAR workflows with evidence and SLA tracking",
      "Validate service-provider contract clauses and data flow restrictions",
      "Monitor global privacy control and preference synchronization"
    ],
    relatedRegulationSlugs: ["gdpr", "cpa", "glba"],
    popularityScore: 92
  },
  {
    id: "reg-dpdp",
    name: "India Digital Personal Data Protection Act (DPDP)",
    slug: "dpdp",
    region: "India",
    category: "Comprehensive",
    effectiveYear: 2023,
    summary:
      "India's DPDP Act defines obligations for data fiduciaries around notice, consent, purpose limitation, data principal rights, and grievance handling.",
    keyRequirements: [
      "Issue clear notices describing purpose and processing scope",
      "Process personal data for lawful purposes with valid consent or recognized grounds",
      "Implement safeguards to protect personal data and prevent breaches",
      "Establish grievance redressal mechanisms and responsive operations"
    ],
    consentRequirements: [
      "Consent should be specific to declared purposes and accessible in clear language",
      "Withdrawal mechanisms should be straightforward for data principals",
      "Consent state changes should be enforceable across downstream systems"
    ],
    cookieImplications: [
      "Tracking mechanisms should align with disclosed purposes and minimization principles",
      "Avoid collecting excess personal data through analytics defaults",
      "Maintain auditable proof of consent-linked tracking decisions"
    ],
    dsarRequirements: [
      "Support correction, erasure, and grievance rights channels",
      "Document request handling and communication timelines",
      "Retain fulfillment evidence for internal and regulatory review"
    ],
    penalties:
      "Financial penalties can be significant and vary by breach type under Board adjudication.",
    enforcementAuthority: "Data Protection Board of India",
    relatedProducts: ["consent-management", "data-discovery", "compliance-audit"],
    tags: ["consent", "purpose-limitation", "grievance", "india", "data-fiduciary"],
    lastUpdated: "2026-02-05",
    implementationChecklist: [
      "Standardize purpose registry and multilingual notice templates",
      "Enable consent collection and withdrawal orchestration",
      "Deploy grievance and rights workflows with audit traceability",
      "Map personal data across systems and retention boundaries",
      "Establish board-ready breach and response evidence trails"
    ],
    relatedRegulationSlugs: ["gdpr", "cpra-ccpa"],
    popularityScore: 84
  },
  {
    id: "reg-cpa",
    name: "Colorado Privacy Act (CPA)",
    slug: "cpa",
    region: "US",
    category: "State",
    effectiveYear: 2023,
    summary:
      "The Colorado Privacy Act requires transparent processing, consumer rights handling, and duty-of-care controls for targeted advertising and profiling.",
    keyRequirements: [
      "Provide clear privacy notices and rights submission channels",
      "Run data protection assessments for high-risk processing",
      "Enable opt-out controls for targeted advertising and profiling",
      "Apply data minimization and purpose limitation in processing workflows"
    ],
    consentRequirements: [
      "Collect consent for processing sensitive personal data where required",
      "Retain records showing how preferences were captured and enforced",
      "Ensure revocation is honored across integrated systems"
    ],
    cookieImplications: [
      "Advertising and profiling cookies should respect opt-out signals",
      "Cookie governance should maintain category-level enforcement evidence",
      "Continuous scans should detect newly introduced trackers"
    ],
    dsarRequirements: [
      "Support access, correction, deletion, and portability requests",
      "Provide an appeal path for denied requests",
      "Track DSAR SLAs and workload trends for compliance operations"
    ],
    penalties:
      "Enforcement may include civil penalties under Colorado consumer protection frameworks.",
    enforcementAuthority: "Colorado Attorney General and District Attorneys",
    relatedProducts: ["cookie-governance", "dsar-automation", "compliance-audit"],
    tags: ["state-law", "opt-out", "profiling", "appeals", "risk-assessment"],
    lastUpdated: "2025-12-18",
    implementationChecklist: [
      "Map targeted advertising and profiling data paths",
      "Deploy opt-out and preference enforcement in web and app channels",
      "Configure appeal workflow and rights case operations",
      "Run periodic protection assessments with evidence capture",
      "Validate compliance controls through continuous monitoring"
    ],
    relatedRegulationSlugs: ["cpra-ccpa", "gdpr"],
    popularityScore: 73
  },
  {
    id: "reg-hipaa",
    name: "Health Insurance Portability and Accountability Act (HIPAA)",
    slug: "hipaa",
    region: "US",
    category: "Federal",
    effectiveYear: 1996,
    summary:
      "HIPAA establishes privacy and security standards for protected health information (PHI), including safeguards, access controls, and breach handling.",
    keyRequirements: [
      "Apply administrative, technical, and physical safeguards for PHI",
      "Enforce minimum necessary access principles",
      "Maintain audit controls, risk analysis, and workforce training",
      "Implement breach notification processes for reportable incidents"
    ],
    consentRequirements: [
      "Use and disclosure authorizations must align with permitted purpose rules",
      "Patient preference and restriction requests should be tracked accurately",
      "Consent/authorization artifacts should be retained for audits"
    ],
    cookieImplications: [
      "Patient-facing properties should prevent PHI exposure through trackers",
      "Third-party scripts require strict governance and access controls",
      "Session replay and analytics tools must be evaluated for PHI risk"
    ],
    dsarRequirements: [
      "Support patient access and amendment workflows where applicable",
      "Authenticate requesters before PHI disclosure",
      "Document disclosure logs and response outcomes"
    ],
    penalties:
      "Civil penalties are tiered and can reach substantial annual caps depending on violation category and culpability.",
    enforcementAuthority: "U.S. Department of Health and Human Services (HHS OCR)",
    relatedProducts: ["data-discovery", "pii-redaction", "compliance-audit"],
    tags: ["phi", "healthcare", "minimum-necessary", "breach-notification", "security-rule"],
    lastUpdated: "2026-02-02",
    implementationChecklist: [
      "Inventory PHI repositories and linked data flows",
      "Implement least-privilege and role-based PHI access",
      "Apply redaction/tokenization to operational logs",
      "Operationalize breach response and notification evidence",
      "Maintain recurring safeguard assessments and control testing"
    ],
    relatedRegulationSlugs: ["glba", "gdpr"],
    popularityScore: 88
  },
  {
    id: "reg-glba",
    name: "Gramm-Leach-Bliley Act (GLBA)",
    slug: "glba",
    region: "US",
    category: "Federal",
    effectiveYear: 1999,
    summary:
      "GLBA requires financial institutions to protect nonpublic personal information through privacy notices, safeguards programs, and data-sharing controls.",
    keyRequirements: [
      "Issue required privacy notices describing information sharing",
      "Maintain a written safeguards program for customer information",
      "Oversee service providers with security and confidentiality obligations",
      "Monitor, test, and update controls based on risk changes"
    ],
    consentRequirements: [
      "Customer sharing preferences and opt-out choices must be recorded",
      "Preference updates must be enforceable in marketing and partner data flows",
      "Audit trails should show when and how choices were applied"
    ],
    cookieImplications: [
      "Financial data should not leak through analytics or ad-tech trackers",
      "Cookie classifications should align to disclosed sharing purposes",
      "Control validation should cover web, mobile, and embedded experiences"
    ],
    dsarRequirements: [
      "Support authenticated customer requests for data transparency workflows",
      "Document disclosures and exceptions",
      "Track SLA adherence for privacy operations governance"
    ],
    penalties:
      "Regulators may impose monetary penalties and corrective actions for safeguards and privacy notice violations.",
    enforcementAuthority: "FTC and federal banking regulators",
    relatedProducts: ["consent-management", "pii-redaction", "compliance-audit"],
    tags: ["financial-data", "safeguards", "privacy-notice", "service-providers", "federal"],
    lastUpdated: "2025-11-30",
    implementationChecklist: [
      "Review and standardize privacy notice delivery workflows",
      "Map customer information sharing across third parties",
      "Implement safeguards controls and monitoring evidence",
      "Apply tokenization/redaction in operational systems",
      "Run recurring vendor risk and control validation reviews"
    ],
    relatedRegulationSlugs: ["hipaa", "cpra-ccpa"],
    popularityScore: 70
  }
];

export function getRegulationBySlug(slug: string) {
  return regulations.find((regulation) => regulation.slug === slug);
}

export function getRegulationCategoryFromSlug(slug: string): RegulationCategory | null {
  const normalized = slug.toLowerCase();
  const entry = Object.entries(regulationCategorySlugMap).find(([, value]) => value === normalized);
  return (entry?.[0] as RegulationCategory) ?? null;
}

export function getRegulationCategorySlug(category: RegulationCategory) {
  return regulationCategorySlugMap[category];
}

export function getRegulationsByCategory(category: RegulationCategory) {
  return regulations.filter((regulation) => regulation.category === category);
}

export function getRelatedRegulations(regulation: Regulation, limit = 3) {
  const explicit = regulation.relatedRegulationSlugs
    .map((slug) => regulations.find((candidate) => candidate.slug === slug))
    .filter((candidate): candidate is Regulation => Boolean(candidate));

  if (explicit.length >= limit) {
    return explicit.slice(0, limit);
  }

  const fallback = regulations
    .filter((candidate) => candidate.slug !== regulation.slug)
    .map((candidate) => {
      const sharedTags = candidate.tags.filter((tag) => regulation.tags.includes(tag)).length;
      const regionBoost = candidate.region === regulation.region ? 1 : 0;
      return { candidate, score: sharedTags + regionBoost };
    })
    .sort((a, b) => b.score - a.score)
    .map((item) => item.candidate);

  const combined = [...explicit, ...fallback].filter(
    (candidate, index, arr) => arr.findIndex((item) => item.slug === candidate.slug) === index
  );

  return combined.slice(0, limit);
}

export function getRecentlyUpdatedRegulations(limit = 3) {
  return [...regulations]
    .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
    .slice(0, limit);
}

export function getPopularRegulations(limit = 3) {
  return [...regulations].sort((a, b) => b.popularityScore - a.popularityScore).slice(0, limit);
}
