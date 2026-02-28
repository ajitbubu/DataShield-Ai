import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { Container } from "@/components/container";
import { CTA } from "@/components/cta";
import { products } from "@/data/products";
import { getSolutionBySlug, solutions } from "@/data/solutions";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return solutions.map((solution) => ({ slug: solution.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const solution = getSolutionBySlug(slug);

  if (!solution) {
    return { title: "Solution Not Found" };
  }

  return {
    title: solution.title,
    description: solution.summary
  };
}

export default async function SolutionDetailPage({ params }: Props) {
  const { slug } = await params;
  const solution = getSolutionBySlug(slug);

  if (!solution) {
    notFound();
  }

  const recommended = products.filter((product) => solution.recommendedProductSlugs.includes(product.slug));

  return (
    <>
      <section className="py-16 sm:py-20">
        <Container>
          <Badge>{solution.type}</Badge>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-text sm:text-5xl">{solution.title}</h1>
          <p className="mt-4 max-w-3xl text-lg text-muted">{solution.summary}</p>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {solution.useCases.map((useCase) => (
              <Card key={useCase}>
                <h2 className="text-base font-semibold text-text">Use Case</h2>
                <p className="mt-2 text-sm text-muted">{useCase}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <h2 className="mb-5 text-2xl font-semibold text-text">Recommended Products</h2>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {recommended.map((product) => (
              <Card key={product.slug}>
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">{product.category}</p>
                <h3 className="mt-2 text-lg font-semibold text-text">{product.title}</h3>
                <p className="mt-2 text-sm text-muted">{product.summary}</p>
                <Link
                  className="mt-5 inline-flex text-sm font-semibold text-primary hover:text-highlight"
                  href={`/products/${product.slug}`}
                >
                  Explore product →
                </Link>
              </Card>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Button href="/products">View all products</Button>
            <Button href="/company/contact" variant="ghost">
              Talk to an expert
            </Button>
          </div>
        </Container>
      </section>

      <CTA
        description="Map this solution to your current architecture and compliance roadmap."
        primaryHref="/company/contact"
        primaryLabel="Request a Demo"
        secondaryHref="/solutions"
        secondaryLabel="Back to Solutions"
        title={`Implement ${solution.title}`}
      />
    </>
  );
}
