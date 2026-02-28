"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/button";
import { ComparisonTable } from "@/components/pricing/comparison-table";
import { FAQAccordion } from "@/components/pricing/faq-accordion";
import { BillingCycle, PricingCard, PricingPlan } from "@/components/pricing/pricing-card";
import { ROICalculator } from "@/components/pricing/roi-calculator";
import { cn } from "@/lib/utils";

const plans: PricingPlan[] = [
  {
    name: "Starter",
    description: "For emerging teams launching privacy controls with a focused compliance baseline.",
    monthlyPrice: 399,
    annualPrice: 339,
    features: ["Consent Management", "Basic Cookie Governance", "Regulation Wiki Access", "Email Support"],
    ctaLabel: "Start Free Trial",
    ctaHref: "/company/contact",
    secondaryCtaLabel: "Request Demo",
    secondaryCtaHref: "/company/contact"
  },
  {
    name: "Professional",
    description: "For scaling organizations automating privacy operations across products and jurisdictions.",
    monthlyPrice: 1299,
    annualPrice: 1104,
    features: [
      "Everything in Starter",
      "Data Discovery",
      "DSAR Automation",
      "AI Copilot (Limited)",
      "Audit Reports",
      "API Access"
    ],
    ctaLabel: "Request Demo",
    ctaHref: "/company/contact"
  },
  {
    name: "Enterprise",
    description: "For global enterprises needing advanced governance, security, and advisory partnership.",
    monthlyPrice: 3499,
    annualPrice: 2974,
    features: [
      "Everything in Professional",
      "AI Copilot Advanced",
      "Custom Regulation Mapping",
      "Dedicated Compliance Advisor",
      "SSO + RBAC",
      "Advanced Audit Ledger",
      "SLA"
    ],
    ctaLabel: "Request Demo",
    ctaHref: "/company/contact",
    highlighted: true,
    badge: "Most Popular"
  }
];

const faqs = [
  {
    question: "How does billing work across monthly and annual plans?",
    answer:
      "Monthly plans are billed each month. Annual plans are billed upfront with a 15% savings equivalent applied to the effective monthly rate."
  },
  {
    question: "Do you require annual contracts for Enterprise?",
    answer:
      "Enterprise agreements are typically annual to support advisory, SLA, and onboarding commitments, but we can align terms to procurement requirements."
  },
  {
    question: "Where is customer data stored?",
    answer:
      "Data residency and environment options are discussed during solution design. We support architecture patterns aligned with enterprise privacy and security requirements."
  },
  {
    question: "What onboarding support is included?",
    answer:
      "Professional includes structured onboarding. Enterprise includes a dedicated compliance advisor, implementation planning, and control mapping workshops."
  }
];

export function PricingContent() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("annual");

  const savings = useMemo(() => {
    const monthlyTotal = plans.reduce((sum, plan) => sum + plan.monthlyPrice, 0);
    const annualizedTotal = plans.reduce((sum, plan) => sum + plan.annualPrice, 0);
    return Math.round(((monthlyTotal - annualizedTotal) / monthlyTotal) * 100);
  }, []);

  return (
    <div className="space-y-14 lg:space-y-20">
      <section className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-primary">Pricing</p>
        <h1 className="mt-3 text-balance text-4xl font-bold tracking-tight text-text md:text-5xl">
          Transparent Pricing for Intelligent Compliance
        </h1>
        <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-muted md:text-lg">
          Scalable plans designed for startups, growth-stage teams, and global enterprises operating across complex
          regulatory environments.
        </p>
      </section>

      <section className="space-y-8">
        <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-border bg-surface p-1 shadow-sm">
          {([
            { label: "Monthly", value: "monthly" },
            { label: "Annual", value: "annual" }
          ] as const).map((option) => (
            <button
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                billingCycle === option.value ? "bg-primary text-white" : "text-muted hover:text-primary"
              )}
              key={option.value}
              onClick={() => setBillingCycle(option.value)}
              type="button"
            >
              {option.label}
            </button>
          ))}
          <span className="rounded-full bg-[#ebfbf9] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent">
            Save {savings}%
          </span>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {plans.map((plan) => (
            <PricingCard billingCycle={billingCycle} key={plan.name} plan={plan} />
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <div>
          <h2 className="text-3xl font-bold text-text">Feature Comparison</h2>
          <p className="mt-2 text-base text-muted">
            Compare capability depth across plans and choose the right compliance operating model.
          </p>
        </div>
        <ComparisonTable plans={plans} />
      </section>

      <section className="space-y-5">
        <div>
          <h2 className="text-3xl font-bold text-text">ROI Calculator</h2>
          <p className="mt-2 text-base text-muted">
            Estimate expected risk reduction and operational savings from automation.
          </p>
        </div>
        <ROICalculator />
      </section>

      <section className="rounded-xl border border-border bg-[#f8fafc] p-6 shadow-sm lg:p-8">
        <h2 className="text-3xl font-bold text-text">Built for Enterprise Trust</h2>
        <p className="mt-3 max-w-3xl text-base text-muted">
          Designed to support compliance-ready operations with secure architecture, governance controls, and auditable
          workflows.
        </p>
        <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {[
            "Encryption in transit and at rest",
            "Role-based access controls",
            "Audit-ready control evidence",
            "Compliance-focused onboarding"
          ].map((item) => (
            <div className="rounded-lg border border-border bg-surface px-4 py-3 text-sm text-muted" key={item}>
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-text">Frequently Asked Questions</h2>
            <p className="mt-2 text-base text-muted">Everything procurement and compliance teams usually ask before rollout.</p>
          </div>
          <Button href="/company/contact">Talk to Sales</Button>
        </div>
        <FAQAccordion items={faqs} />
      </section>
    </div>
  );
}
