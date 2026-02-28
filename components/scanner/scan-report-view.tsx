"use client";

import Link from "next/link";
import { ScanResult } from "@/data/scanner";
import { CookieTable } from "@/components/scanner/cookie-table";
import { InsightCard } from "@/components/scanner/insight-card";
import { OverviewMetricCard } from "@/components/scanner/overview-metric-card";
import { RiskScoreBadge } from "@/components/scanner/risk-score-badge";
import { ScanHistoryPanel } from "@/components/scanner/scan-history-panel";
import { ScriptFlowDiagram } from "@/components/scanner/script-flow-diagram";

function metricTrend(points: number[]) {
  if (points.length < 2) return { label: "0 vs previous", up: false };
  const delta = points[points.length - 1] - points[points.length - 2];
  return { label: `${Math.abs(delta)} vs previous scan`, up: delta > 0 };
}

export function ScanReportView({ scan, history }: { scan: ScanResult; history: ScanResult[] }) {
  const trend = metricTrend(scan.riskTrend);
  const highRisk = scan.cookies.filter((cookie) => cookie.riskLevel === "High").length;

  return (
    <div className="min-h-screen bg-background px-4 py-6 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1400px] space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Scanner Report</p>
            <h1 className="text-2xl font-bold text-text dark:text-slate-100">{scan.domain}</h1>
            <p className="text-sm text-muted dark:text-slate-300">Scan ID: {scan.scanId} • {new Date(scan.scannedAt).toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-2">
            <RiskScoreBadge score={scan.riskScore} />
            <Link className="rounded-lg border border-border px-3 py-2 text-sm font-semibold text-primary dark:border-slate-700" href="/scanner">
              Back to Dashboard
            </Link>
          </div>
        </header>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <OverviewMetricCard label="Total Cookies" points={scan.riskTrend} trendLabel={trend.label} trendUp={trend.up} value={scan.cookies.length} />
          <OverviewMetricCard label="Consent Violations" points={scan.riskTrend.map((p) => p - 8)} trendLabel={trend.label} trendUp={trend.up} value={scan.violations.length} />
          <OverviewMetricCard label="High Risk Trackers" points={scan.riskTrend.map((p) => p - 6)} trendLabel={trend.label} trendUp={trend.up} value={highRisk} />
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          <CookieTable cookies={scan.cookies} />
          <aside className="rounded-xl border border-border bg-surface p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <h2 className="text-xl font-semibold text-text dark:text-slate-100">AI Insights</h2>
            <div className="mt-3 space-y-3">
              {scan.insights.map((insight) => (
                <InsightCard insight={insight} key={insight.id} />
              ))}
            </div>
          </aside>
        </div>

        <ScriptFlowDiagram flows={scan.scriptFlows} />
        <ScanHistoryPanel scans={history} />
      </div>
    </div>
  );
}
