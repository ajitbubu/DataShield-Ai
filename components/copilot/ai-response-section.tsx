import { ReactNode } from "react";

type AIResponseSectionProps = {
  title: string;
  children: ReactNode;
};

export function AIResponseSection({ title, children }: AIResponseSectionProps) {
  return (
    <section className="rounded-lg border border-border bg-background p-4">
      <h4 className="text-xs font-semibold uppercase tracking-wide text-muted">{title}</h4>
      <div className="mt-2 text-sm leading-6 text-text">{children}</div>
    </section>
  );
}
