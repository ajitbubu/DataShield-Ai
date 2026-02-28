import type { Metadata } from "next";
import Link from "next/link";
import { ComingSoonCard } from "@/components/ComingSoonCard";
import { NeuralBackdrop } from "@/components/NeuralBackdrop";

export const metadata: Metadata = {
  title: "DataShield-AI | Coming Soon",
  description: "AI-powered privacy intelligence and automated compliance platform launching soon.",
  openGraph: {
    title: "DataShield-AI | Coming Soon",
    description: "AI-powered privacy intelligence and automated compliance platform launching soon.",
    type: "website",
    url: "https://datashield-ai.com"
  },
  twitter: {
    card: "summary_large_image",
    title: "DataShield-AI | Coming Soon",
    description: "AI-powered privacy intelligence and automated compliance platform launching soon."
  }
};

export default function HomePage() {
  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-[#0B1220]">
      <NeuralBackdrop className="absolute inset-0" density="medium" seed={2026} />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(11,18,32,0.22),rgba(11,18,32,0.56)_58%,rgba(11,18,32,0.82))]"
      />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1200px] flex-col items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <ComingSoonCard />

        <footer className="mt-8 text-center text-sm text-[#C6D5FA]">
          <div className="flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-5">
            <span>© 2026 DataShield-AI</span>
            <Link className="transition-colors hover:text-white" href="/legal/privacy">
              Privacy policy
            </Link>
            <a className="transition-colors hover:text-white" href="mailto:hello@datashield-ai.com">
              hello@datashield-ai.com
            </a>
          </div>
        </footer>
      </div>
    </section>
  );
}
