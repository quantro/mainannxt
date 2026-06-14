"use client";

import { useEffect, useState } from "react";
import { fetchStats, totalClicks, sortedTools, type ClickCounts } from "@/lib/tracker";

const toolsInfo: Record<string, { icon: string; name: string }> = {
  "/word-maker": { icon: "\u270F\uFE0F", name: "Word Maker" },
  "/anagram": { icon: "\uD83C\uDFB2", name: "Anagram Finder" },
  "/acronym": { icon: "\uD83C\uDFAF", name: "Acronym Builder" },
  "/blender": { icon: "\uD83E\uDDEA", name: "Name Blender" },
  "/ladder": { icon: "\uD83E\uDE9C", name: "Word Ladder" },
  "/cipher": { icon: "\uD83D\uDD11", name: "Cipher Tool" },
  "/wheel": { icon: "\uD83C\uDFAF", name: "Wheel of Names" },
  "/network": { icon: "\uD83C\uDF10", name: "Network Tools" },
  "/pdf-forge": { icon: "\uD83D\uDCC4", name: "PDF Forge" },
  "/password-generator": { icon: "\uD83D\uDD11", name: "Password Generator" },
  "/qr-code": { icon: "\uD83D\uDCF1", name: "QR Code Generator" },
  "/indonesian-holidays": { icon: "\uD83C\uDDEE\uD83C\uDDE9", name: "Indonesian Holidays" },
  "/weton-calendar": { icon: "\uD83D\uDCC6", name: "Weton Calendar" },
  "/tafsir-mimpi": { icon: "\uD83D\uDCAD", name: "Tafsir Mimpi" },
  "/zodiac": { icon: "\uD83C\uDF1F", name: "Star Sign Reader" },
  "/tarot": { icon: "\uD83C\uDF84", name: "Tarot Reading" },
  "/runes": { icon: "\uD83E\uDEA8", name: "Rune Divination" },
  "/numerology": { icon: "\uD83D\uDD22", name: "Numerology" },
  "/chinese-zodiac": { icon: "\uD83D\uDC32", name: "Chinese Zodiac" },
  "/fortune": { icon: "\uD83D\uDD2E", name: "Fortune Teller" },
  "/primbon": { icon: "\uD83C\uDF19", name: "Primbon Jawa" },
  "/pranata-mangsa": { icon: "\uD83C\uDF3E", name: "Pranata Mangsa" },
  "/calendar": { icon: "\uD83D\uDCC5", name: "World Calendars" },
};

export default function AdminDashboard() {
  const [counts, setCounts] = useState<ClickCounts>({});

  useEffect(() => {
    fetchStats().then(setCounts);
  }, []);

  const sorted = sortedTools(counts);
  const total = totalClicks(counts);

  return (
    <div>
      <h1 className="text-[24px] font-semibold mb-1">Dashboard</h1>
      <p className="text-[13px] text-[var(--color-ink-muted-48)] mb-6">
        {total} total click{total === 1 ? "" : "s"} across {sorted.length} tool{sorted.length === 1 ? "" : "s"}
      </p>

      <div className="apple-card p-5">
        <h2 className="text-[15px] font-semibold mb-3">Click Summary</h2>
        {sorted.length === 0 ? (
          <p className="text-[13px] text-[var(--color-ink-muted-48)]">No clicks yet.</p>
        ) : (
          <div className="space-y-2">
            {sorted.map(([slug, n]) => {
              const info = toolsInfo[slug];
              return (
                <div key={slug} className="flex items-center justify-between text-[13px]">
                  <span>
                    <span className="mr-2">{info?.icon || "\uD83D\uDCC1"}</span>
                    {info?.name || slug}
                  </span>
                  <span className="font-semibold tabular-nums">{n}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
