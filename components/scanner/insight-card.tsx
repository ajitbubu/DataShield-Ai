import { ScanInsight } from "@/data/scanner";

type InsightCardProps = {
  insight: ScanInsight;
};

export function InsightCard({ insight }: InsightCardProps) {
  return (
    <article className="rounded-lg border border-border bg-background p-4 dark:border-slate-800 dark:bg-slate-900">
      <p className="text-sm font-medium leading-6 text-text dark:text-slate-100">{insight.text}</p>
      <div className="mt-3 flex items-center justify-between gap-2">
        <span className="rounded-full border border-border px-2 py-1 text-xs font-semibold text-muted dark:border-slate-700 dark:text-slate-300">
          Confidence {insight.confidence}%
        </span>
        <button className="rounded-md bg-primary px-2.5 py-1 text-xs font-semibold text-white transition-colors hover:bg-[#17215f]" type="button">
          Recommended Action
        </button>
      </div>
      <p className="mt-2 text-xs text-muted dark:text-slate-400">{insight.recommendedAction}</p>
    </article>
  );
}
