import { cn } from "@/lib/utils";

type ProgressBarProps = {
  value: number;
  className?: string;
  trackClassName?: string;
  barClassName?: string;
};

export function ProgressBar({ value, className, trackClassName, barClassName }: ProgressBarProps) {
  const safeValue = Math.max(0, Math.min(100, value));

  return (
    <div
      aria-label={`Progress ${safeValue}%`}
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={safeValue}
      className={cn("w-full", className)}
      role="progressbar"
    >
      <div className={cn("relative h-2.5 overflow-hidden rounded-full bg-white/20", trackClassName)}>
        <div
          className={cn(
            "relative h-full rounded-full bg-gradient-to-r from-[#18B6A4] to-[#3B82F6]",
            "dps-progress-bar",
            barClassName
          )}
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  );
}
