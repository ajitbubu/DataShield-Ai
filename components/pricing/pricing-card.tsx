import { Button } from "@/components/button";
import { cn } from "@/lib/utils";

export type BillingCycle = "monthly" | "annual";

export type PricingPlan = {
  name: "Starter" | "Professional" | "Enterprise";
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  highlighted?: boolean;
  badge?: string;
};

type PricingCardProps = {
  plan: PricingPlan;
  billingCycle: BillingCycle;
};

export function PricingCard({ plan, billingCycle }: PricingCardProps) {
  const price = billingCycle === "annual" ? plan.annualPrice : plan.monthlyPrice;

  return (
    <article
      className={cn(
        "relative flex h-full flex-col rounded-xl border bg-surface p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg",
        plan.highlighted ? "border-primary ring-2 ring-primary/20" : "border-border"
      )}
    >
      {plan.badge ? (
        <span className="absolute -top-3 left-5 rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
          {plan.badge}
        </span>
      ) : null}

      <div>
        <h3 className="text-xl font-semibold text-text">{plan.name}</h3>
        <p className="mt-2 min-h-[48px] text-sm leading-6 text-muted">{plan.description}</p>
      </div>

      <div className="mt-5">
        <p className="text-4xl font-bold tracking-tight text-text">${price.toLocaleString()}</p>
        <p className="mt-1 text-sm text-muted">
          per month {billingCycle === "annual" ? "(billed annually)" : "(billed monthly)"}
        </p>
      </div>

      <ul className="mt-6 space-y-2 text-sm text-muted">
        {plan.features.map((feature) => (
          <li className="flex items-start gap-2" key={feature}>
            <span className="mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#e9f7f4] text-[10px] font-bold text-accent">
              ✓
            </span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-col gap-2">
        <Button className="w-full" href={plan.ctaHref} variant={plan.highlighted ? "primary" : "secondary"}>
          {plan.ctaLabel}
        </Button>
        {plan.secondaryCtaLabel && plan.secondaryCtaHref ? (
          <Button className="w-full" href={plan.secondaryCtaHref} variant="ghost">
            {plan.secondaryCtaLabel}
          </Button>
        ) : null}
      </div>
    </article>
  );
}
