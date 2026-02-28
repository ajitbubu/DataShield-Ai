import Link from "next/link";
import { Container } from "@/components/container";
import { RiskScoreBadge } from "@/components/scanner/risk-score-badge";
import { scanHistory } from "@/data/scanner";

export default function ScannerHistoryPage() {
  return (
    <section className="min-h-screen bg-background py-14 dark:bg-slate-950 lg:py-20">
      <Container>
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-primary">Cookie Scanner</p>
            <h1 className="text-4xl font-bold text-text dark:text-slate-100">Scan History</h1>
            <p className="mt-2 text-sm text-muted dark:text-slate-300">
              Review historical scans and compare AI-driven privacy exposure over time.
            </p>
          </div>
          <Link
            className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#17215f]"
            href="/scanner"
          >
            Back to Dashboard
          </Link>
        </header>

        <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <table className="min-w-full divide-y divide-border text-sm dark:divide-slate-800">
            <thead className="bg-[#f8fafc] dark:bg-slate-900">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-muted">Domain</th>
                <th className="px-4 py-3 text-left font-semibold text-muted">Scan Timestamp</th>
                <th className="px-4 py-3 text-left font-semibold text-muted">Risk</th>
                <th className="px-4 py-3 text-left font-semibold text-muted">Violations</th>
                <th className="px-4 py-3 text-left font-semibold text-muted">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border dark:divide-slate-800">
              {scanHistory.map((scan) => (
                <tr className="hover:bg-[#fbfdff] dark:hover:bg-slate-900" key={scan.scanId}>
                  <td className="px-4 py-4 font-semibold text-text dark:text-slate-100">{scan.domain}</td>
                  <td className="px-4 py-4 text-muted dark:text-slate-300">{new Date(scan.scannedAt).toLocaleString()}</td>
                  <td className="px-4 py-4">
                    <RiskScoreBadge score={scan.riskScore} />
                  </td>
                  <td className="px-4 py-4 text-muted dark:text-slate-300">{scan.violations.length}</td>
                  <td className="px-4 py-4">
                    <Link className="font-semibold text-primary hover:text-highlight" href={`/scanner/${scan.scanId}`}>
                      Open Report →
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
