import { AuditTimeline } from "@/components/admin/audit-timeline";
import { auditEvents } from "@/data/admin";

export default function AdminAuditPage() {
  return (
    <div className="space-y-4">
      <header>
        <h2 className="text-3xl font-bold text-text dark:text-slate-100">Audit Ledger</h2>
        <p className="mt-1 text-sm text-muted dark:text-slate-300">
          Immutable event timeline with compliance filters by user, action, regulation, and date.
        </p>
      </header>
      <AuditTimeline events={auditEvents} />
    </div>
  );
}
