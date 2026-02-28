import { PricingPlan } from "@/components/pricing/pricing-card";

type ComparisonTableProps = {
  plans: PricingPlan[];
};

type Row = {
  label: string;
  starter: string;
  professional: string;
  enterprise: string;
};

const rows: Row[] = [
  { label: "Consent Enforcement", starter: "Included", professional: "Advanced", enterprise: "Advanced + regional policies" },
  { label: "Cookie Blocking", starter: "Basic", professional: "Automated", enterprise: "Continuous + drift alerts" },
  { label: "DSAR Automation", starter: "-", professional: "Included", enterprise: "Included + SLA workflows" },
  { label: "AI Compliance Copilot", starter: "-", professional: "Limited", enterprise: "Advanced" },
  { label: "Audit Logs", starter: "Standard", professional: "Extended", enterprise: "Advanced audit ledger" },
  { label: "API Access", starter: "-", professional: "Included", enterprise: "Included" },
  { label: "SSO", starter: "-", professional: "-", enterprise: "Included" },
  { label: "Dedicated Support", starter: "Email", professional: "Priority", enterprise: "Dedicated advisor" }
];

function cell(value: string) {
  if (value === "-") {
    return <span className="text-muted">-</span>;
  }

  return <span className="text-text">{value}</span>;
}

export function ComparisonTable({ plans }: ComparisonTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-[#f8fafc]">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-muted">Capability</th>
              {plans.map((plan) => (
                <th className="px-4 py-3 text-left font-semibold text-text" key={plan.name}>
                  {plan.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((row) => (
              <tr key={row.label}>
                <td className="px-4 py-3 font-medium text-text">{row.label}</td>
                <td className="px-4 py-3">{cell(row.starter)}</td>
                <td className="px-4 py-3">{cell(row.professional)}</td>
                <td className="px-4 py-3">{cell(row.enterprise)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
