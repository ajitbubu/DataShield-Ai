import { Metadata } from "next";
import { Container } from "@/components/container";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "DataPrivacy Shield privacy policy overview."
};

export default function PrivacyPage() {
  return (
    <section className="py-16 sm:py-20">
      <Container className="max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight text-text">Privacy Policy</h1>
        <p className="mt-4 text-base text-muted">
          This is a placeholder legal page. Add your complete privacy notice, lawful basis details, retention terms, and contact channels.
        </p>
      </Container>
    </section>
  );
}
