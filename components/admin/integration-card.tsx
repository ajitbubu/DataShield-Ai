import { IntegrationItem } from "@/data/admin";
import { cn } from "@/lib/utils";

type IntegrationCardProps = {
  item: IntegrationItem;
  canManage: boolean;
};

export function IntegrationCard({ item, canManage }: IntegrationCardProps) {
  const statusTone =
    item.status === "Connected"
      ? "bg-success/15 text-success"
      : item.status === "Needs Attention"
        ? "bg-warning/15 text-warning"
        : "bg-danger/15 text-danger";

  return (
    <article className="rounded-xl border border-border bg-surface p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-lg font-semibold text-text dark:text-slate-100">{item.name}</h3>
        <span className={cn("rounded-full px-2 py-1 text-xs font-semibold", statusTone)}>{item.status}</span>
      </div>
      <p className="mt-2 text-xs text-muted">Last sync: {new Date(item.lastSync).toLocaleString()}</p>
      <button
        className="mt-4 rounded-lg border border-border px-3 py-2 text-sm font-semibold text-primary disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700"
        disabled={!canManage}
        type="button"
      >
        {item.status === "Connected" ? "Reconnect" : "Connect"}
      </button>
    </article>
  );
}
