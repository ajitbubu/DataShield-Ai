import Link from "next/link";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  type?: "button" | "submit";
  ariaLabel?: string;
  onClick?: () => void;
};

const baseStyles =
  "inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-highlight focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const variantStyles = {
  primary:
    "bg-primary text-white shadow-sm hover:-translate-y-0.5 hover:bg-[#17215f] hover:shadow-lg active:translate-y-0",
  secondary:
    "border border-[#9de4db] bg-[#e8fbf8] text-primary shadow-sm hover:-translate-y-0.5 hover:border-accent hover:bg-[#d8f7f2] hover:shadow-lg active:translate-y-0",
  ghost:
    "border border-border bg-transparent text-text hover:-translate-y-0.5 hover:border-primary/40 hover:bg-white/70 hover:text-primary active:translate-y-0"
};

export function Button({
  children,
  href,
  variant = "primary",
  className,
  type = "button",
  ariaLabel,
  onClick
}: ButtonProps) {
  const classes = cn(baseStyles, variantStyles[variant], className);

  if (href) {
    return (
      <Link aria-label={ariaLabel} className={classes} href={href}>
        {children}
      </Link>
    );
  }

  return (
    <button aria-label={ariaLabel} className={classes} onClick={onClick} type={type}>
      {children}
    </button>
  );
}
