"use client";

import { ComplianceTrendChart } from "@/components/admin/compliance-trend-chart";
import { DashboardCard } from "@/components/admin/dashboard-card";
import { DashboardMetric, aiFeatureHighlights, complianceTrend, dashboardMetrics } from "@/data/admin";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {dashboardMetrics.map((metric: DashboardMetric) => (
          <DashboardCard
            key={metric.id}
            label={metric.label}
            trend={metric.trend}
            trendUp={metric.trendUp}
            value={metric.value}
          />
        ))}
      </section>

      <ComplianceTrendChart points={complianceTrend} />

      <section className="rounded-xl border border-border bg-surface p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <h2 className="text-xl font-semibold text-text dark:text-slate-100">AI-Powered Automation Signals</h2>
        <p className="mt-2 text-sm text-muted dark:text-slate-300">
          Continuous monitoring and policy-as-code intelligence for privacy operations.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {aiFeatureHighlights.map((item) => (
            <div className="rounded-lg border border-border bg-background px-4 py-3 text-sm text-text dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100" key={item}>
              {item}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
