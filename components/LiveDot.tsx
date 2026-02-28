import { cn } from "@/lib/utils";

type LiveDotProps = {
  className?: string;
};

export function LiveDot({ className }: LiveDotProps) {
  return (
    <span className={cn("relative inline-flex h-2.5 w-2.5", className)}>
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#18B6A4]/70 motion-reduce:animate-none" />
      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#18B6A4]" />
    </span>
  );
}
