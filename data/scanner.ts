export type CookieCategory = "Necessary" | "Functional" | "Analytics" | "Marketing";
export type CookieParty = "First Party" | "Third Party";
export type RiskLevel = "Low" | "Medium" | "High";

export type CookieRecord = {
  id: string;
  name: string;
  category: CookieCategory;
  aiConfidence: number;
  party: CookieParty;
  dataCollected: string;
  riskLevel: RiskLevel;
  preConsentFired: boolean;
  vendor: string;
};

export type ScanInsight = {
  id: string;
  text: string;
  confidence: number;
  recommendedAction: string;
};

export type ScriptFlowNode = {
  id: string;
  script: string;
  cookie: string;
  endpoint: string;
  preConsentFired: boolean;
  thirdPartyCall: boolean;
};

export type ScanResult = {
  scanId: string;
  domain: string;
  scannedAt: string;
  riskScore: number;
  cookies: CookieRecord[];
  violations: string[];
  shadowScripts: string[];
  vendors: string[];
  insights: ScanInsight[];
  riskTrend: number[];
  scriptFlows: ScriptFlowNode[];
};

export const scannerDomains = [
  "www.dataprivacyshield.com",
  "app.dataprivacyshield.com",
  "docs.dataprivacyshield.com"
];

const now = Date.now();

