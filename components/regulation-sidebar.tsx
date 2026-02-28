import Link from "next/link";
import { Regulation } from "@/data/regulations";

type RegulationSidebarProps = {
  quickLinks: Regulation[];
  recentlyUpdated: Regulation[];
  popular: Regulation[];
};

function SidebarList({ title, items }: { title: string; items: Regulation[] }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">{title}</h3>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item.slug}>
            <Link
              className="text-sm font-medium text-text transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-highlight"
              href={`/regulations/${item.slug}`}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function RegulationSidebar({ quickLinks, recentlyUpdated, popular }: RegulationSidebarProps) {
  return (
    <aside className="hidden space-y-4 lg:block">
      <SidebarList items={quickLinks} title="Quick Links" />
      <SidebarList items={recentlyUpdated} title="Recently Updated" />
      <SidebarList items={popular} title="Popular Regulations" />
    </aside>
  );
}
