import Link from "next/link";
import { ScanResult } from "@/data/scanner";

type ScanHistoryPanelProps = {
  scans: ScanResult[];
};

export function ScanHistoryPanel({ scans }: ScanHistoryPanelProps) {
  return (
    <aside className="rounded-xl border border-border bg-surface p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">Scan History</h3>
        <Link className="text-xs font-semibold text-primary hover:text-highlight" href="/scanner/history">
          View all
        </Link>
      </div>
      <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
        {scans.map((scan) => (
          <Link
            className="block rounded-lg border border-border bg-background px-3 py-2 transition-colors hover:border-primary/30 dark:border-slate-800 dark:bg-slate-900"
            href={`/scanner/${scan.scanId}`}
            key={scan.scanId}
          >
            <p className="text-xs font-semibold text-text dark:text-slate-100">{scan.domain}</p>
            <p className="mt-1 text-xs text-muted dark:text-slate-300">Risk {scan.riskScore} • {new Date(scan.scannedAt).toLocaleString()}</p>
          </Link>
        ))}
      </div>
    </aside>
  );
}
