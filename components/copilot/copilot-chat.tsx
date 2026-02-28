"use client";

import { FormEvent, useMemo, useState } from "react";
import { CopilotChatMessage } from "@/data/copilot";
import { CopilotMessage } from "@/components/copilot/copilot-message";

type CopilotChatProps = {
  messages: CopilotChatMessage[];
  isAnalyzing: boolean;
  onSubmit: (question: string) => Promise<void>;
};

export function CopilotChat({ messages, isAnalyzing, onSubmit }: CopilotChatProps) {
  const [input, setInput] = useState("");
  const [policyText, setPolicyText] = useState("");
  const [showPolicyInput, setShowPolicyInput] = useState(false);

  const disabled = useMemo(() => isAnalyzing || input.trim().length < 5, [isAnalyzing, input]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const question = input.trim();
    if (question.length < 5) {
      return;
    }

    const finalQuestion =
      policyText.trim().length > 0
        ? `${question}\n\nPolicy context:\n${policyText.trim().slice(0, 1200)}`
        : question;

    setInput("");
    await onSubmit(finalQuestion);
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-6">
        {messages.map((message) => (
          <CopilotMessage key={message.id} message={message} />
        ))}

        {isAnalyzing ? (
          <div className="max-w-4xl rounded-xl border border-border bg-surface p-5 shadow-sm">
            <p className="text-sm font-semibold text-primary">AI is analyzing...</p>
            <div className="mt-3 space-y-2">
              <div className="h-3 w-full animate-pulse rounded bg-[#e6edf8]" />
              <div className="h-3 w-5/6 animate-pulse rounded bg-[#e6edf8]" />
              <div className="h-3 w-3/5 animate-pulse rounded bg-[#e6edf8]" />
            </div>
          </div>
        ) : null}
      </div>

      <div className="sticky bottom-0 border-t border-border bg-background/95 px-4 py-4 backdrop-blur sm:px-6">
        <form className="space-y-3" onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor="copilot-question">
            Ask compliance question
          </label>
          <textarea
            className="h-24 w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text transition-all placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-highlight"
            id="copilot-question"
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask about obligations, risks, controls, or implementation gaps..."
            value={input}
          />
          <button
            className="text-xs font-semibold uppercase tracking-wide text-primary transition-colors hover:text-highlight"
            onClick={() => setShowPolicyInput((prev) => !prev)}
            type="button"
          >
            {showPolicyInput ? "Hide Policy Text Upload" : "Upload Internal Policy Text (Mock)"}
          </button>
          {showPolicyInput ? (
            <textarea
              className="h-20 w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text transition-all placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-highlight"
              onChange={(event) => setPolicyText(event.target.value)}
              placeholder="Paste internal policy excerpt to include in analysis..."
              value={policyText}
            />
          ) : null}
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-muted">Responses are mock-generated and ready for LLM integration later.</p>
            <button
              className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#17215f] disabled:cursor-not-allowed disabled:opacity-50"
              disabled={disabled}
              type="submit"
            >
              Analyze
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
