"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

const tools = [
  { slug: "/word-maker", icon: "\u270F\uFE0F", name: "Word Maker", category: "Words" },
  { slug: "/anagram", icon: "\uD83C\uDFB2", name: "Anagram Finder", category: "Words" },
  { slug: "/acronym", icon: "\uD83C\uDFAF", name: "Acronym Builder", category: "Words" },
  { slug: "/blender", icon: "\uD83E\uDDEA", name: "Name Blender", category: "Words" },
  { slug: "/ladder", icon: "\uD83E\uDE9C", name: "Word Ladder", category: "Words" },
  { slug: "/cipher", icon: "\uD83D\uDD11", name: "Cipher Tool", category: "Utilities" },
  { slug: "/wheel", icon: "\uD83C\uDFAF", name: "Wheel of Names", category: "Utilities" },
  { slug: "/network", icon: "\uD83C\uDF10", name: "Network Tools", category: "Utilities" },
  { slug: "/pdf-forge", icon: "\uD83D\uDCC4", name: "PDF Forge", category: "Utilities" },
  { slug: "/password-generator", icon: "\uD83D\uDD11", name: "Password Generator", category: "Utilities" },
  { slug: "/qr-code", icon: "\uD83D\uDCF1", name: "QR Code Generator", category: "Utilities" },
  { slug: "/saran", icon: "\uD83D\uDCE3", name: "Kirim Saran", category: "Utilities" },
  { slug: "/personality-test", icon: "\uD83E\uDDD0", name: "Personality Test", category: "Psychology" },
  { slug: "/stress-assessment", icon: "\uD83D\uDCA9", name: "Stress Assessment", category: "Psychology" },
  { slug: "/mood-tracker", icon: "\uD83D\uDE0A", name: "Mood Tracker", category: "Psychology" },
  { slug: "/habit-tracker", icon: "\uD83D\uDD14", name: "Habit Tracker", category: "Psychology" },
  { slug: "/focus-timer", icon: "\u23F1\uFE0F", name: "Focus Timer", category: "Psychology" },
  { slug: "/cognitive-biases", icon: "\uD83E\uDDE0", name: "Cognitive Biases", category: "Psychology" },
  { slug: "/emotion-wheel", icon: "\uD83C\uDF0D", name: "Emotion Wheel", category: "Psychology" },
  { slug: "/indonesian-holidays", icon: "\uD83C\uDDEE\uD83C\uDDE9", name: "Indonesian Holidays", category: "Calendars" },
  { slug: "/weton-calendar", icon: "\uD83D\uDCC6", name: "Weton Calendar", category: "Calendars" },
  { slug: "/tafsir-mimpi", icon: "\uD83D\uDCAD", name: "Tafsir Mimpi", category: "Divination" },
  { slug: "/zodiac", icon: "\uD83C\uDF1F", name: "Star Sign Reader", category: "Divination" },
  { slug: "/tarot", icon: "\uD83C\uDF84", name: "Tarot Reading", category: "Divination" },
  { slug: "/runes", icon: "\uD83E\uDEA8", name: "Rune Divination", category: "Divination" },
  { slug: "/numerology", icon: "\uD83D\uDD22", name: "Numerology", category: "Divination" },
  { slug: "/chinese-zodiac", icon: "\uD83D\uDC32", name: "Chinese Zodiac", category: "Divination" },
  { slug: "/fortune", icon: "\uD83D\uDD2E", name: "Fortune Teller", category: "Divination" },
  { slug: "/primbon", icon: "\uD83C\uDF19", name: "Primbon Jawa", category: "Divination" },
  { slug: "/pranata-mangsa", icon: "\uD83C\uDF3E", name: "Pranata Mangsa", category: "Calendars" },
  { slug: "/calendar", icon: "\uD83D\uDCC5", name: "World Calendars", category: "Calendars" },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelected(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const results = tools.filter(
    (t) =>
      !query ||
      t.name.toLowerCase().includes(query.toLowerCase()) ||
      t.slug.includes(query.toLowerCase())
  );

  const navigate = useCallback(
    (slug: string) => {
      setOpen(false);
      router.push(slug);
    },
    [router]
  );

  useEffect(() => {
    if (!open || results.length === 0) return;
    function handler(e: KeyboardEvent) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelected((prev) => (prev + 1) % results.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelected((prev) => (prev - 1 + results.length) % results.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        navigate(results[selected].slug);
      }
    }
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, results, selected, navigate]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] bg-black/20 backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        className="apple-card w-full max-w-lg mx-4 p-0 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center border-b border-[var(--color-divider-soft)]">
          <svg className="w-4 h-4 ml-4 shrink-0 text-[var(--color-ink-muted-48)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelected(0); }}
            placeholder="Search tools\u2026"
            className="flex-1 h-12 px-3 text-[14px] bg-transparent border-none outline-none"
          />
          <kbd className="mr-3 text-[10px] text-[var(--color-ink-muted-48)] border border-[var(--color-divider-soft)] rounded px-1.5 py-0.5">ESC</kbd>
        </div>
        <div className="max-h-72 overflow-y-auto p-2 space-y-0.5">
          {results.length === 0 ? (
            <p className="text-[13px] text-[var(--color-ink-muted-48)] text-center py-4">
              No tools found
            </p>
          ) : (
            results.map((t, i) => (
              <button
                key={t.slug}
                onClick={() => navigate(t.slug)}
                onMouseEnter={() => setSelected(i)}
                className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-left text-[13px] transition-colors ${
                  i === selected
                    ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                    : "text-[var(--color-ink)] hover:bg-[var(--color-divider-soft)]"
                }`}
              >
                <span className="text-[16px]">{t.icon}</span>
                <span className="flex-1">{t.name}</span>
                <span className="text-[11px] text-[var(--color-ink-muted-48)]">{t.category}</span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
