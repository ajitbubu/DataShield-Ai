"use client";

import { RegulationCategory, RegulationRegion, regulationCategories, regulationRegions } from "@/data/regulations";
import { cn } from "@/lib/utils";

type RegulationFilterProps = {
  region: "All" | RegulationRegion;
  category: "All" | RegulationCategory;
  onRegionChange: (value: "All" | RegulationRegion) => void;
  onCategoryChange: (value: "All" | RegulationCategory) => void;
  onReset: () => void;
  categoryDisabled?: boolean;
};

export function RegulationFilter({
  region,
  category,
  onRegionChange,
  onCategoryChange,
  onReset,
  categoryDisabled = false
}: RegulationFilterProps) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-wrap gap-2">
        {(["All", ...regulationRegions] as const).map((option) => {
          const active = option === region;
          return (
            <button
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-all",
                active
                  ? "border-primary bg-primary text-white"
                  : "border-border bg-surface text-muted hover:border-primary/40 hover:text-primary"
              )}
              key={option}
              onClick={() => onRegionChange(option)}
              type="button"
            >
              {option}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <label className="text-sm font-medium text-muted" htmlFor="regulation-category-filter">
          Category
        </label>
        <select
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-highlight disabled:bg-[#f8fafc] disabled:text-muted"
          disabled={categoryDisabled}
          id="regulation-category-filter"
          onChange={(event) => onCategoryChange(event.target.value as "All" | RegulationCategory)}
          value={category}
        >
          <option value="All">All</option>
          {regulationCategories.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <button
          className="rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted transition-colors hover:border-primary/40 hover:text-primary"
          onClick={onReset}
          type="button"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
