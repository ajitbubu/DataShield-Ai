import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BadgeProps = {
  children: ReactNode;
  className?: string;
};

export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-[#eef4ff] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary",
        className
      )}
    >
      {children}
    </span>
  );
}
