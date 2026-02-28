import { Metadata } from "next";
import { Card } from "@/components/card";
import { Container } from "@/components/container";

export const metadata: Metadata = {
  title: "Security",
  description: "Security overview and trust architecture for DataPrivacy Shield."
};

export default function SecurityPage() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <h1 className="text-4xl font-bold tracking-tight text-text">Security & Trust</h1>
        <p className="mt-4 max-w-3xl text-lg text-muted">
          DataPrivacy Shield is designed to support SOC 2-aligned controls with enterprise-grade access governance,
          encryption, and auditability.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[
            ["Encryption", "TLS in transit and encryption at rest with managed key lifecycle controls."],
            ["Access Controls", "RBAC model with least-privilege defaults and environment-level segregation."],
            ["Audit Trails", "Tamper-evident event logs for policy changes, access, and workflow activity."],
            ["Data Minimization", "Retention-aware workflows and scoped processing to reduce unnecessary exposure."],
            ["Operational Monitoring", "Continuous policy drift monitoring and alerting for governance gaps."],
            ["Resilience", "Redundancy and recovery practices for high-availability enterprise workloads."]
          ].map(([title, body]) => (
            <Card key={title}>
              <h2 className="text-lg font-semibold text-text">{title}</h2>
              <p className="mt-2 text-sm text-muted">{body}</p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
