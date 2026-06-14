"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { WORDS } from "@/lib/dictionary";
import { WORDS_ID } from "@/lib/dictionary-id";
import ThemeToggle from "../theme-toggle";
import { Disclaimer } from "../disclaimer";
import { PageTitle } from "../page-title";

function canForm(word: string, sourceCounts: Record<string, number>): boolean {
  const counts: Record<string, number> = {};
  for (const ch of word) {
    counts[ch] = (counts[ch] || 0) + 1;
    if ((sourceCounts[ch] ?? 0) < counts[ch]) return false;
  }
  return true;
}

const DICTS = { en: WORDS, id: WORDS_ID } as const;
const LANG_LABELS = { en: "English", id: "Bahasa Indonesia" };

export default function AnagramPage() {
  const [input, setInput] = useState("");
  const [debouncedInput, setDebouncedInput] = useState("");
  const [mounted, setMounted] = useState(false);
  const [lang, setLang] = useState<"en" | "id">("en");
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setDebouncedInput(input);
    }, 300);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [input]);

  const words = useMemo(() => {
    const dict = DICTS[lang];
    const letters = debouncedInput.toLowerCase().replace(/[^a-z]/g, "");
    if (letters.length < 3) return [];

    const sourceCounts: Record<string, number> = {};
    for (const ch of letters) sourceCounts[ch] = (sourceCounts[ch] || 0) + 1;

    const results: string[] = [];
    for (const word of dict) {
      if (word.length < 3 || word.length > letters.length) continue;
      if (canForm(word, sourceCounts)) results.push(word);
    }

    results.sort((a, b) => {
      if (b.length !== a.length) return b.length - a.length;
      return a.localeCompare(b);
    });

    return results;
  }, [debouncedInput, lang]);

  if (!mounted) {
    return (
      <div className="flex flex-col items-center min-h-screen px-4 py-12">
        <PageTitle title="Anagram Finder" />
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <h1 className="apple-headline text-[34px] leading-[1.47] tracking-[-0.374px] mb-8">
          Anagram Finder
        </h1>
        <div className="w-full max-w-2xl apple-card px-6 py-5 text-center">
          <p className="text-[14px] leading-[1.43] tracking-[-0.224px] text-[var(--color-ink-muted-48)]">
            Loading dictionary...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-12">
      <PageTitle title="Anagram Finder" />
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <h1 className="apple-headline text-[34px] leading-[1.47] tracking-[-0.374px] mb-8">
        Anagram Finder
      </h1>

      <div className="w-full max-w-2xl apple-card px-6 py-5 mb-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[14px] font-semibold uppercase text-[var(--color-ink-muted-48)]">
            Letters
          </h2>
          <div className="flex gap-1">
            {(["en", "id"] as const).map((l) => (
              <button
                key={l}
                onClick={() => { setLang(l); setInput(""); setDebouncedInput(""); }}
                className={`px-3 py-1 rounded-[8px] text-[11px] font-semibold transition-all ${
                  lang === l
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-[var(--color-surface-pearl)] text-[var(--color-ink-muted-48)] hover:brightness-95"
                }`}
              >
                {LANG_LABELS[l]}
              </button>
            ))}
          </div>
        </div>
        <input
          value={input}
          onChange={(e) =>
            setInput(e.target.value.replace(/[^a-zA-Z]/g, "").toLowerCase())
          }
          placeholder="Type your letters..."
          className="apple-input w-full h-10 text-[14px]"
        />
      </div>

      {debouncedInput.length >= 3 && words.length > 0 && (
        <div className="w-full max-w-2xl apple-card px-6 py-5">
          <p className="text-[12px] font-semibold leading-[1.29] tracking-[-0.224px] text-[var(--color-ink-muted-48)] mb-4 uppercase">
            {words.length} word{words.length !== 1 ? "s" : ""} found
          </p>
          <div className="flex flex-wrap gap-2">
            {words.map((word) => (
              <span
                key={word}
                className="text-[13px] leading-[1] bg-[var(--color-surface-pearl)] text-[var(--color-ink)] px-3 py-2 rounded-[11px] border border-[var(--color-divider-soft)]"
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      )}

      {debouncedInput.length >= 3 && words.length === 0 && (
        <div className="w-full max-w-2xl apple-card px-6 py-5">
          <p className="text-[14px] leading-[1.43] tracking-[-0.224px] text-[var(--color-ink-muted-48)] text-center">
            No words found.
          </p>
        </div>
      )}

      {debouncedInput.length < 3 && debouncedInput.length > 0 && (
        <div className="w-full max-w-2xl apple-card px-6 py-5">
          <p className="text-[14px] leading-[1.43] tracking-[-0.224px] text-[var(--color-ink-muted-48)] text-center">
            Type at least 3 letters to find words.
          </p>
        </div>
      )}
          <Disclaimer type="utility" />
    </div>
  );
}
