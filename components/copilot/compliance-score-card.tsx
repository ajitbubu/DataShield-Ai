import { CopilotResponse } from "@/data/copilot";

type ComplianceScoreCardProps = {
  response?: CopilotResponse;
};

export function ComplianceScoreCard({ response }: ComplianceScoreCardProps) {
  const score = response?.complianceScore ?? 0;
  const tone = score >= 80 ? "bg-success" : score >= 60 ? "bg-warning" : "bg-danger";

  return (
    <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">Compliance Score</h3>
      <p className="mt-3 text-3xl font-bold text-text">{score}%</p>
      <div className="mt-4 h-2.5 rounded-full bg-[#e8edf6]">
        <div className={`h-2.5 rounded-full ${tone}`} style={{ width: `${score}%` }} />
      </div>
      <p className="mt-3 text-xs text-muted">
        Score reflects current AI assessment confidence and risk profile from this session output.
      </p>
    </div>
  );
}
