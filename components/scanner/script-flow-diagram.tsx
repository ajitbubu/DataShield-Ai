import { ScriptFlowNode } from "@/data/scanner";

type ScriptFlowDiagramProps = {
  flows: ScriptFlowNode[];
};

export function ScriptFlowDiagram({ flows }: ScriptFlowDiagramProps) {
  return (
    <section className="rounded-xl border border-border bg-surface p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-xl font-semibold text-text dark:text-slate-100">Script Behavior Visualization</h3>
          <p className="mt-1 text-sm text-muted dark:text-slate-300">
            Page Load → Script → Cookie → Data Endpoint with pre-consent and third-party call detection.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {flows.map((flow) => (
          <div className="grid gap-2 sm:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr]" key={flow.id}>
            <div className="rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold text-text dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
              Page Load
            </div>
            <span className="self-center text-muted">→</span>
            <div className="rounded-lg border border-border bg-background px-3 py-2 text-xs text-muted dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
              {flow.script}
            </div>
            <span className="self-center text-muted">→</span>
            <div className="rounded-lg border border-border bg-background px-3 py-2 text-xs text-muted dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
              {flow.cookie}
            </div>
            <span className="self-center text-muted">→</span>
            <div className="rounded-lg border border-border bg-background px-3 py-2 text-xs text-muted dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
              {flow.endpoint}
            </div>
            <div className="sm:col-span-full flex flex-wrap gap-2">
              <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${flow.preConsentFired ? "bg-danger/15 text-danger" : "bg-success/15 text-success"}`}>
                {flow.preConsentFired ? "Pre-consent fired" : "Consent-gated"}
              </span>
              <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${flow.thirdPartyCall ? "bg-warning/15 text-warning" : "bg-[#eaf0ff] text-primary"}`}>
                {flow.thirdPartyCall ? "Third-party call" : "First-party endpoint"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
