import { cn } from "@/lib/utils";

type ConfidenceBadgeProps = {
  value: number;
  className?: string;
};

export function ConfidenceBadge({ value, className }: ConfidenceBadgeProps) {
  const dotTone = value >= 85 ? "bg-success" : value >= 70 ? "bg-warning" : "bg-danger";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-border bg-surface px-2.5 py-1 text-xs font-semibold",
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", dotTone)} />
      Confidence {value}%
    </span>
  );
}
