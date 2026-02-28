import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/button";
import { Container } from "@/components/container";
import { NeuralConsentHero } from "@/components/NeuralConsentHero";
import { products } from "@/data/products";

export const metadata: Metadata = {
  title: "Compliance Heatmap for Your Digital Footprint",
  description:
    "Detect risk, enforce consent, and prove compliance globally with DataPrivacy Shield's AI-powered privacy intelligence platform."
};

const pillars = [
  {
    title: "Consent & Preference Management",
    description: "Orchestrate user preferences across channels with region-aware policy controls.",
    icon: "◍"
  },
  {
    title: "Data Discovery & Classification",
    description: "Find and classify sensitive data continuously across cloud and SaaS systems.",
    icon: "◎"
  },
  {
    title: "AI Compliance Copilot",
    description: "Translate regulatory obligations into practical controls and rollout actions.",
    icon: "◈"
  },
  {
    title: "Enforcement & Audit Evidence",
    description: "Prove control execution with immutable logs and real-time evidence snapshots.",
    icon: "◉"
  }
];

const aiFlow = ["Detect", "Classify", "Decide", "Enforce", "Audit"];

const regulationCards = [
  {
    name: "GDPR",
    href: "/regulations/gdpr",
    description: "EU privacy framework for lawful processing and rights."
  },
  {
    name: "CPRA",
    href: "/regulations/cpra-ccpa",
    description: "California rights model for transparency and opt-out control."
  },
  {
    name: "DPDP",
    href: "/regulations/dpdp",
    description: "India digital data protection obligations and consent duties."
  },
  {
    name: "HIPAA",
    href: "/regulations/hipaa",
    description: "Healthcare safeguard requirements for PHI governance."
  }
];

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "DataPrivacy Shield",
  url: "https://dataprivacyshield.com",
  description: "AI-powered privacy infrastructure for enterprise teams.",
  logo: "https://dataprivacyshield.com/logo.png"
};

function IconCircle({ label }: { label: string }) {
  return (
    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#dbe8ff] to-[#d9f6f1] text-sm font-bold text-primary">
      {label}
    </span>
  );
}

