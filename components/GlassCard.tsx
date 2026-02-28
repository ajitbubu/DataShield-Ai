import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type GlassCardProps = {
  children: ReactNode;
  className?: string;
};

export function GlassCard({ children, className }: GlassCardProps) {
  return (
    <article
      className={cn(
        "rounded-2xl border border-white/20 bg-white/[0.12] p-4 text-slate-100 shadow-[0_16px_40px_rgba(15,23,42,0.26)] backdrop-blur-2xl",
        "before:pointer-events-none before:absolute before:inset-0 before:rounded-2xl before:border before:border-[#3B82F6]/15 before:content-['']",
        "relative overflow-hidden",
        className
      )}
    >
      {children}
    </article>
  );
}
