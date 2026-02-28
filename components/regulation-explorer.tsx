"use client";

import { useMemo, useState } from "react";
import { Regulation, RegulationCategory, RegulationRegion } from "@/data/regulations";
import { filterRegulations } from "@/lib/regulations";
import { RegulationCard } from "@/components/regulation-card";
import { RegulationFilter } from "@/components/regulation-filter";
import { RegulationSearch } from "@/components/regulation-search";
import { RegulationSidebar } from "@/components/regulation-sidebar";

type RegulationExplorerProps = {
  regulations: Regulation[];
  sidebarData?: {
    quickLinks: Regulation[];
    recentlyUpdated: Regulation[];
    popular: Regulation[];
  };
  initialQuery?: string;
  initialRegion?: "All" | RegulationRegion;
  initialCategory?: "All" | RegulationCategory;
  lockCategory?: boolean;
  showSidebar?: boolean;
};

export function RegulationExplorer({
  regulations,
  sidebarData,
  initialQuery = "",
  initialRegion = "All",
  initialCategory = "All",
  lockCategory = false,
  showSidebar = true
}: RegulationExplorerProps) {
  const [query, setQuery] = useState(initialQuery);
  const [region, setRegion] = useState<"All" | RegulationRegion>(initialRegion);
  const [category, setCategory] = useState<"All" | RegulationCategory>(initialCategory);

  const filtered = useMemo(
    () => filterRegulations(regulations, { query, region, category }),
    [regulations, query, region, category]
  );

  const resetFilters = () => {
    setQuery("");
    setRegion("All");
    setCategory(lockCategory ? initialCategory : "All");
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4 rounded-xl border border-border bg-surface p-4 shadow-sm sm:p-6">
        <RegulationSearch onChange={setQuery} value={query} />
        <RegulationFilter
          category={category}
          categoryDisabled={lockCategory}
          onCategoryChange={setCategory}
          onRegionChange={setRegion}
          onReset={resetFilters}
          region={region}
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div>
          {filtered.length === 0 ? (
            <div className="rounded-xl border border-border bg-surface p-8 text-center shadow-sm">
              <h3 className="text-xl font-semibold text-text">No results found</h3>
              <p className="mt-2 text-sm text-muted">
                Try a different search keyword, region, or category filter.
              </p>
              <button
                className="mt-5 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-muted transition-colors hover:border-primary/40 hover:text-primary"
                onClick={resetFilters}
                type="button"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {filtered.map((regulation) => (
                <RegulationCard key={regulation.id} regulation={regulation} searchQuery={query} />
              ))}
            </div>
          )}
        </div>

        {showSidebar && sidebarData ? (
          <RegulationSidebar
            popular={sidebarData.popular}
            quickLinks={sidebarData.quickLinks}
            recentlyUpdated={sidebarData.recentlyUpdated}
          />
        ) : null}
      </div>
    </div>
  );
}