export const scanHistory: ScanResult[] = [
  {
    scanId: "scan-2026-02-28-001",
    domain: "www.dataprivacyshield.com",
    scannedAt: new Date(now - 1000 * 60 * 60 * 2).toISOString(),
    riskScore: 63,
    cookies: [
      {
        id: "cookie-1",
        name: "_ga",
        category: "Analytics",
        aiConfidence: 95,
        party: "Third Party",
        dataCollected: "Usage behavior, session metadata",
        riskLevel: "Medium",
        preConsentFired: true,
        vendor: "Google"
      },
      {
        id: "cookie-2",
        name: "_fbp",
        category: "Marketing",
        aiConfidence: 92,
        party: "Third Party",
        dataCollected: "Ad interaction and click attribution",
        riskLevel: "High",
        preConsentFired: true,
        vendor: "Meta"
      },
      {
        id: "cookie-3",
        name: "session_id",
        category: "Necessary",
        aiConfidence: 96,
        party: "First Party",
        dataCollected: "Authenticated session token",
        riskLevel: "Low",
        preConsentFired: false,
        vendor: "DataPrivacy Shield"
      },
      {
        id: "cookie-4",
        name: "heatmap_v1",
        category: "Functional",
        aiConfidence: 71,
        party: "Third Party",
        dataCollected: "Interaction heatmap coordinates",
        riskLevel: "Medium",
        preConsentFired: false,
        vendor: "UXIntel"
      },
      {
        id: "cookie-5",
        name: "mk_lead_sync",
        category: "Marketing",
        aiConfidence: 77,
        party: "Third Party",
        dataCollected: "Lead funnel correlation IDs",
        riskLevel: "High",
        preConsentFired: true,
        vendor: "MarTechX"
      },
      {
        id: "cookie-6",
        name: "pref_locale",
        category: "Functional",
        aiConfidence: 90,
        party: "First Party",
        dataCollected: "Language preference",
        riskLevel: "Low",
        preConsentFired: false,
        vendor: "DataPrivacy Shield"
      }
    ],
    violations: [
      "3 marketing scripts firing before consent.",
      "2 cookies collecting location without explicit disclosure."
    ],
    shadowScripts: ["tag-manager.bootstrap.js", "pixel-router.js", "remarketing-loader.js"],
    vendors: ["Google", "Meta", "UXIntel", "MarTechX"],
    insights: [
      {
        id: "insight-1",
        text: "3 marketing scripts firing before consent.",
        confidence: 94,
        recommendedAction: "Block high-risk marketing tags until explicit opt-in is received."
      },
      {
        id: "insight-2",
        text: "Vendor MarTechX changed behavior since last scan.",
        confidence: 88,
        recommendedAction: "Flag vendor for legal review and compare script payload diff."
      },
      {
        id: "insight-3",
        text: "Google Analytics is not anonymizing IP by default on two pages.",
        confidence: 91,
        recommendedAction: "Enable IP anonymization and update analytics policy template."
      }
    ],
    riskTrend: [49, 52, 48, 55, 58, 61, 63],
    scriptFlows: [
      {
        id: "flow-1",
        script: "tag-manager.bootstrap.js",
        cookie: "_fbp",
        endpoint: "https://connect.facebook.net",
        preConsentFired: true,
        thirdPartyCall: true
      },
      {
        id: "flow-2",
        script: "ga-loader.js",
        cookie: "_ga",
        endpoint: "https://www.google-analytics.com",
        preConsentFired: true,
        thirdPartyCall: true
      },
      {
        id: "flow-3",
        script: "auth-session.js",
        cookie: "session_id",
        endpoint: "https://www.dataprivacyshield.com/api/session",
        preConsentFired: false,
        thirdPartyCall: false
      }
    ]
  },
  {
    scanId: "scan-2026-02-27-002",
    domain: "app.dataprivacyshield.com",
    scannedAt: new Date(now - 1000 * 60 * 60 * 19).toISOString(),
    riskScore: 44,
    cookies: [
      {
        id: "cookie-7",
        name: "session_token",
        category: "Necessary",
        aiConfidence: 94,
        party: "First Party",
        dataCollected: "Session authentication token",
        riskLevel: "Low",
        preConsentFired: false,
        vendor: "DataPrivacy Shield"
      },
      {
        id: "cookie-8",
        name: "_ga",
        category: "Analytics",
        aiConfidence: 93,
        party: "Third Party",
        dataCollected: "Aggregated product analytics",
        riskLevel: "Medium",
        preConsentFired: false,
        vendor: "Google"
      }
    ],
    violations: ["1 analytics cookie missing explicit retention notice disclosure."],
    shadowScripts: ["ga-loader.js"],
    vendors: ["Google"],
    insights: [
      {
        id: "insight-4",
        text: "Analytics consent compliance improved 12% over previous scan.",
        confidence: 86,
        recommendedAction: "Maintain release gating for analytics tags."
      }
    ],
    riskTrend: [51, 49, 48, 46, 45, 44],
    scriptFlows: [
      {
        id: "flow-4",
        script: "ga-loader.js",
        cookie: "_ga",
        endpoint: "https://www.google-analytics.com",
        preConsentFired: false,
        thirdPartyCall: true
      }
    ]
  },
  {
    scanId: "scan-2026-02-25-003",
    domain: "docs.dataprivacyshield.com",
    scannedAt: new Date(now - 1000 * 60 * 60 * 53).toISOString(),
    riskScore: 29,
    cookies: [
      {
        id: "cookie-9",
        name: "session_docs",
        category: "Necessary",
        aiConfidence: 95,
        party: "First Party",
        dataCollected: "Session continuity",
        riskLevel: "Low",
        preConsentFired: false,
        vendor: "DataPrivacy Shield"
      }
    ],
    violations: [],
    shadowScripts: [],
    vendors: ["DataPrivacy Shield"],
    insights: [
      {
        id: "insight-5",
        text: "No high-risk trackers detected in documentation environment.",
        confidence: 90,
        recommendedAction: "Continue baseline scan cadence."
      }
    ],
    riskTrend: [35, 34, 33, 31, 29],
    scriptFlows: [
      {
        id: "flow-5",
        script: "docs-session.js",
        cookie: "session_docs",
        endpoint: "https://docs.dataprivacyshield.com/api/session",
        preConsentFired: false,
        thirdPartyCall: false
      }
    ]
  }
];

export function getScanById(scanId: string) {
  return scanHistory.find((scan) => scan.scanId === scanId);
}
