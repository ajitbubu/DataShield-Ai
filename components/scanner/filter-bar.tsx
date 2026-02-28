import { CookieCategory, RiskLevel } from "@/data/scanner";

type FilterBarProps = {
  query: string;
  category: "All" | CookieCategory;
  risk: "All" | RiskLevel;
  onQueryChange: (value: string) => void;
  onCategoryChange: (value: "All" | CookieCategory) => void;
  onRiskChange: (value: "All" | RiskLevel) => void;
  onExport: () => void;
};

export function FilterBar({
  query,
  category,
  risk,
  onQueryChange,
  onCategoryChange,
  onRiskChange,
  onExport
}: FilterBarProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-border px-4 py-3 lg:flex-row lg:items-center lg:justify-between dark:border-slate-800">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        <input
          className="min-w-[220px] flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-highlight dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search cookie, vendor, or data field"
          type="search"
          value={query}
        />
        <select
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-highlight dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          onChange={(event) => onCategoryChange(event.target.value as "All" | CookieCategory)}
          value={category}
        >
          <option value="All">All Categories</option>
          <option value="Necessary">Necessary</option>
          <option value="Functional">Functional</option>
          <option value="Analytics">Analytics</option>
          <option value="Marketing">Marketing</option>
        </select>
        <select
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-highlight dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          onChange={(event) => onRiskChange(event.target.value as "All" | RiskLevel)}
          value={risk}
        >
          <option value="All">All Risk</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      <button
        className="rounded-lg border border-border px-3 py-2 text-sm font-semibold text-primary transition-colors hover:border-primary/40 dark:border-slate-700"
        onClick={onExport}
        type="button"
      >
        Export CSV (UI)
      </button>
    </div>
  );
}
