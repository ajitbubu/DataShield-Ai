export type SolutionType = "Persona" | "Industry";

export type Solution = {
  slug: string;
  title: string;
  type: SolutionType;
  summary: string;
  useCases: string[];
  recommendedProductSlugs: string[];
};

export const solutions: Solution[] = [
  {
    slug: "privacy-teams",
    title: "For Privacy Teams",
    type: "Persona",
    summary:
      "Centralize policy operations, rights workflows, and regulatory evidence in one operating layer.",
    useCases: [
      "Automate consent and preference lifecycle",
      "Run cross-jurisdiction compliance monitoring",
      "Coordinate legal and operational execution"
    ],
    recommendedProductSlugs: ["consent-management", "dsar-automation", "compliance-audit"]
  },
  {
    slug: "security-teams",
    title: "For Security Teams",
    type: "Persona",
    summary:
      "Reduce privacy-driven security risks through discovery, redaction, and hardened control enforcement.",
    useCases: [
      "Detect sensitive data exposure pathways",
      "Mask PII in logs and observability streams",
      "Align privacy controls with security posture"
    ],
    recommendedProductSlugs: ["data-discovery", "pii-redaction", "compliance-audit"]
  },
  {
    slug: "engineering-teams",
    title: "For Engineering Teams",
    type: "Persona",
    summary:
      "Embed policy-aware automation into the SDLC and production systems without slowing delivery.",
    useCases: [
      "Implement region-aware consent experiences",
      "Automate tracker and policy enforcement",
      "Connect data governance workflows into CI/CD"
    ],
    recommendedProductSlugs: ["cookie-governance", "consent-management", "data-discovery"]
  },
  {
    slug: "retail",
    title: "For Retail",
    type: "Industry",
    summary:
      "Improve customer trust and marketing efficiency with compliant personalization controls.",
    useCases: [
      "Manage omnichannel consent and preferences",
      "Govern ad-tech and analytics trackers",
      "Automate rights requests at seasonal scale"
    ],
    recommendedProductSlugs: ["consent-management", "cookie-governance", "dsar-automation"]
  },
  {
    slug: "healthcare",
    title: "For Healthcare",
    type: "Industry",
    summary:
      "Protect patient data and simplify evidence workflows for healthcare privacy and security obligations.",
    useCases: [
      "Discover PHI across fragmented systems",
      "Enforce least-privilege access and redaction",
      "Create audit-ready evidence packs"
    ],
    recommendedProductSlugs: ["data-discovery", "pii-redaction", "compliance-audit"]
  },
  {
    slug: "fintech",
    title: "For FinTech",
    type: "Industry",
    summary:
      "Operationalize privacy governance in high-growth financial platforms with automated controls.",
    useCases: [
      "Control data sharing and preference workflows",
      "Harden sensitive-data monitoring",
      "Streamline regulatory readiness"
    ],
    recommendedProductSlugs: ["consent-management", "pii-redaction", "compliance-audit"]
  }
];

export function getSolutionBySlug(slug: string) {
  return solutions.find((solution) => solution.slug === slug);
}
