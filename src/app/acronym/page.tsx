"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ThemeToggle from "../theme-toggle";
import { Disclaimer } from "../disclaimer";
import { PageTitle } from "../page-title";
import { isWord } from "@/lib/dictionary";

interface RealWordResult {
  acronym: string;
  positions: number[];
}

export default function AcronymPage() {
  const [phrase, setPhrase] = useState("");
  const [positions, setPositions] = useState<number[]>([]);
  const [mode, setMode] = useState<"first" | "custom">("first");
  const [realWords, setRealWords] = useState<RealWordResult[]>([]);
  const [finding, setFinding] = useState(false);

  const prevWordCount = useRef(0);

  const words = useMemo(
    () =>
      phrase
        .trim()
        .split(/\s+/)
        .filter(Boolean),
    [phrase]
  );

  useEffect(() => {
    if (words.length !== prevWordCount.current) {
      setPositions(words.map(() => 0));
      setRealWords([]);
      prevWordCount.current = words.length;
    }
  }, [words]);

  const acronym = useMemo(() => {
    if (words.length === 0) return "";
    if (mode === "first") {
      return words.map((w) => w[0] || "").join("").toUpperCase();
    }
    return words
      .map((w, i) => w[positions[i]] || "")
      .join("")
      .toUpperCase();
  }, [words, mode, positions]);

  const hasContent = phrase.trim().length > 0;

  const updatePosition = useCallback((i: number, val: number) => {
    setPositions((prev) => {
      const next = [...prev];
      next[i] = Math.max(0, Math.min(val, (words[i]?.length ?? 1) - 1));
      return next;
    });
    setRealWords([]);
  }, [words]);

  const findRealWords = useCallback(() => {
    if (words.length === 0 || words.some((w) => w.length === 0)) return;

    setFinding(true);

    const results: RealWordResult[] = [];
    const seen = new Set<string>();

    let totalCombos = 1;
    for (const w of words) {
      totalCombos *= w.length;
    }

    const MAX_COMBOS = 50000;
    if (totalCombos > MAX_COMBOS) {
      setFinding(false);
      return;
    }

    function backtrack(wordIdx: number, acc: number[], letters: string[]) {
      if (wordIdx === words.length) {
        const acr = letters.join("").toLowerCase();
        if (isWord(acr) && !seen.has(acr)) {
          seen.add(acr);
          results.push({ acronym: acr.toUpperCase(), positions: [...acc] });
        }
        return;
      }

      const word = words[wordIdx];
      for (let pos = 0; pos < word.length; pos++) {
        acc.push(pos);
        letters.push(word[pos]);
        backtrack(wordIdx + 1, acc, letters);
        acc.pop();
        letters.pop();
      }
    }

    backtrack(0, [], []);

    results.sort((a, b) => a.acronym.localeCompare(b.acronym));
    setRealWords(results);
    setFinding(false);
  }, [words]);

  function applyRealWord(result: RealWordResult) {
    setPositions(result.positions);
    setMode("custom");
  }

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-12">
      <PageTitle title="Acronym Builder" />
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <h1 className="apple-headline text-[34px] leading-[1.47] tracking-[-0.374px] mb-8">
        Acronym Builder
      </h1>

      <div className="w-full max-w-2xl apple-card px-6 py-5 mb-5">
        <h2 className="text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-[var(--color-ink-muted-48)] mb-3 uppercase">
          Phrase
        </h2>
        <input
          value={phrase}
          onChange={(e) => setPhrase(e.target.value)}
          placeholder="e.g. North Atlantic Treaty Organization"
          className="apple-input w-full h-10 text-[14px]"
        />
      </div>

      {hasContent && (
        <div className="w-full max-w-2xl apple-card px-6 py-5 mb-5">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-[var(--color-ink-muted-48)] uppercase">
              Mode
            </span>
            <button
              onClick={() => {
                setMode("first");
                setPositions(words.map(() => 0));
                setRealWords([]);
              }}
              className={`text-[12px] leading-[1] tracking-[-0.12px] px-3 py-1.5 rounded-[11px] border transition-colors ${
                mode === "first"
                  ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                  : "text-[var(--color-ink-muted-48)] border-[var(--color-divider-soft)] hover:text-[var(--color-primary)]"
              }`}
            >
              First Letters
            </button>
            <button
              onClick={() => {
                setMode("custom");
                setPositions((prev) => {
                  if (prev.length !== words.length) return words.map(() => 0);
                  return prev;
                });
                setRealWords([]);
              }}
              className={`text-[12px] leading-[1] tracking-[-0.12px] px-3 py-1.5 rounded-[11px] border transition-colors ${
                mode === "custom"
                  ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                  : "text-[var(--color-ink-muted-48)] border-[var(--color-divider-soft)] hover:text-[var(--color-primary)]"
              }`}
            >
              Custom Positions
            </button>
          </div>

          {mode === "first" && (
            <div className="flex items-center gap-2 flex-wrap">
              {words.map((w, i) => (
                <span
                  key={i}
                  className="text-[12px] leading-[1] bg-[var(--color-surface-pearl)] text-[var(--color-ink)] px-2 py-1.5 rounded-[11px] border border-[var(--color-divider-soft)]"
                >
                  <span className="font-semibold">
                    {w[0]?.toUpperCase()}
                  </span>
                  {w.slice(1).toLowerCase()}
                </span>
              ))}
            </div>
          )}

          {mode === "custom" && (
            <div className="space-y-2">
              {words.map((w, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-[14px] leading-[1.43] tracking-[-0.224px] text-[var(--color-ink-muted-48)] min-w-[20px] text-right shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-[14px] leading-[1.43] text-[var(--color-ink)] flex-1 truncate">
                    <span className="font-semibold">
                      {w[positions[i]]?.toUpperCase()}
                    </span>
                    {w.slice(0, positions[i]).toLowerCase()}
                    {w.slice(positions[i] + 1).toLowerCase()}
                  </span>
                  <input
                    type="number"
                    min={1}
                    max={w.length}
                    value={positions[i] + 1}
                    onChange={(e) =>
                      updatePosition(
                        i,
                        Math.max(0, Number(e.target.value) - 1)
                      )
                    }
                    className="w-14 h-10 px-2 text-center apple-input text-[14px]"
                    title={`Position in "${w}"`}
                  />
                  <span className="text-[12px] text-[var(--color-ink-muted-48)] w-8">
                    / {w.length}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {hasContent && (
        <div className="w-full max-w-2xl apple-card px-6 py-5 mb-5">
          <h2 className="text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-[var(--color-ink-muted-48)] mb-3 uppercase">
            Acronym
          </h2>
          <p className="text-[28px] font-bold leading-[1.2] tracking-[-0.374px] text-[var(--color-primary)]">
            {acronym || (
              <span className="text-[var(--color-ink-muted-48)] text-[14px] font-normal">
                Enter a phrase to generate an acronym
              </span>
            )}
          </p>
        </div>
      )}

      {hasContent && (
        <div className="w-full max-w-2xl apple-card px-6 py-5 mb-5">
          <h2 className="text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-[var(--color-ink-muted-48)] mb-3 uppercase">
            Real Word Acronyms
          </h2>
          <p className="text-[12px] leading-[1.43] text-[var(--color-ink-muted-48)] mb-3">
            Try all position combinations to find acronyms that are real English
            words.
          </p>
          <button
            onClick={findRealWords}
            disabled={finding}
            className="apple-btn apple-btn-primary text-[14px]"
          >
            {finding ? "Searching..." : "Find Real Word Acronyms"}
          </button>

          {realWords.length > 0 && (
            <div className="mt-4">
              <p className="text-[12px] font-semibold text-[var(--color-ink-muted-48)] mb-2">
                {realWords.length} result{realWords.length !== 1 ? "s" : ""}
                :
              </p>
              <div className="flex flex-wrap gap-2">
                {realWords.map((rw, i) => (
                  <button
                    key={i}
                    onClick={() => applyRealWord(rw)}
                    className="text-[12px] leading-[1] bg-[var(--color-surface-pearl)] text-[var(--color-ink)] px-2 py-1.5 rounded-[11px] border border-[var(--color-divider-soft)] hover:border-[var(--color-primary)] transition-colors"
                    title={`Set positions to match "${rw.acronym}"`}
                  >
                    <span className="font-semibold">{rw.acronym}</span>
                    <span className="text-[var(--color-ink-muted-48)] ml-1">
                      ({rw.positions.map((p, j) => `${j + 1}→${p + 1}`).join(", ")})
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {realWords.length === 0 && hasContent && !finding && (
            <p className="mt-3 text-[12px] text-[var(--color-ink-muted-48)]">
              No real word acronyms found for this phrase.
            </p>
          )}
        </div>
      )}
          <Disclaimer type="utility" />
    </div>
  );
}
