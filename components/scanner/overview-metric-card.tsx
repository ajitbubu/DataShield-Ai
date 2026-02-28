import { RiskTrendChart } from "@/components/scanner/risk-trend-chart";

type OverviewMetricCardProps = {
  label: string;
  value: number;
  trendLabel: string;
  trendUp: boolean;
  points: number[];
};

export function OverviewMetricCard({ label, value, trendLabel, trendUp, points }: OverviewMetricCardProps) {
  return (
    <article className="rounded-xl border border-border bg-surface p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-2 text-2xl font-bold text-text dark:text-slate-100">{value}</p>
      <p className={`mt-1 text-xs font-semibold ${trendUp ? "text-danger" : "text-success"}`}>
        {trendUp ? "↑" : "↓"} {trendLabel}
      </p>
      <div className="mt-2 text-highlight">
        <RiskTrendChart compact points={points} />
      </div>
    </article>
  );
}
