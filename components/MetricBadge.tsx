import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type MetricBadgeVariant = "success" | "warning" | "danger" | "info" | "neutral";

type MetricBadgeProps = {
  children: ReactNode;
  className?: string;
  variant?: MetricBadgeVariant;
};

const variantStyles: Record<MetricBadgeVariant, string> = {
  success: "border-[#16A34A]/35 bg-[#16A34A]/15 text-[#CFF7DD]",
  warning: "border-[#F59E0B]/35 bg-[#F59E0B]/15 text-[#FCE7B1]",
  danger: "border-[#EF4444]/35 bg-[#EF4444]/15 text-[#FFD1D1]",
  info: "border-[#3B82F6]/35 bg-[#3B82F6]/15 text-[#D4E7FF]",
  neutral: "border-white/20 bg-white/10 text-[#D8E3FF]"
};

export function MetricBadge({ children, className, variant = "neutral" }: MetricBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em]",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
