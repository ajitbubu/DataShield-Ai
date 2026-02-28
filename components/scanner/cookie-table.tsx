"use client";

import { useMemo, useState } from "react";
import { CookieCategory, CookieRecord, RiskLevel } from "@/data/scanner";
import { FilterBar } from "@/components/scanner/filter-bar";

type CookieTableProps = {
  cookies: CookieRecord[];
};

function RiskPill({ level }: { level: RiskLevel }) {
  const tone = level === "Low" ? "bg-success/15 text-success" : level === "Medium" ? "bg-warning/15 text-warning" : "bg-danger/15 text-danger";

  return <span className={`rounded-full px-2 py-1 text-xs font-semibold ${tone}`}>{level}</span>;
}

export function CookieTable({ cookies }: CookieTableProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"All" | CookieCategory>("All");
  const [risk, setRisk] = useState<"All" | RiskLevel>("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return cookies.filter((cookie) => {
      const byQuery =
        q.length === 0 ||
        cookie.name.toLowerCase().includes(q) ||
        cookie.vendor.toLowerCase().includes(q) ||
        cookie.dataCollected.toLowerCase().includes(q);
      const byCategory = category === "All" || cookie.category === category;
      const byRisk = risk === "All" || cookie.riskLevel === risk;
      return byQuery && byCategory && byRisk;
    });
  }, [cookies, query, category, risk]);

  function handleExport() {
    const header = [
      "Cookie Name",
      "Category",
      "AI Confidence",
      "Party",
      "Data Collected",
      "Risk",
      "Pre-consent Fired",
      "Vendor"
    ];
    const rows = filtered.map((item) => [
      item.name,
      item.category,
      `${item.aiConfidence}%`,
      item.party,
      item.dataCollected,
      item.riskLevel,
      item.preConsentFired ? "Yes" : "No",
      item.vendor
    ]);

    const csv = [header, ...rows].map((row) => row.map((col) => `"${col.replaceAll('"', '""')}"`).join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "cookie-scan-export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <FilterBar
        category={category}
        onCategoryChange={setCategory}
        onExport={handleExport}
        onQueryChange={setQuery}
        onRiskChange={setRisk}
        query={query}
        risk={risk}
      />

      <div className="max-h-[560px] overflow-auto">
        <table className="min-w-[1180px] w-full text-sm">
          <thead className="sticky top-0 bg-[#f8fafc] text-left dark:bg-slate-900">
            <tr>
              {[
                "Cookie Name",
                "Category",
                "AI Confidence %",
                "First/Third Party",
                "Data Collected",
                "Risk Level",
                "Pre-consent Fired?",
                "Actions"
              ].map((col) => (
                <th className="px-3 py-3 font-semibold text-muted" key={col}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border dark:divide-slate-800">
            {filtered.map((cookie) => (
              <tr className="hover:bg-[#fbfdff] dark:hover:bg-slate-900" key={cookie.id}>
                <td className="px-3 py-3 font-semibold text-text dark:text-slate-100">{cookie.name}</td>
                <td className="px-3 py-3 text-muted dark:text-slate-300">{cookie.category}</td>
                <td className="px-3 py-3 text-muted dark:text-slate-300">{cookie.aiConfidence}%</td>
                <td className="px-3 py-3 text-muted dark:text-slate-300">{cookie.party}</td>
                <td className="px-3 py-3 text-muted dark:text-slate-300">{cookie.dataCollected}</td>
                <td className="px-3 py-3">
                  <RiskPill level={cookie.riskLevel} />
                </td>
                <td className="px-3 py-3 text-muted dark:text-slate-300">{cookie.preConsentFired ? "Yes" : "No"}</td>
                <td className="px-3 py-3">
                  <div className="flex flex-wrap gap-1.5">
                    <button className="rounded-md border border-border px-2 py-1 text-xs font-semibold text-muted hover:border-danger/40 hover:text-danger dark:border-slate-700" title="Block this cookie" type="button">
                      Block
                    </button>
                    <button className="rounded-md border border-border px-2 py-1 text-xs font-semibold text-muted hover:border-warning/40 hover:text-warning dark:border-slate-700" title="Flag for review" type="button">
                      Flag
                    </button>
                    <button className="rounded-md border border-border px-2 py-1 text-xs font-semibold text-muted hover:border-primary/40 hover:text-primary dark:border-slate-700" title="Ignore this cookie" type="button">
                      Ignore
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
