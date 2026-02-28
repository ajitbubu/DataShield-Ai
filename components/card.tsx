import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className }: CardProps) {
  return (
    <article
      className={cn(
        "rounded-2xl border border-border bg-surface p-6 shadow-card transition-transform duration-200 hover:-translate-y-0.5",
        className
      )}
    >
      {children}
    </article>
  );
}
