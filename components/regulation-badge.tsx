import { RegulationRegion } from "@/data/regulations";
import { cn } from "@/lib/utils";

type RegulationBadgeProps = {
  region: RegulationRegion;
  className?: string;
};

const tones: Record<RegulationRegion, string> = {
  EU: "bg-[#eaf0ff] text-primary border-[#c9d7ff]",
  US: "bg-[#ebfbf9] text-[#116b60] border-[#b6ece4]",
  India: "bg-[#eff7ff] text-[#1f4e9e] border-[#cde2ff]",
  Global: "bg-[#f1f5f9] text-muted border-[#d8e0ea]"
};

export function RegulationBadge({ region, className }: RegulationBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide",
        tones[region],
        className
      )}
    >
      {region}
    </span>
  );
}
