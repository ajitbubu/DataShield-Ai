import Link from "next/link";
import { Regulation } from "@/data/regulations";
import { highlightMatch } from "@/lib/regulations";
import { RegulationBadge } from "@/components/regulation-badge";

type RegulationCardProps = {
  regulation: Regulation;
  searchQuery?: string;
};

export function RegulationCard({ regulation, searchQuery = "" }: RegulationCardProps) {
  return (
    <article className="rounded-xl border border-border bg-surface p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-center justify-between gap-3">
        <RegulationBadge region={regulation.region} />
        <span className="text-xs font-medium text-muted">Effective {regulation.effectiveYear}</span>
      </div>

      <h3 className="mt-4 text-xl font-semibold text-text">{highlightMatch(regulation.name, searchQuery)}</h3>
      <p className="mt-2 text-sm leading-6 text-muted">{highlightMatch(regulation.summary, searchQuery)}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {regulation.tags.slice(0, 3).map((tag) => (
          <span
            className="rounded-full border border-border bg-[#f8fafc] px-2.5 py-1 text-xs font-medium text-muted"
            key={tag}
          >
            #{highlightMatch(tag, searchQuery)}
          </span>
        ))}
      </div>

      <Link
        className="mt-6 inline-flex text-sm font-semibold text-primary transition-colors hover:text-highlight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-highlight"
        href={`/regulations/${regulation.slug}`}
      >
        View Details →
      </Link>
    </article>
  );
}
