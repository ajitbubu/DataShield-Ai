import { Metadata } from "next";
import { Container } from "@/components/container";
import { PricingContent } from "@/components/pricing/pricing-content";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Premium pricing for AI-powered compliance infrastructure across consent, discovery, DSAR automation, and enterprise governance."
};

export default function PricingPage() {
  return (
    <section className="bg-background py-14 lg:py-20">
      <Container>
        <PricingContent />
      </Container>
    </section>
  );
}
