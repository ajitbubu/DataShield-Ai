import { Metadata } from "next";
import { Card } from "@/components/card";
import { Container } from "@/components/container";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about DataPrivacy Shield and our mission to modernize privacy operations."
};

export default function AboutPage() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <h1 className="text-4xl font-bold tracking-tight text-text">About DataPrivacy Shield</h1>
        <p className="mt-4 max-w-3xl text-lg text-muted">
          We build AI-powered privacy infrastructure that helps enterprises automate compliance operations without
          slowing product velocity.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <Card>
            <h2 className="text-lg font-semibold text-text">Mission</h2>
            <p className="mt-2 text-sm text-muted">Make privacy operations proactive, measurable, and engineering-friendly.</p>
          </Card>
          <Card>
            <h2 className="text-lg font-semibold text-text">Approach</h2>
            <p className="mt-2 text-sm text-muted">Combine policy intelligence, workflow automation, and auditable evidence at scale.</p>
          </Card>
          <Card>
            <h2 className="text-lg font-semibold text-text">Customers</h2>
            <p className="mt-2 text-sm text-muted">Privacy, security, and engineering leaders in regulated and data-intensive industries.</p>
          </Card>
        </div>
      </Container>
    </section>
  );
}
