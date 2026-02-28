import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReactNode } from "react";
import { Button } from "@/components/button";
import { Container } from "@/components/container";
import { RegulationBadge } from "@/components/regulation-badge";
import { RegulationTOC } from "@/components/regulation-toc";
import {
  getRegulationBySlug,
  getRegulationCategorySlug,
  getRelatedRegulations,
  regulations
} from "@/data/regulations";
import { getProductBySlug } from "@/data/products";

type Props = {
  params: Promise<{ slug: string }>;
};

const tocItems = [
  { id: "overview", label: "Overview" },
  { id: "key-legal-requirements", label: "Key Legal Requirements" },
  { id: "consent-implications", label: "Consent Implications" },
  { id: "cookie-tracking-impact", label: "Cookie & Tracking Impact" },
  { id: "data-subject-rights", label: "Data Subject Rights" },
  { id: "penalties-enforcement", label: "Penalties & Enforcement" },
  { id: "implementation-checklist", label: "Implementation Checklist" },
  { id: "recommended-platform-controls", label: "Recommended Platform Controls" },
  { id: "related-regulations", label: "Related Regulations" }
];

export async function generateStaticParams() {
  return regulations.map((regulation) => ({ slug: regulation.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const regulation = getRegulationBySlug(slug);

  if (!regulation) {
    return { title: "Regulation Not Found" };
  }

  const title = `${regulation.name} Compliance Guide | DataPrivacy Shield`;
  const description = regulation.summary;

  return {
    title: { absolute: title },
    description,
    openGraph: {
      title,
      description,
      url: `https://dataprivacyshield.com/regulations/${regulation.slug}`,
      type: "article",
      siteName: "DataPrivacy Shield"
    },
    twitter: {
      card: "summary_large_image",
      title,
      description
    },
    alternates: {
      canonical: `/regulations/${regulation.slug}`
    }
  };
}

function SectionCard({
  id,
  title,
  children
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="scroll-mt-28 rounded-xl border border-border bg-surface p-6 shadow-sm" id={id}>
      <h2 className="text-2xl font-bold text-text">{title}</h2>
      <div className="mt-4 text-sm leading-7 text-muted">{children}</div>
    </section>
  );
}

export default async function RegulationDetailPage({ params }: Props) {
  const { slug } = await params;
  const regulation = getRegulationBySlug(slug);

  if (!regulation) {
    notFound();
  }

  const relatedRegulations = getRelatedRegulations(regulation, 3);
  const recommendedProducts = regulation.relatedProducts
    .map((productSlug) => getProductBySlug(productSlug))
    .filter((product) => product !== undefined);

  const legislationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Legislation",
    name: regulation.name,
    legislationDate: regulation.effectiveYear.toString(),
    dateModified: regulation.lastUpdated,
    legislationType: regulation.category,
    legislationJurisdiction: regulation.region,
    abstract: regulation.summary,
    author: {
      "@type": "Organization",
      name: regulation.enforcementAuthority
    },
    publisher: {
      "@type": "Organization",
      name: "DataPrivacy Shield"
    }
  };

  return (
    <>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(legislationJsonLd) }}
        type="application/ld+json"
      />

      <section className="py-14 lg:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
            <article>
              <header className="mb-8 space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <RegulationBadge region={regulation.region} />
                  <span className="rounded-full border border-border bg-[#f8fafc] px-3 py-1 text-xs font-medium text-muted">
                    {regulation.category}
                  </span>
                </div>

                <h1 className="text-4xl font-bold tracking-tight text-text md:text-5xl">{regulation.name}</h1>

                <div className="flex flex-wrap gap-3 text-sm text-muted">
                  <span>Effective Year: {regulation.effectiveYear}</span>
                  <span className="text-border">•</span>
                  <span>Last Updated: {regulation.lastUpdated}</span>
                </div>

                <p className="max-w-3xl text-base leading-7 text-muted">{regulation.summary}</p>
              </header>

              <div className="space-y-5">
                <SectionCard id="overview" title="Overview">
                  <p>{regulation.summary}</p>
                  <p className="mt-3">
                    This guide is structured for privacy, legal, and engineering stakeholders implementing controls in
                    production environments.
                  </p>
                </SectionCard>

                <SectionCard id="key-legal-requirements" title="Key Legal Requirements">
                  <ul className="space-y-2">
                    {regulation.keyRequirements.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </SectionCard>

                <SectionCard id="consent-implications" title="Consent Implications">
                  <ul className="space-y-2">
                    {regulation.consentRequirements.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </SectionCard>

                <SectionCard id="cookie-tracking-impact" title="Cookie & Tracking Impact">
                  <ul className="space-y-2">
                    {regulation.cookieImplications.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </SectionCard>

                <SectionCard id="data-subject-rights" title="Data Subject Rights">
                  <ul className="space-y-2">
                    {regulation.dsarRequirements.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </SectionCard>

                <SectionCard id="penalties-enforcement" title="Penalties & Enforcement">
                  <p>
                    <strong className="text-text">Penalties:</strong> {regulation.penalties}
                  </p>
                  <p className="mt-3">
                    <strong className="text-text">Enforcement Authority:</strong> {regulation.enforcementAuthority}
                  </p>
                </SectionCard>

                <SectionCard id="implementation-checklist" title="Implementation Checklist">
                  <ul className="space-y-2">
                    {regulation.implementationChecklist.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </SectionCard>

                <SectionCard id="recommended-platform-controls" title="Recommended Platform Controls">
                  <div className="grid gap-4 md:grid-cols-2">
                    {recommendedProducts.map((product) => (
                      <Link
                        className="rounded-lg border border-border bg-background p-4 transition-all hover:border-primary/30 hover:shadow-sm"
                        href={`/products/${product.slug}`}
                        key={product.slug}
                      >
                        <p className="text-sm font-semibold text-text">{product.title}</p>
                        <p className="mt-2 text-sm text-muted">{product.summary}</p>
                      </Link>
                    ))}
                  </div>
                </SectionCard>

                <SectionCard id="related-regulations" title="Related Regulations">
                  <div className="grid gap-4 md:grid-cols-2">
                    {relatedRegulations.map((related) => (
                      <Link
                        className="rounded-lg border border-border bg-background p-4 transition-all hover:border-primary/30 hover:shadow-sm"
                        href={`/regulations/${related.slug}`}
                        key={related.slug}
                      >
                        <p className="text-sm font-semibold text-text">{related.name}</p>
                        <p className="mt-2 text-sm text-muted">{related.summary}</p>
                      </Link>
                    ))}
                  </div>
                </SectionCard>
              </div>
            </article>

            <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
              <RegulationTOC items={tocItems} />

              <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">Quick Stats</h3>
                <ul className="mt-3 space-y-2 text-sm text-muted">
                  <li>
                    <strong className="text-text">Region:</strong> {regulation.region}
                  </li>
                  <li>
                    <strong className="text-text">Category:</strong> {regulation.category}
                  </li>
                  <li>
                    <strong className="text-text">Effective:</strong> {regulation.effectiveYear}
                  </li>
                  <li>
                    <strong className="text-text">Authority:</strong> {regulation.enforcementAuthority}
                  </li>
                </ul>
              </div>

              <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
                <Button className="w-full" variant="secondary">
                  Download Checklist (UI)
                </Button>
                <Link
                  className="mt-3 block text-center text-sm font-semibold text-primary transition-colors hover:text-highlight"
                  href={`/regulations/category/${getRegulationCategorySlug(regulation.category)}`}
                >
                  View {regulation.category} Category
                </Link>
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
