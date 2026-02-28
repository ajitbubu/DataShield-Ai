"use client";

import { useMemo, useState } from "react";
import { CookieRecord, ScanResult } from "@/data/scanner";
import { useScannerTheme } from "@/components/scanner/scanner-theme";
import { CookieTable } from "@/components/scanner/cookie-table";
import { InsightCard } from "@/components/scanner/insight-card";
import { OverviewMetricCard } from "@/components/scanner/overview-metric-card";
import { RiskScoreBadge } from "@/components/scanner/risk-score-badge";
import { RiskTrendChart } from "@/components/scanner/risk-trend-chart";
import { ScanButton } from "@/components/scanner/scan-button";
import { ScanHistoryPanel } from "@/components/scanner/scan-history-panel";
import { ScriptFlowDiagram } from "@/components/scanner/script-flow-diagram";

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

function countUnclassified(cookies: CookieRecord[]) {
  return cookies.filter((cookie) => cookie.aiConfidence < 80).length;
}

function countHighRiskTrackers(cookies: CookieRecord[]) {
  return cookies.filter((cookie) => cookie.riskLevel === "High").length;
}

function metricTrendLabel(points: number[]) {
  if (points.length < 2) return { label: "0", up: false };
  const delta = points[points.length - 1] - points[points.length - 2];
  return { label: `${Math.abs(delta)} vs previous scan`, up: delta > 0 };
}

type ScannerDashboardProps = {
  initialScan: ScanResult;
  history: ScanResult[];
  domains: string[];
};

