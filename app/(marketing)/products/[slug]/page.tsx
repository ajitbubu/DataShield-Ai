import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { AccordionFAQ } from "@/components/accordion-faq";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { Container } from "@/components/container";
import { CTA } from "@/components/cta";
import { getProductBySlug, products } from "@/data/products";
import { regulations } from "@/data/regulations";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: product.title,
    description: product.summary
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const mappedRegulations = regulations.filter((regulation) => product.regulations.includes(regulation.slug));

  return (
    <>
      <section className="py-16 sm:py-20">
        <Container>
          <Badge>{product.category}</Badge>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-text sm:text-5xl">{product.title}</h1>
          <p className="mt-4 max-w-3xl text-lg text-muted">{product.summary}</p>
          <p className="mt-4 text-base font-semibold text-primary">{product.roi}</p>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {product.benefits.map((benefit) => (
              <Card key={benefit}>
                <p className="text-sm font-medium text-text">{benefit}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <div className="grid gap-8 lg:grid-cols-2">
            <Card>
              <h2 className="text-2xl font-semibold text-text">Key Features</h2>
              <ul className="mt-4 space-y-3 text-sm text-muted">
                {product.features.map((feature) => (
                  <li key={feature}>• {feature}</li>
                ))}
              </ul>
            </Card>

            <Card>
              <h2 className="text-2xl font-semibold text-text">How It Works</h2>
              <ol className="mt-4 space-y-3 text-sm text-muted">
                {product.howItWorks.map((step, index) => (
                  <li key={step}>
                    <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#e8edff] text-xs font-semibold text-primary">
                      {index + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </Card>
          </div>
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <div className="grid gap-8 lg:grid-cols-2">
            <Card>
              <h2 className="text-2xl font-semibold text-text">Integrations</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {product.integrations.map((integration) => (
                  <span className="rounded-full border border-border bg-background px-3 py-1 text-sm text-muted" key={integration}>
                    {integration}
                  </span>
                ))}
              </div>
            </Card>

            <Card>
              <h2 className="text-2xl font-semibold text-text">Compliance Mapping</h2>
              <ul className="mt-4 space-y-2 text-sm text-muted">
                {mappedRegulations.map((regulation) => (
                  <li key={regulation.slug}>
                    <Link className="font-semibold text-primary hover:text-highlight" href={`/regulations/${regulation.slug}`}>
                      {regulation.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <h2 className="mb-5 text-2xl font-semibold text-text">FAQ</h2>
          <AccordionFAQ items={product.faq} />
        </Container>
      </section>

      <CTA
        description="See this module in action with your current stack and compliance priorities."
        primaryHref="/company/contact"
        primaryLabel="Request a Demo"
        secondaryHref="/products"
        secondaryLabel="Back to Products"
        title={`Deploy ${product.title} faster`}
      />
    </>
  );
}
