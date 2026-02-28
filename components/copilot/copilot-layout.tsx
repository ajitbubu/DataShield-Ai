"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CopilotChatMessage,
  CopilotRegulation,
  CopilotResponse,
  CopilotSession,
  RiskLevel
} from "@/data/copilot";
import { highestRiskLevel } from "@/lib/copilot";
import { CopilotChat } from "@/components/copilot/copilot-chat";
import { CopilotSidebar } from "@/components/copilot/copilot-sidebar";
import { ComplianceScoreCard } from "@/components/copilot/compliance-score-card";
import { ConfidenceBadge } from "@/components/copilot/confidence-badge";
import { RiskBadge } from "@/components/copilot/risk-badge";
import { RegulationSelector } from "@/components/copilot/regulation-selector";
import { cn } from "@/lib/utils";

type CopilotLayoutProps = {
  sessions: CopilotSession[];
  initialSession: CopilotSession;
  regulations: CopilotRegulation[];
  templates: readonly string[];
};

function latestAssistantResponse(messages: CopilotChatMessage[]): CopilotResponse | undefined {
  return [...messages].reverse().find((message) => message.role === "assistant" && message.response)?.response;
}

export function CopilotLayout({ sessions, initialSession, regulations, templates }: CopilotLayoutProps) {
  const router = useRouter();

  const [selectedRegulation, setSelectedRegulation] = useState<CopilotRegulation>(initialSession.regulation);
  const [messages, setMessages] = useState<CopilotChatMessage[]>(initialSession.messages);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [panelCollapsed, setPanelCollapsed] = useState(false);

  const latestResponse = useMemo(() => latestAssistantResponse(messages), [messages]);
  const riskLevel: RiskLevel = latestResponse ? highestRiskLevel(latestResponse.risks) : "Low";

  async function handleSend(question: string) {
    const userMessage: CopilotChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: question,
      createdAt: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsAnalyzing(true);

    try {
      const response = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, regulation: selectedRegulation })
      });

      if (!response.ok) {
        throw new Error("Failed to analyze question");
      }

      const payload = (await response.json()) as CopilotResponse;

      const assistantMessage: CopilotChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: "AI compliance output generated.",
        createdAt: new Date().toISOString(),
        response: payload
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const fallbackMessage: CopilotChatMessage = {
        id: `assistant-error-${Date.now()}`,
        role: "assistant",
        content: "Unable to process this request right now. Please retry.",
        createdAt: new Date().toISOString()
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsAnalyzing(false);
    }
  }

  function handleNewSession() {
    setMessages([]);
    router.push("/copilot");
  }

  return (
    <div className="flex h-screen bg-background text-text">
      <CopilotSidebar
        activeSessionId={initialSession.id}
        collapsed={sidebarCollapsed}
        onNewSession={handleNewSession}
        onRegulationChange={setSelectedRegulation}
        onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
        regulations={regulations}
        selectedRegulation={selectedRegulation}
        sessions={sessions}
        templates={templates}
      />

      <div className="flex min-w-0 flex-1 flex-col lg:flex-row">
        <section className="flex min-w-0 flex-1 flex-col border-r border-border/60">
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-surface px-4 py-3 sm:px-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">Regulation Context</p>
              <h1 className="text-lg font-semibold text-text">{selectedRegulation} Compliance Workspace</h1>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="lg:hidden">
                <RegulationSelector
                  onChange={setSelectedRegulation}
                  options={regulations}
                  value={selectedRegulation}
                />
              </div>
              {latestResponse ? <ConfidenceBadge value={latestResponse.confidence} /> : null}
              <RiskBadge level={riskLevel} />
              <button
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted transition-colors hover:text-primary"
                onClick={() => setPanelCollapsed((prev) => !prev)}
                type="button"
              >
                {panelCollapsed ? "Show Insights" : "Hide Insights"}
              </button>
            </div>
          </header>

          <CopilotChat isAnalyzing={isAnalyzing} messages={messages} onSubmit={handleSend} />
        </section>

        <aside
          className={cn(
            "hidden border-l border-border bg-surface p-4 lg:block lg:w-80",
            panelCollapsed ? "lg:hidden" : ""
          )}
        >
          <div className="space-y-4">
            <ComplianceScoreCard response={latestResponse} />

            <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">Referenced Legal Articles</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted">
                {(latestResponse?.legalReferences ?? ["Awaiting analysis output"]).map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">Suggested Next Actions</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted">
                {(latestResponse?.nextActions ?? ["Submit a question to generate action recommendations"]).map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>

            <button className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm font-semibold text-primary transition-colors hover:border-primary/40">
              Download Report (UI)
            </button>
            <Link
              className="block text-center text-sm font-semibold text-muted transition-colors hover:text-primary"
              href="/copilot/history"
            >
              Open Session History
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
