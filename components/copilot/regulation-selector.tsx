import { CopilotRegulation } from "@/data/copilot";

type RegulationSelectorProps = {
  value: CopilotRegulation;
  options: CopilotRegulation[];
  onChange: (value: CopilotRegulation) => void;
};

export function RegulationSelector({ value, options, onChange }: RegulationSelectorProps) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted" htmlFor="regulation">
        Regulation Context
      </label>
      <select
        className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-highlight"
        id="regulation"
        onChange={(event) => onChange(event.target.value as CopilotRegulation)}
        value={value}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
