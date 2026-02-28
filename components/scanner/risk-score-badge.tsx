import { cn } from "@/lib/utils";

type RiskScoreBadgeProps = {
  score: number;
};

export function RiskScoreBadge({ score }: RiskScoreBadgeProps) {
  const tone = score <= 30 ? "text-success bg-success/15 border-success/30" : score <= 60 ? "text-warning bg-warning/15 border-warning/30" : "text-danger bg-danger/15 border-danger/30";

  return (
    <span className={cn("inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide", tone)}>
      Risk Score {score}
    </span>
  );
}
