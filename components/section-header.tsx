import { ReactNode } from "react";
import { Badge } from "@/components/badge";

type SectionHeaderProps = {
  badge?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
};

export function SectionHeader({ badge, title, description, actions }: SectionHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="max-w-3xl space-y-3">
        {badge ? <Badge>{badge}</Badge> : null}
        <h2 className="text-balance text-3xl font-bold tracking-tight text-text sm:text-4xl">{title}</h2>
        {description ? <p className="text-base text-muted sm:text-lg">{description}</p> : null}
      </div>
      {actions ? <div>{actions}</div> : null}
    </div>
  );
}
