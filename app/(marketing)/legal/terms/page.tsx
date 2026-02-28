import { Metadata } from "next";
import { Container } from "@/components/container";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "DataPrivacy Shield terms of service overview."
};

export default function TermsPage() {
  return (
    <section className="py-16 sm:py-20">
      <Container className="max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight text-text">Terms of Service</h1>
        <p className="mt-4 text-base text-muted">
          This is a placeholder legal page. Add your complete service terms, billing terms, obligations, and limitation clauses.
        </p>
      </Container>
    </section>
  );
}
