import type { Metadata } from "next";
import { ComingSoonHero } from "@/components/ComingSoonHero";

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
  return <ComingSoonHero />;
}
