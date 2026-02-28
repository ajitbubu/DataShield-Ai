"use client";

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
};

export function SearchInput({ value, onChange, placeholder, ariaLabel }: SearchInputProps) {
  return (
    <input
      aria-label={ariaLabel ?? "Search"}
      className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-text outline-none transition-all placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-highlight"
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder ?? "Search..."}
      type="search"
      value={value}
    />
  );
}