export function ScannerDashboard({ initialScan, history, domains }: ScannerDashboardProps) {
  const [selectedDomain, setSelectedDomain] = useState(initialScan.domain);
  const [scan, setScan] = useState<ScanResult>(initialScan);
  const [scanHistory, setScanHistory] = useState<ScanResult[]>(history);
  const [isScanning, setIsScanning] = useState(false);

  const { theme, toggleTheme } = useScannerTheme();

  const trendMeta = useMemo(() => metricTrendLabel(scan.riskTrend), [scan.riskTrend]);

  async function runScan() {
    setIsScanning(true);
    try {
      const response = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: selectedDomain })
      });

      if (!response.ok) {
        throw new Error("Scan failed");
      }

      const payload = (await response.json()) as ScanResult;
      setScan(payload);
      setScanHistory((prev) => [payload, ...prev].slice(0, 20));
    } catch (error) {
      // In a real engine this would route to a durable notification system.
      console.error(error);
    } finally {
      setIsScanning(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-text dark:bg-slate-950 dark:text-slate-100">
      <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
        <div className="mx-auto max-w-[1400px] px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <select
                className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-highlight dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                onChange={(event) => setSelectedDomain(event.target.value)}
                value={selectedDomain}
              >
                {domains.map((domain) => (
                  <option key={domain} value={domain}>
                    {domain}
                  </option>
                ))}
              </select>
              <p className="text-sm text-muted dark:text-slate-300">Last scan: {relativeTime(scan.scannedAt)}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <RiskScoreBadge score={scan.riskScore} />
              <button
                className="rounded-lg border border-border px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted transition-colors hover:text-primary dark:border-slate-700 dark:text-slate-300"
                onClick={toggleTheme}
                type="button"
              >
                {theme === "dark" ? "Light" : "Dark"} mode
              </button>
              <ScanButton loading={isScanning} onClick={runScan} />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] space-y-8 px-4 py-6 sm:px-6 lg:px-8">
        <section>
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-text dark:text-slate-100">AI Privacy Risk Overview</h1>
              <p className="mt-1 text-sm text-muted dark:text-slate-300">
                AI continuously re-evaluates cookie behavior across scans.
              </p>
              <p className="text-sm text-muted dark:text-slate-300">
                Not just detection - intelligent enforcement recommendations.
              </p>
            </div>
            <div className="text-highlight">
              <RiskTrendChart points={scan.riskTrend} />
            </div>
          </div>

          {isScanning ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div className="rounded-xl border border-border bg-surface p-4 dark:border-slate-800 dark:bg-slate-950" key={idx}>
                  <div className="h-3 w-2/5 animate-pulse rounded bg-[#e6edf8] dark:bg-slate-800" />
                  <div className="mt-3 h-6 w-1/4 animate-pulse rounded bg-[#e6edf8] dark:bg-slate-800" />
                  <div className="mt-4 h-2 w-full animate-pulse rounded bg-[#e6edf8] dark:bg-slate-800" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <OverviewMetricCard
                label="Total Cookies Detected"
                points={scan.riskTrend}
                trendLabel={trendMeta.label}
                trendUp={trendMeta.up}
                value={scan.cookies.length}
              />
              <OverviewMetricCard
                label="Unclassified Cookies (AI Pending)"
                points={scan.riskTrend.map((p) => Math.max(0, p - 12))}
                trendLabel={trendMeta.label}
                trendUp={trendMeta.up}
                value={countUnclassified(scan.cookies)}
              />
              <OverviewMetricCard
                label="High Risk Trackers"
                points={scan.riskTrend.map((p) => Math.max(0, p - 6))}
                trendLabel={trendMeta.label}
                trendUp={trendMeta.up}
                value={countHighRiskTrackers(scan.cookies)}
              />
              <OverviewMetricCard
                label="Consent Violations"
                points={scan.riskTrend.map((p) => Math.max(0, p - 10))}
                trendLabel={trendMeta.label}
                trendUp={trendMeta.up}
                value={scan.violations.length}
              />
              <OverviewMetricCard
                label="Shadow Scripts"
                points={scan.riskTrend.map((p) => Math.max(0, p - 8))}
                trendLabel={trendMeta.label}
                trendUp={trendMeta.up}
                value={scan.shadowScripts.length}
              />
              <OverviewMetricCard
                label="3rd Party Vendors"
                points={scan.riskTrend.map((p) => Math.max(0, p - 4))}
                trendLabel={trendMeta.label}
                trendUp={trendMeta.up}
                value={scan.vendors.filter((vendor) => vendor !== "DataPrivacy Shield").length}
              />
            </div>
          )}
        </section>

        <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div>
            <h2 className="mb-3 text-xl font-semibold text-text dark:text-slate-100">Cookie Classification Table</h2>
            <CookieTable cookies={scan.cookies} />
          </div>

          <aside className="rounded-xl border border-border bg-surface p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <h2 className="text-xl font-semibold text-text dark:text-slate-100">AI Insights Panel</h2>
            <p className="mt-2 text-sm text-muted dark:text-slate-300">
              Continuous AI Risk Monitoring identifies evolving script and vendor behavior.
            </p>
            <div className="mt-4 space-y-3">
              {scan.insights.map((insight) => (
                <InsightCard insight={insight} key={insight.id} />
              ))}
            </div>
          </aside>
        </section>

        <section>
          <ScriptFlowDiagram flows={scan.scriptFlows} />
        </section>

        <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="rounded-xl border border-border bg-surface p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <h3 className="text-xl font-semibold text-text dark:text-slate-100">Data Flow Summary</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted dark:text-slate-300">
              <li>• {scan.shadowScripts.length} script(s) loaded before consent gates.</li>
              <li>• {scan.vendors.length} vendor endpoint(s) observed in this scan.</li>
              <li>• {countHighRiskTrackers(scan.cookies)} high-risk tracker(s) flagged for enforcement.</li>
              <li>• AI confidence avg: {Math.round(scan.cookies.reduce((sum, c) => sum + c.aiConfidence, 0) / Math.max(scan.cookies.length, 1))}%</li>
            </ul>
          </div>
          <ScanHistoryPanel scans={scanHistory} />
        </section>
      </main>
    </div>
  );
}
