import { cn } from "@/lib/utils";

type DashboardCardProps = {
  label: string;
  value: string;
  trend: string;
  trendUp: boolean;
};

export function DashboardCard({ label, value, trend, trendUp }: DashboardCardProps) {
  return (
    <article className="rounded-xl border border-border bg-surface p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-2 text-3xl font-bold text-text dark:text-slate-100">{value}</p>
      <p className={cn("mt-2 text-sm font-semibold", trendUp ? "text-success" : "text-danger")}>
        {trendUp ? "↑" : "↓"} {trend}
      </p>
    </article>
  );
}
