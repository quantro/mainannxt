"use client";

import { useEffect, useState } from "react";
import { PageTitle } from "../../page-title";
import { SkeletonList } from "../../skeleton";

interface Suggestion {
  id: number;
  message: string;
  created_at: string;
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("en-ID", {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit",
    hour12: false,
  });
}

export default function AdminSuggestions() {
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/suggestions")
      .then((r) => r.json())
      .then((data) => {
        setSuggestions(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = search.trim()
    ? suggestions.filter((s) =>
        s.message.toLowerCase().includes(search.toLowerCase())
      )
    : suggestions;

  return (
    <div>
      <PageTitle title="Saran Masukan" />
      <h1 className="text-[24px] font-semibold mb-1">Saran & Masukan</h1>
      <p className="text-[13px] text-[var(--color-ink-muted-48)] mb-6">
        {suggestions.length} saran terkumpul
      </p>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Cari saran…"
        className="cosmic-input w-full max-w-xs h-10 text-[14px] text-center mb-6"
      />

      {loading ? (
        <SkeletonList count={6} lines={3} />
      ) : (
        <div className="space-y-3 max-w-2xl">
          {filtered.map((s) => (
            <div key={s.id} className="cosmic-card px-5 py-4">
              <div className="flex items-start justify-between gap-4">
                <p className="text-[14px] leading-[1.6] whitespace-pre-wrap">
                  {s.message}
                </p>
                <span className="text-[11px] text-[var(--color-ink-muted-48)] shrink-0 tabular-nums pt-0.5">
                  {formatTime(s.created_at)}
                </span>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-[14px] text-[var(--color-ink-muted-48)] text-center py-8">
              {search ? "Tidak ada saran yang cocok." : "Belum ada saran."}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
