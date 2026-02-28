import { Metadata } from "next";
import { Container } from "@/components/container";
import { RegulationExplorer } from "@/components/regulation-explorer";
import { getPopularRegulations, getRecentlyUpdatedRegulations, regulations } from "@/data/regulations";

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export const metadata: Metadata = {
  title: "Regulation Search",
  description: "Search privacy regulations by title, tags, and legal summary."
};

export default async function RegulationSearchPage({ searchParams }: Props) {
  const params = await searchParams;
  const initialQuery = params.q?.trim() ?? "";

  return (
    <section className="py-14 lg:py-20">
      <Container>
        <header className="mb-10 space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-primary">Regulation Wiki</p>
          <h1 className="text-4xl font-bold tracking-tight text-text md:text-5xl">Search Regulations</h1>
          <p className="max-w-2xl text-base text-muted">
            Find regulations by keywords, tags, and summaries with region and category filters.
          </p>
        </header>

        <RegulationExplorer
          initialQuery={initialQuery}
          regulations={regulations}
          sidebarData={{
            quickLinks: regulations.slice(0, 4),
            recentlyUpdated: getRecentlyUpdatedRegulations(3),
            popular: getPopularRegulations(3)
          }}
          showSidebar
        />
      </Container>
    </section>
  );
}
