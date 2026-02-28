import Link from "next/link";
import { Metadata } from "next";
import { Card } from "@/components/card";
import { Container } from "@/components/container";
import { SectionHeader } from "@/components/section-header";
import { solutions } from "@/data/solutions";

export const metadata: Metadata = {
  title: "Solutions",
  description: "Privacy solutions for teams and industries: privacy, security, engineering, retail, healthcare, and fintech."
};

export default function SolutionsPage() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <SectionHeader
          badge="Solutions"
          description="Outcome-focused solution blueprints for roles and industries with recommended product bundles."
          title="Solutions by Persona and Industry"
        />

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {solutions.map((solution) => (
            <Card key={solution.slug}>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">{solution.type}</p>
              <h2 className="mt-2 text-xl font-semibold text-text">{solution.title}</h2>
              <p className="mt-2 text-sm text-muted">{solution.summary}</p>
              <ul className="mt-4 space-y-2 text-sm text-muted">
                {solution.useCases.slice(0, 2).map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
              <Link
                className="mt-6 inline-flex text-sm font-semibold text-primary hover:text-highlight"
                href={`/solutions/${solution.slug}`}
              >
                View solution →
              </Link>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
