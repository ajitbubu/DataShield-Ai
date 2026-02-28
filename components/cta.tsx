import { Button } from "@/components/button";
import { Container } from "@/components/container";

type CTAProps = {
  title: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export function CTA({
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel
}: CTAProps) {
  return (
    <section className="py-16">
      <Container>
        <div className="rounded-2xl border border-border bg-hero-gradient p-8 shadow-soft sm:p-12">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold tracking-tight text-text">{title}</h2>
              <p className="mt-3 text-base text-muted">{description}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button href={primaryHref}>{primaryLabel}</Button>
              {secondaryHref && secondaryLabel ? (
                <Button href={secondaryHref} variant="ghost">
                  {secondaryLabel}
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
