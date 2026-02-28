import { cn } from "@/lib/utils";

type TickerProps = {
  items: string[];
  className?: string;
};

export function Ticker({ items, className }: TickerProps) {
  const list = [...items, ...items];

  return (
    <div className={cn("h-16 overflow-hidden", className)}>
      <ul className="dps-ticker-track space-y-2 motion-reduce:animate-none">
        {list.map((item, index) => (
          <li className="text-xs leading-5 text-[#CBD7F6]" key={`${item}-${index}`}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
