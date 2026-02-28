import { CookieCategory, CookieParty, CookieRecord, RiskLevel, ScanInsight, ScanResult, ScriptFlowNode } from "@/data/scanner";

const dataByCategory: Record<CookieCategory, string> = {
  Necessary: "Session integrity and security tokens",
  Functional: "Preference settings and UX state",
  Analytics: "Behavior analytics and performance telemetry",
  Marketing: "Attribution IDs and ad interaction signals"
};

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function classifyCookieName(cookieName: string): CookieCategory {
  const name = cookieName.toLowerCase();

  if (name.includes("_ga")) return "Analytics";
  if (name.includes("_fb")) return "Marketing";
  if (name.includes("session")) return "Necessary";
  if (name.includes("utm") || name.includes("ad")) return "Marketing";
  if (name.includes("pref") || name.includes("lang")) return "Functional";

  return "Functional";
}

function inferRiskLevel(cookie: Omit<CookieRecord, "riskLevel">): RiskLevel {
  if (cookie.preConsentFired) return "High";
  if (cookie.party === "Third Party" && cookie.category === "Marketing") return "High";
  if (cookie.party === "Third Party" || cookie.category === "Analytics") return "Medium";
  return "Low";
}

function generateCookies(domain: string): CookieRecord[] {
  const vendorPool = ["Google", "Meta", "Hotjar", "Segment", "DataPrivacy Shield", "AdStack", "PixelCloud"];
  const cookiePool = [
    "_ga",
    "_gid",
    "_fbp",
    "session_id",
    "session_token",
    "pref_locale",
    "mk_pixel",
    "utm_bridge",
    "feature_toggle",
    "analytics_snap"
  ];

  const total = randomBetween(8, 18);

  return Array.from({ length: total }).map((_, index) => {
    const name = cookiePool[randomBetween(0, cookiePool.length - 1)] + (Math.random() > 0.6 ? `_${index}` : "");
    const category = classifyCookieName(name);

    const party: CookieParty = Math.random() > 0.45 ? "Third Party" : "First Party";
    const preConsentFired = category !== "Necessary" ? Math.random() > 0.68 : false;

    const provisional: Omit<CookieRecord, "riskLevel"> = {
      id: `cookie-${Date.now()}-${index}`,
      name,
      category,
      aiConfidence: randomBetween(71, 98),
      party,
      dataCollected: dataByCategory[category],
      preConsentFired,
      vendor: party === "First Party" ? "DataPrivacy Shield" : vendorPool[randomBetween(0, vendorPool.length - 1)]
    };

    return {
      ...provisional,
      riskLevel: inferRiskLevel(provisional)
    };
  });
}

function calculateRiskScore(cookies: CookieRecord[]) {
  let score = 18;

  for (const cookie of cookies) {
    if (cookie.riskLevel === "High") score += 8;
    if (cookie.preConsentFired) score += 10;
    if (cookie.party === "Third Party" && cookie.category === "Marketing") score += 7;
  }

  return Math.max(5, Math.min(100, Math.round(score / 1.8)));
}

function buildInsights(cookies: CookieRecord[], violations: string[]): ScanInsight[] {
  const marketingPreConsent = cookies.filter(
    (cookie) => cookie.category === "Marketing" && cookie.preConsentFired
  ).length;

  const locationLike = cookies.filter((cookie) =>
    cookie.dataCollected.toLowerCase().includes("location") || cookie.name.toLowerCase().includes("utm")
  ).length;

  const insights: ScanInsight[] = [];

  if (marketingPreConsent > 0) {
    insights.push({
      id: "insight-marketing-preconsent",
      text: `${marketingPreConsent} marketing scripts firing before consent.`,
      confidence: randomBetween(86, 96),
      recommendedAction: "Block marketing scripts at tag manager bootstrap until consent state is granted."
    });
  }

  if (locationLike > 0) {
    insights.push({
      id: "insight-disclosure-gap",
      text: `${locationLike} cookies may collect location-adjacent signals without explicit disclosure language.`,
      confidence: randomBetween(80, 92),
      recommendedAction: "Align cookie notice taxonomy with collected data categories and vendor endpoints."
    });
  }

  insights.push({
    id: "insight-vendor-change",
    text: "Vendor behavior changed since last scan for at least one third-party endpoint.",
    confidence: randomBetween(78, 90),
    recommendedAction: "Trigger legal/security review and run script payload diff workflow."
  });

  if (insights.length === 0 && violations.length === 0) {
    insights.push({
      id: "insight-stable",
      text: "No high-severity exposure detected in this scan window.",
      confidence: randomBetween(84, 94),
      recommendedAction: "Maintain continuous monitoring and weekly policy attestation."
    });
  }

  return insights.slice(0, 4);
}

function generateFlows(cookies: CookieRecord[]): ScriptFlowNode[] {
  return cookies.slice(0, 6).map((cookie, index) => ({
    id: `flow-${index}-${cookie.id}`,
    script: `${cookie.vendor.toLowerCase().replace(/\s+/g, "-")}-loader.js`,
    cookie: cookie.name,
    endpoint:
      cookie.party === "Third Party"
        ? `https://api.${cookie.vendor.toLowerCase().replace(/\s+/g, "")}.com/collect`
        : "https://app.dataprivacyshield.com/api/session",
    preConsentFired: cookie.preConsentFired,
    thirdPartyCall: cookie.party === "Third Party"
  }));
}

export function generateMockScan(domain: string): ScanResult {
  const cookies = generateCookies(domain);
  const riskScore = calculateRiskScore(cookies);

  const violations = cookies
    .filter((cookie) => cookie.preConsentFired)
    .slice(0, 4)
    .map((cookie) => `${cookie.name} fired pre-consent in ${cookie.category.toLowerCase()} category.`);

  const shadowScripts = cookies
    .filter((cookie) => cookie.preConsentFired)
    .slice(0, 5)
    .map((cookie) => `${cookie.vendor.toLowerCase().replace(/\s+/g, "-")}-bootstrap.js`);

  const vendors = Array.from(new Set(cookies.map((cookie) => cookie.vendor)));

  const riskTrend = Array.from({ length: 7 }).map((_, index) => {
    const jitter = randomBetween(-7, 6);
    return Math.max(8, Math.min(100, riskScore + jitter - (6 - index)));
  });

  const insights = buildInsights(cookies, violations);
  const scriptFlows = generateFlows(cookies);

  return {
    scanId: `scan-${Date.now()}`,
    domain,
    scannedAt: new Date().toISOString(),
    riskScore,
    cookies,
    violations,
    shadowScripts,
    vendors,
    insights,
    riskTrend,
    scriptFlows
  };
}
