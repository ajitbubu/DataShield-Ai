import { cn } from "@/lib/utils";

type RiskTrendChartProps = {
  points: number[];
  className?: string;
  compact?: boolean;
};

export function RiskTrendChart({ points, className, compact = false }: RiskTrendChartProps) {
  const width = compact ? 90 : 280;
  const height = compact ? 30 : 80;
  const max = Math.max(...points, 100);
  const min = Math.min(...points, 0);
  const range = max - min || 1;

  const path = points
    .map((point, index) => {
      const x = (index / Math.max(points.length - 1, 1)) * (width - 4) + 2;
      const y = height - ((point - min) / range) * (height - 8) - 4;
      return `${index === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");

  return (
    <svg className={cn("w-full", className)} viewBox={`0 0 ${width} ${height}`}>
      <path d={path} fill="none" stroke="currentColor" strokeWidth={compact ? 1.8 : 2.5} className="text-highlight" />
    </svg>
  );
}
