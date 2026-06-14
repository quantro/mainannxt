"use client";

import { useMemo, useState } from "react";
import ThemeToggle from "../theme-toggle";
import { Disclaimer } from "../disclaimer";
import { PageTitle } from "../page-title";
import dreamsData from "./dreams.json";

interface DreamEntry {
  term: string;
  meaning: string;
  sign: "positive" | "negative" | "mixed";
  interpretation: string;
}

const DREAMS: DreamEntry[] = dreamsData as DreamEntry[];

export default function TafsirMimpiPage() {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    if (!search.trim()) return DREAMS;
    const q = search.toLowerCase().trim();
    return DREAMS.filter(
      (d) =>
        d.term.toLowerCase().includes(q) ||
        d.meaning.toLowerCase().includes(q) ||
        d.interpretation.toLowerCase().includes(q)
    );
  }, [search]);

  const toggle = (term: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(term)) next.delete(term);
      else next.add(term);
      return next;
    });
  };

  const signColor = (sign: string) => {
    switch (sign) {
      case "positive": return "text-green-600 dark:text-green-400";
      case "negative": return "text-red-500 dark:text-red-400";
      default: return "text-yellow-600 dark:text-yellow-400";
    }
  };

  const signLabel = (sign: string) => {
    switch (sign) {
      case "positive": return "Baik";
      case "negative": return "Kurang Baik";
      default: return "Campuran";
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-12">
      <PageTitle title="Tafsir Mimpi" />
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <h1 className="apple-headline text-[34px] leading-[1.47] tracking-[-0.374px] mb-2">
        Tafsir Mimpi
      </h1>
      <p className="text-[13px] text-[var(--color-ink-muted-48)] mb-8 text-center max-w-lg">
        Javanese Dream Interpretation Dictionary &mdash; Cari arti mimpi Anda berdasarkan tradisi
        dan primbon Jawa.
      </p>

      <div className="w-full max-w-2xl apple-card px-6 py-5 mb-5">
        <div className="flex items-center gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari simbol mimpi... (misal: air, ular, gigi)"
            className="apple-input w-full h-10 text-[14px] flex-1"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-[12px] leading-[1] px-3 py-2 rounded-[11px] bg-[var(--color-surface-pearl)] text-[var(--color-ink-muted-48)] hover:text-[var(--color-ink)] transition-colors"
            >
              Clear
            </button>
          )}
        </div>
        {search && (
          <p className="text-[11px] text-[var(--color-ink-muted-48)] mt-2">
            Menampilkan {filtered.length} dari {DREAMS.length} simbol
          </p>
        )}
        {!search && (
          <p className="text-[11px] text-[var(--color-ink-muted-48)] mt-2">
            {DREAMS.length} simbol mimpi tersedia
          </p>
        )}
      </div>

      <div className="w-full max-w-2xl space-y-3">
        {filtered.length === 0 && (
          <div className="apple-card px-6 py-8 text-center">
            <p className="text-[14px] text-[var(--color-ink-muted-48)]">
              Tidak ada simbol mimpi yang cocok dengan &ldquo;{search}&rdquo;. Coba kata kunci lain.
            </p>
          </div>
        )}
        {filtered.map((dream) => (
          <div key={dream.term} className="apple-card px-6 py-4">
            <button
              onClick={() => toggle(dream.term)}
              className="w-full text-left flex items-center justify-between gap-3"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[17px] font-semibold text-[var(--color-ink)]">
                    {dream.term}
                  </span>
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-[4px] ${signColor(dream.sign)} bg-[var(--color-surface-pearl)]`}>
                    {signLabel(dream.sign)}
                  </span>
                </div>
                <p className="text-[12px] text-[var(--color-ink-muted-48)]">
                  {dream.meaning}
                </p>
              </div>
              <span className="text-[var(--color-ink-muted-48)] shrink-0 transition-transform duration-200"
                style={{ transform: expanded.has(dream.term) ? "rotate(180deg)" : "rotate(0deg)" }}
              >
                ▼
              </span>
            </button>
            {expanded.has(dream.term) && (
              <div className="mt-3 pt-3 border-t border-[var(--color-divider-soft)]">
                {dream.interpretation.split("\n\n").map((p, i) => (
                  <p
                    key={i}
                    className="text-[13px] leading-[1.7] text-[var(--color-ink)] mb-2 last:mb-0"
                  >
                    {p}
                  </p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <Disclaimer type="divination" />
    </div>
  );
}
