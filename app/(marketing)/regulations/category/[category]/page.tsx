import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/container";
import { RegulationExplorer } from "@/components/regulation-explorer";
import {
  getPopularRegulations,
  getRegulationCategoryFromSlug,
  getRegulationCategorySlug,
  getRegulationsByCategory,
  getRecentlyUpdatedRegulations,
  regulationCategories
} from "@/data/regulations";

type Props = {
  params: Promise<{ category: string }>;
};

export async function generateStaticParams() {
  return regulationCategories.map((category) => ({ category: getRegulationCategorySlug(category) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = getRegulationCategoryFromSlug(categorySlug);

  if (!category) {
    return { title: "Category Not Found" };
  }

  return {
    title: `${category} Regulation Guides`,
    description: `Explore ${category.toLowerCase()} privacy regulations with implementation guidance and control mapping.`
  };
}

export default async function RegulationCategoryPage({ params }: Props) {
  const { category: categorySlug } = await params;
  const category = getRegulationCategoryFromSlug(categorySlug);

  if (!category) {
    notFound();
  }

  const categoryItems = getRegulationsByCategory(category);

  return (
    <section className="py-14 lg:py-20">
      <Container>
        <header className="mb-10 space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-primary">Regulation Category</p>
          <h1 className="text-4xl font-bold tracking-tight text-text md:text-5xl">{category} Regulations</h1>
          <p className="max-w-3xl text-base leading-7 text-muted">
            Curated enterprise education for {category.toLowerCase()} privacy rules, with structured legal requirements
            and implementation controls.
          </p>
        </header>

        <RegulationExplorer
          initialCategory={category}
          lockCategory
          regulations={categoryItems}
          sidebarData={{
            quickLinks: categoryItems.slice(0, 4),
            recentlyUpdated: getRecentlyUpdatedRegulations(3),
            popular: getPopularRegulations(3)
          }}
          showSidebar
        />
      </Container>
    </section>
  );
}
