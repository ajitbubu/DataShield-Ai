import { Metadata } from "next";
import { Container } from "@/components/container";
import { RegulationExplorer } from "@/components/regulation-explorer";
import { getPopularRegulations, getRecentlyUpdatedRegulations, regulations } from "@/data/regulations";

export const metadata: Metadata = {
  title: "Global Privacy Regulation Knowledge Hub",
  description:
    "Enterprise regulation wiki with searchable guides, category filters, and implementation mapping for GDPR, CPRA, DPDP, HIPAA, GLBA, and more."
};

export default function RegulationsPage() {
  return (
    <section className="py-14 lg:py-20">
      <Container>
        <header className="mb-10 space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-primary">Regulation Wiki</p>
          <h1 className="text-4xl font-bold tracking-tight text-text md:text-5xl">
            Global Privacy Regulation Knowledge Hub
          </h1>
          <p className="max-w-3xl text-base leading-7 text-muted md:text-lg">
            Structured education for enterprise privacy teams with practical compliance breakdowns, control mapping,
            and cross-linked regulation intelligence.
          </p>
        </header>

        <RegulationExplorer
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