export default function HomePage() {
  const featuredProducts = products.slice(0, 6);

  return (
    <>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        type="application/ld+json"
      />

      <section className="relative isolate min-h-[90vh] overflow-hidden bg-[#050b21] pb-14 pt-12 lg:pb-20 lg:pt-20">
        <NeuralConsentHero className="absolute inset-0" consentState="mixed" density="medium" interactive seed={2026} />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_18%_0%,rgba(59,130,246,0.22),transparent_46%),radial-gradient(ellipse_at_82%_18%,rgba(24,182,164,0.14),transparent_44%),linear-gradient(to_bottom,rgba(6,11,31,0.28),rgba(6,11,31,0.72))]"
        />

        <Container className="relative z-10">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-[#9FC3FF]">
                AI-Powered Privacy Intelligence
              </p>
              <h1 className="max-w-[640px] text-4xl font-bold leading-tight text-white md:text-5xl">
                Automate Consent. Reduce Risk. Prove Compliance.
              </h1>
              <p className="mt-6 max-w-[620px] text-base leading-7 text-[#C3D3F7] md:text-lg">
                Detect risk continuously, enforce consent decisions across systems, and maintain audit-ready evidence
                for global compliance programs.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button href="/company/contact">Request Demo</Button>
                <Button href="/regulations" variant="secondary">
                  Explore Regulations
                </Button>
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                {["GDPR", "CPRA", "DPDP", "HIPAA"].map((badge) => (
                  <span
                    className="rounded-full border border-[#9FC3FF]/30 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#D8E6FF] backdrop-blur-xl"
                    key={badge}
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -right-2 -top-4 z-10 rounded-xl border border-[#9de4db]/35 bg-[#0d2f36]/85 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#b9efe8] shadow-lg backdrop-blur">
                Policy Core • Mixed Consent State
              </div>
              <div className="absolute inset-0 -z-10 rounded-[28px] bg-gradient-to-br from-highlight/30 via-accent/10 to-transparent blur-2xl" />
              <div className="rounded-2xl border border-white/20 bg-white/90 p-5 shadow-sm backdrop-blur sm:p-6">
                <div className="rounded-xl border border-border bg-background p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">Policy Core</p>
                  <p className="mt-2 text-sm font-semibold text-text">Consent signals → Rule decision → Enforcement</p>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted">Summary</span>
                      <span className="font-semibold text-text">Routing stable across essential paths</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted">Risks</span>
                      <span className="font-semibold text-warning">3 blocked analytics routes</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted">Controls</span>
                      <span className="font-semibold text-primary">Policy v12 active</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted">Confidence</span>
                      <span className="rounded-full bg-highlight/15 px-2 py-0.5 font-semibold text-highlight">92%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>

      </section>

      <section className="border-y border-border bg-surface/80 py-8">
        <Container>
          <div className="flex flex-col items-center gap-5 lg:flex-row lg:justify-between">
            <p className="text-sm font-semibold text-muted">Trusted by modern enterprises</p>
            <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3 lg:w-auto lg:grid-cols-6">
              {["Nexora", "CloudCore", "HealthAxis", "RetailOne", "LedgerIQ", "ScaleWorks"].map((logo) => (
                <div
                  className="rounded-lg border border-border bg-background px-4 py-2 text-center text-xs font-semibold text-muted grayscale"
                  key={logo}
                >
                  {logo}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="py-14 lg:py-20">
        <Container>
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-text">Platform Pillars</h2>
            <p className="mx-auto mt-3 max-w-2xl text-base text-muted">
              A modern privacy operating layer built for legal, security, and engineering collaboration.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {pillars.map((pillar) => (
              <article
                className="rounded-xl border border-border bg-surface p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                key={pillar.title}
              >
                <IconCircle label={pillar.icon} />
                <h3 className="mt-4 text-xl font-semibold text-text">{pillar.title}</h3>
                <p className="mt-3 max-w-md text-sm leading-6 text-muted">{pillar.description}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-14 lg:py-20">
        <Container>
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-text">How AI Works</h2>
            <p className="mx-auto mt-3 max-w-2xl text-base text-muted">
              Privacy automation that continuously detects risk, decides policy, and enforces controls.
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-0 right-0 top-8 hidden h-px bg-border lg:block" />
            <div className="grid gap-4 lg:grid-cols-5">
              {aiFlow.map((step, index) => (
                <div
                  className="relative rounded-xl border border-border bg-surface p-5 shadow-sm transition-all duration-200 hover:shadow-lg"
                  key={step}
                >
                  <div className="mb-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#edf2ff] text-sm font-semibold text-primary">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-semibold text-text">{step}</h3>
                  <p className="mt-2 text-sm text-muted">
                    {step === "Detect" && "Discover signals from consent, tracking, and data access activity."}
                    {step === "Classify" && "Classify data and events by sensitivity and regulatory impact."}
                    {step === "Decide" && "Apply AI policy logic with mapped control requirements."}
                    {step === "Enforce" && "Trigger technical controls across integrated systems instantly."}
                    {step === "Audit" && "Record evidence trails and export audit-ready timelines."}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="py-14 lg:py-20">
        <Container>
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-text">Featured Products</h2>
              <p className="mt-3 text-base text-muted">Six core modules designed for enterprise privacy operations.</p>
            </div>
            <Button className="hidden sm:inline-flex" href="/products" variant="ghost">
              View All Products
            </Button>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((product, index) => (
              <article
                className="rounded-xl border border-border bg-surface p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-highlight/40 hover:shadow-lg"
                key={product.slug}
              >
                <IconCircle label={`0${index + 1}`} />
                <h3 className="mt-4 text-xl font-semibold text-text">{product.title}</h3>
                <ul className="mt-4 space-y-2 text-sm text-muted">
                  {product.features.slice(0, 3).map((feature) => (
                    <li key={feature}>• {feature}</li>
                  ))}
                </ul>
                <Link
                  className="mt-6 inline-flex text-sm font-semibold text-primary transition-colors hover:text-highlight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-highlight"
                  href={`/products/${product.slug}`}
                >
                  Learn More →
                </Link>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-14 lg:py-20">
        <Container>
          <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
            <div>
              <h2 className="text-3xl font-bold text-text">Regulation Wiki for Global Privacy Teams</h2>
              <p className="mt-4 max-w-lg text-base leading-7 text-muted">
                Navigate GDPR, CPRA, DPDP, and HIPAA requirements with practical implementation notes, consent
                implications, and control mapping guidance.
              </p>
              <Button className="mt-8" href="/regulations" variant="secondary">
                Explore Regulations
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {regulationCards.map((regulation) => (
                <Link
                  className="rounded-xl border border-border bg-surface p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-highlight"
                  href={regulation.href}
                  key={regulation.name}
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary">Regulation</p>
                  <h3 className="mt-2 text-xl font-semibold text-text">{regulation.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{regulation.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-[#eef2f7] py-14 lg:py-20">
        <Container>
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-text">Customer Pain Points</h2>
              <p className="mt-3 text-base text-muted">What enterprise teams report as their highest privacy ops friction.</p>
            </div>
            <Link
              className="text-sm font-semibold text-primary transition-colors hover:text-highlight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-highlight"
              href="/feedback"
            >
              Share your pain point →
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              "Consent updates fail to propagate across mobile, web, and CDP systems in real time.",
              "DSAR responses require manual evidence gathering from disconnected tools and teams.",
              "Marketing trackers reappear after releases and silently break regional compliance settings."
            ].map((pain) => (
              <article className="rounded-xl border border-border bg-surface p-6 shadow-sm" key={pain}>
                <p className="text-sm leading-7 text-muted">“{pain}”</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-primary py-14 lg:py-20">
        <Container>
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold text-white">Security Architecture Built for Enterprise Trust</h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-[#dbe3ff]">
                Designed for SOC 2-aligned control objectives with robust access governance and continuously verifiable
                operational evidence.
              </p>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {[
                "Encryption at rest",
                "RBAC",
                "Audit logs",
                "AI monitoring"
              ].map((item) => (
                <li
                  className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-medium text-white backdrop-blur"
                  key={item}
                >
                  <span className="mr-2 text-accent">●</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <section className="py-14 lg:py-20">
        <Container className="text-center">
          <h2 className="mx-auto max-w-3xl text-3xl font-bold text-text">
            Bring AI-powered privacy automation into your enterprise workflow.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted">
            Align legal, security, and engineering teams with a single privacy control plane.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href="/company/contact">Request Demo</Button>
            <Button href="/products" variant="ghost">
              Explore Products
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
