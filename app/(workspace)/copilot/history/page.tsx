import Link from "next/link";
import { Container } from "@/components/container";
import { copilotSessions } from "@/data/copilot";

export default function CopilotHistoryPage() {
  return (
    <section className="min-h-screen bg-background py-14 lg:py-20">
      <Container>
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">AI Compliance Copilot</p>
            <h1 className="text-4xl font-bold text-text">Session History</h1>
            <p className="mt-2 text-sm text-muted">Review previous analyses and reopen structured compliance sessions.</p>
          </div>
          <Link
            className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#17215f]"
            href="/copilot"
          >
            Back to Workspace
          </Link>
        </header>

        <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-[#f8fafc]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted">Session</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted">Regulation</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted">Last Updated</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {copilotSessions.map((session) => (
                <tr className="hover:bg-[#fbfdff]" key={session.id}>
                  <td className="px-4 py-4">
                    <p className="text-sm font-semibold text-text">{session.title}</p>
                    <p className="mt-1 text-xs text-muted">{session.preview}</p>
                  </td>
                  <td className="px-4 py-4 text-sm text-muted">{session.regulation}</td>
                  <td className="px-4 py-4 text-sm text-muted">{new Date(session.updatedAt).toLocaleString()}</td>
                  <td className="px-4 py-4">
                    <Link
                      className="text-sm font-semibold text-primary transition-colors hover:text-highlight"
                      href={`/copilot/session/${session.id}`}
                    >
                      Open Session →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
    </section>
  );
}
