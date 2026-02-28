"use client";

type RegulationSearchProps = {
  value: string;
  onChange: (value: string) => void;
};

export function RegulationSearch({ value, onChange }: RegulationSearchProps) {
  return (
    <div className="relative">
      <label className="sr-only" htmlFor="regulation-search">
        Search regulations
      </label>
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">⌕</span>
      <input
        className="w-full rounded-xl border border-border bg-surface py-3 pl-9 pr-3 text-sm text-text transition-all placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-highlight"
        id="regulation-search"
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search by regulation name, tags, or summary"
        type="search"
        value={value}
      />
    </div>
  );
}
