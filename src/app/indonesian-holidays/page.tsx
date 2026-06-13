"use client";

import { useMemo, useState } from "react";
import ThemeToggle from "../theme-toggle";
import { Disclaimer } from "../disclaimer";
import data from "@/lib/indonesian-holidays.json";

type Holiday = {
  date: string;
  name: string;
  type: string;
  is_joint_holiday: boolean;
  is_observance: boolean;
  date_formatted?: string;
};

const TYPE_COLORS: Record<string, string> = {
  "Public Holiday": "bg-blue-500/10 text-blue-600",
  "National Holiday": "bg-indigo-500/10 text-indigo-600",
  "Joint Holiday": "bg-amber-500/10 text-amber-600",
  "Observance": "bg-gray-500/10 text-gray-500",
};

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function getMonth(dateStr: string): number {
  return parseInt(dateStr.split("-")[1]);
}

function getDay(dateStr: string): number {
  return parseInt(dateStr.split("-")[2]);
}

export default function IndonesianHolidaysPage() {
  const [year, setYear] = useState(2026);
  const [typeFilter, setTypeFilter] = useState("All");

  const allTypes = useMemo(() => {
    const types = new Set<string>();
    for (const y of Object.keys(data)) {
      for (const h of data[y as keyof typeof data] as Holiday[]) {
        types.add(h.type);
      }
    }
    return ["All", ...Array.from(types).sort()];
  }, []);

  const yearData = useMemo(() => {
    const key = String(year) as keyof typeof data;
    return (data[key] as Holiday[]) || [];
  }, [year]);

  const filtered = useMemo(() => {
    if (typeFilter === "All") return yearData;
    return yearData.filter((h) => h.type === typeFilter);
  }, [yearData, typeFilter]);

  const byMonth = useMemo(() => {
    const groups: Record<number, Holiday[]> = {};
    for (const h of filtered) {
      const m = getMonth(h.date);
      if (!groups[m]) groups[m] = [];
      groups[m].push(h);
    }
    return groups;
  }, [filtered]);

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-12">
      <div className="absolute top-4 right-4"><ThemeToggle /></div>
      <h1 className="apple-headline text-[34px] leading-[1.47] tracking-[-0.374px] mb-2">Indonesian Holidays</h1>
      <p className="text-[13px] text-[var(--color-ink-muted-48)] mb-6 text-center max-w-lg">
        National, Islamic, Christian, Hindu/Buddhist, and cultural holidays for any year. Data sourced from api.co.id.
      </p>

      <div className="w-full max-w-2xl apple-card px-6 py-5 mb-5">
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="text-[10px] font-semibold uppercase text-[var(--color-ink-muted-48)]">Year</label>
            <select value={year} onChange={(e) => setYear(parseInt(e.target.value))} className="apple-input w-full h-9 text-[13px] mt-0.5">
              {Array.from({ length: 11 }, (_, i) => 2025 + i).map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="text-[10px] font-semibold uppercase text-[var(--color-ink-muted-48)]">Type</label>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="apple-input w-full h-9 text-[13px] mt-0.5">
              {allTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
        <p className="text-[11px] text-[var(--color-ink-muted-48)] mt-2 text-center">
          {filtered.length} holiday{filtered.length !== 1 ? "s" : ""} in {year}
          {typeFilter !== "All" ? ` (${typeFilter})` : ""}
        </p>
      </div>

      <div className="w-full max-w-2xl space-y-4">
        {MONTHS.map((monthName, i) => {
          const m = i + 1;
          const items = byMonth[m];
          if (!items || items.length === 0) return null;
          return (
            <div key={m} className="apple-card px-6 py-4">
              <h2 className="text-[14px] font-semibold text-[var(--color-ink)] mb-3">{monthName} <span className="text-[11px] font-normal text-[var(--color-ink-muted-48)]">({items.length})</span></h2>
              <div className="space-y-1.5">
                {items
                  .sort((a, b) => getDay(a.date) - getDay(b.date))
                  .map((h, idx) => (
                    <div key={idx} className="flex items-start gap-3 py-1.5 border-b border-[var(--color-border-subtle)] last:border-0">
                      <span className="text-[11px] font-semibold text-[var(--color-ink)] w-8 shrink-0 tabular-nums">{getDay(h.date)}</span>
                      <div className="flex-1 min-w-0">
                        <span className="text-[13px] text-[var(--color-ink)]">{h.name}</span>
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-[6px] shrink-0 ${TYPE_COLORS[h.type] || "bg-gray-500/10 text-gray-500"}`}>
                        {h.type === "Public Holiday" ? "Public" : h.type === "National Holiday" ? "National" : h.type === "Joint Holiday" ? "Joint" : h.type === "Observance" ? "Obs." : h.type}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="apple-card px-6 py-5 text-center">
            <p className="text-[13px] text-[var(--color-ink-muted-48)]">No holidays found for the selected filters.</p>
          </div>
        )}
      </div>

      <div className="w-full max-w-2xl mt-6 apple-card px-6 py-3">
        <p className="text-[10px] leading-[1.6] text-[var(--color-ink-muted-48)] text-center">
          2025–2026 data sourced from <a href="https://api.co.id" target="_blank" rel="noopener noreferrer" className="underline">api.co.id</a>.
          Years 2027–2035 include fixed national holidays and approximate Islamic/cultural dates. Islamic holidays shift ~11 days earlier each year; exact dates depend on official moon sighting.
        </p>
      </div>

      <Disclaimer type="utility" />
    </div>
  );
}
