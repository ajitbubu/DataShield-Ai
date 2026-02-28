"use client";

import { cn } from "@/lib/utils";

type TagFilterProps = {
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
};

export function TagFilter({ options, selected, onSelect }: TagFilterProps) {
  return (
    <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter options">
      {options.map((option) => {
        const active = option === selected;

        return (
          <button
            aria-selected={active}
            className={cn(
              "rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition-all",
              active
                ? "border-primary bg-primary text-white"
                : "border-border bg-surface text-muted hover:border-primary hover:text-primary"
            )}
            key={option}
            onClick={() => onSelect(option)}
            role="tab"
            type="button"
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
