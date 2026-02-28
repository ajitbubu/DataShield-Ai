import { compliancePath } from "@/lib/admin";

type ComplianceTrendChartProps = {
  points: number[];
};

export function ComplianceTrendChart({ points }: ComplianceTrendChartProps) {
  const path = compliancePath(points);

  return (
    <section className="rounded-xl border border-border bg-surface p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-text dark:text-slate-100">Compliance Trend Over Time</h3>
        <span className="text-sm text-muted">Current: {points[points.length - 1]}%</span>
      </div>
      <svg className="w-full" viewBox="0 0 320 90">
        <path d="M4 85 L316 85" stroke="currentColor" className="text-border dark:text-slate-800" />
        <path d={path} fill="none" stroke="currentColor" strokeWidth="2.6" className="text-highlight" />
      </svg>
    </section>
  );
}
