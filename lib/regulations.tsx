import { Regulation, RegulationCategory, RegulationRegion } from "@/data/regulations";

export type RegulationFilterState = {
  query: string;
  region: "All" | RegulationRegion;
  category: "All" | RegulationCategory;
};

export function filterRegulations(items: Regulation[], filters: RegulationFilterState) {
  const query = filters.query.trim().toLowerCase();

  return items.filter((item) => {
    const regionMatch = filters.region === "All" || item.region === filters.region;
    const categoryMatch = filters.category === "All" || item.category === filters.category;

    const queryMatch =
      query.length === 0 ||
      item.name.toLowerCase().includes(query) ||
      item.summary.toLowerCase().includes(query) ||
      item.tags.some((tag) => tag.toLowerCase().includes(query));

    return regionMatch && categoryMatch && queryMatch;
  });
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function highlightMatch(text: string, query: string) {
  const normalizedQuery = query.trim();
  if (!normalizedQuery) {
    return text;
  }

  const parts = text.split(new RegExp(`(${escapeRegExp(normalizedQuery)})`, "gi"));

  return parts.map((part, index) =>
    part.toLowerCase() === normalizedQuery.toLowerCase() ? (
      <mark className="rounded bg-[#dbe8ff] px-1 text-text" key={`${part}-${index}`}>
        {part}
      </mark>
    ) : (
      <span key={`${part}-${index}`}>{part}</span>
    )
  );
}
