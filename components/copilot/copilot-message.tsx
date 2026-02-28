import Link from "next/link";
import { CopilotChatMessage } from "@/data/copilot";
import { highestRiskLevel } from "@/lib/copilot";
import { AIResponseSection } from "@/components/copilot/ai-response-section";
import { ConfidenceBadge } from "@/components/copilot/confidence-badge";
import { RiskBadge } from "@/components/copilot/risk-badge";

type CopilotMessageProps = {
  message: CopilotChatMessage;
};

export function CopilotMessage({ message }: CopilotMessageProps) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-3xl rounded-xl bg-primary px-4 py-3 text-sm text-white shadow-sm">{message.content}</div>
      </div>
    );
  }

  const response = message.response;
  if (!response) {
    return (
      <div className="max-w-4xl rounded-xl border border-border bg-surface p-4 text-sm text-muted shadow-sm">
        {message.content}
      </div>
    );
  }

  return (
    <div className="max-w-5xl rounded-xl border border-border bg-surface p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center rounded-full bg-[#eaf0ff] px-2.5 py-1 text-xs font-semibold text-primary">
          AI Compliance Output
        </span>
        <ConfidenceBadge value={response.confidence} />
        <RiskBadge level={highestRiskLevel(response.risks)} />
      </div>

      <div className="space-y-3">
        <AIResponseSection title="Summary">
          <p>{response.summary}</p>
        </AIResponseSection>

        <AIResponseSection title="Risk Areas">
          <ul className="space-y-2">
            {response.risks.map((risk) => (
              <li key={risk.title}>
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-text">{risk.title}</span>
                  <RiskBadge level={risk.level} />
                </div>
                <p className="text-sm text-muted">{risk.detail}</p>
              </li>
            ))}
          </ul>
        </AIResponseSection>

        <AIResponseSection title="Recommended Controls">
          <ul className="space-y-1">
            {response.recommendations.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </AIResponseSection>

        <AIResponseSection title="Mapping to Products">
          <div className="flex flex-wrap gap-2">
            {response.relatedProducts.map((product) => (
              <Link
                className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted transition-colors hover:border-primary/40 hover:text-primary"
                href={`/products/${product}`}
                key={product}
              >
                {product}
              </Link>
            ))}
          </div>
        </AIResponseSection>

        <AIResponseSection title="Control Query Snippet">
          <pre className="overflow-x-auto rounded-md border border-border bg-[#0f172a] p-3 text-xs text-[#cbd5e1]">
            <code>{response.querySnippet}</code>
          </pre>
        </AIResponseSection>
      </div>
    </div>
  );
}
