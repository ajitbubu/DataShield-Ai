"use client";

import { useMemo, useState } from "react";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function ROICalculator() {
  const [companySize, setCompanySize] = useState(500);
  const [websites, setWebsites] = useState(5);
  const [jurisdictions, setJurisdictions] = useState(4);

  const { riskReduction, costSavings } = useMemo(() => {
    const riskReductionRaw = 24 + websites * 2.8 + jurisdictions * 5.5 + Math.log10(companySize + 10) * 8;
    const riskReduction = clamp(Math.round(riskReductionRaw), 18, 76);

    const yearlyExposure = companySize * 210 + websites * 8500 + jurisdictions * 18000;
    const costSavings = Math.round(yearlyExposure * (riskReduction / 100) * 0.22);

    return { riskReduction, costSavings };
  }, [companySize, websites, jurisdictions]);

  return (
    <div className="grid gap-6 rounded-xl border border-border bg-surface p-6 shadow-sm lg:grid-cols-2">
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-text" htmlFor="company-size">
            Company size (employees)
          </label>
          <input
            className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-highlight"
            id="company-size"
            min={10}
            onChange={(event) => setCompanySize(Number(event.target.value || 10))}
            type="number"
            value={companySize}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-text" htmlFor="websites">
            Number of websites / digital properties
          </label>
          <input
            className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-highlight"
            id="websites"
            min={1}
            onChange={(event) => setWebsites(Number(event.target.value || 1))}
            type="number"
            value={websites}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-text" htmlFor="jurisdictions">
            Jurisdictions in scope
          </label>
          <input
            className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-highlight"
            id="jurisdictions"
            min={1}
            onChange={(event) => setJurisdictions(Number(event.target.value || 1))}
            type="number"
            value={jurisdictions}
          />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-background p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">Estimated ROI Snapshot</p>
        <div className="mt-4 space-y-4">
          <div>
            <p className="text-sm text-muted">Estimated risk reduction</p>
            <p className="text-3xl font-bold text-success">{riskReduction}%</p>
          </div>
          <div>
            <p className="text-sm text-muted">Estimated annual cost savings</p>
            <p className="text-3xl font-bold text-primary">${costSavings.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
