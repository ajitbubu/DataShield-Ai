import Link from "next/link";
import { CopilotRegulation, CopilotSession } from "@/data/copilot";
import { RegulationSelector } from "@/components/copilot/regulation-selector";
import { cn } from "@/lib/utils";

type CopilotSidebarProps = {
  sessions: CopilotSession[];
  activeSessionId?: string;
  templates: readonly string[];
  regulations: CopilotRegulation[];
  selectedRegulation: CopilotRegulation;
  onRegulationChange: (value: CopilotRegulation) => void;
  onNewSession: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
};

export function CopilotSidebar({
  sessions,
  activeSessionId,
  templates,
  regulations,
  selectedRegulation,
  onRegulationChange,
  onNewSession,
  collapsed,
  onToggleCollapse
}: CopilotSidebarProps) {
  return (
    <aside
      className={cn(
        "hidden border-r border-border bg-surface lg:flex lg:flex-col",
        collapsed ? "w-20" : "w-80"
      )}
    >
      <div className="flex items-center justify-between border-b border-border p-4">
        {collapsed ? null : <p className="text-sm font-semibold text-text">AI Compliance Copilot</p>}
        <button
          className="rounded-md border border-border p-1.5 text-xs text-muted transition-colors hover:text-primary"
          onClick={onToggleCollapse}
          type="button"
        >
          {collapsed ? "→" : "←"}
        </button>
      </div>

      <div className="space-y-4 p-4">
        <button
          className="w-full rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#17215f]"
          onClick={onNewSession}
          type="button"
        >
          {collapsed ? "+" : "New Session"}
        </button>

        {!collapsed ? (
          <RegulationSelector onChange={onRegulationChange} options={regulations} value={selectedRegulation} />
        ) : null}
      </div>

      {!collapsed ? (
        <>
          <div className="border-t border-border px-4 pt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Session History</p>
          </div>
          <div className="min-h-0 flex-1 space-y-2 overflow-y-auto px-4 py-3">
            {sessions.map((session) => (
              <Link
                className={cn(
                  "block rounded-lg border px-3 py-2 transition-all",
                  activeSessionId === session.id
                    ? "border-primary bg-[#eaf0ff]"
                    : "border-border bg-background hover:border-primary/30"
                )}
                href={`/copilot/session/${session.id}`}
                key={session.id}
              >
                <p className="truncate text-sm font-semibold text-text">{session.title}</p>
                <p className="mt-1 line-clamp-2 text-xs text-muted">{session.preview}</p>
              </Link>
            ))}
          </div>

          <div className="border-t border-border p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Saved Templates</p>
            <ul className="space-y-1.5">
              {templates.map((template) => (
                <li className="rounded-md border border-border bg-background px-3 py-2 text-xs text-muted" key={template}>
                  {template}
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : null}
    </aside>
  );
}
