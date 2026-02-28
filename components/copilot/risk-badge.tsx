import { RiskLevel } from "@/data/copilot";
import { cn } from "@/lib/utils";

type RiskBadgeProps = {
  level: RiskLevel;
  className?: string;
};

const tones: Record<RiskLevel, string> = {
  Low: "border-success/30 bg-success/10 text-success",
  Medium: "border-warning/30 bg-warning/10 text-warning",
  High: "border-danger/30 bg-danger/10 text-danger"
};

export function RiskBadge({ level, className }: RiskBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-wide",
        tones[level],
        className
      )}
    >
      {level} Risk
    </span>
  );
}
