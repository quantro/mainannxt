"use client";

import { useState, useCallback } from "react";
import { isWord } from "@/lib/dictionary";
import ThemeToggle from "../theme-toggle";
import { Disclaimer } from "../disclaimer";

function findLadder(start: string, end: string): string[] | null {
  if (start.length !== end.length) return null;
  const queue = [[start]];
  const visited = new Set([start]);
  while (queue.length > 0) {
    const path = queue.shift()!;
    const last = path[path.length - 1];
    if (last === end) return path;
    for (let i = 0; i < last.length; i++) {
      for (let c = 97; c <= 122; c++) {
        const next =
          last.slice(0, i) + String.fromCharCode(c) + last.slice(i + 1);
        if (isWord(next) && !visited.has(next)) {
          visited.add(next);
          queue.push([...path, next]);
        }
      }
    }
  }
  return null;
}

function diffIndex(a: string, b: string): number | null {
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return i;
  }
  return null;
}

export default function LadderPage() {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [path, setPath] = useState<string[] | null>(null);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = useCallback(() => {
    const s = start.toLowerCase().trim();
    const e = end.toLowerCase().trim();

    if (!s || !e) {
      setError("Enter both a start word and an end word.");
      setSearched(false);
      return;
    }

    if (s.length !== e.length) {
      setError("Words must be the same length.");
      setSearched(false);
      return;
    }

    if (s.length < 3 || s.length > 5) {
      setError("Words must be 3–5 letters.");
      setSearched(false);
      return;
    }

    if (!isWord(s)) {
      setError(`"${s}" is not in the dictionary.`);
      setSearched(false);
      return;
    }

    if (!isWord(e)) {
      setError(`"${e}" is not in the dictionary.`);
      setSearched(false);
      return;
    }

    if (s === e) {
      setError("Start and end words must be different.");
      setSearched(false);
      return;
    }

    setError("");
    setSearched(true);
    const result = findLadder(s, e);
    setPath(result);
  }, [start, end]);

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-12">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <h1 className="apple-headline text-[34px] leading-[1.47] tracking-[-0.374px] mb-8">
        Word Ladder
      </h1>

      <div className="w-full max-w-2xl apple-card px-6 py-5 mb-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h2 className="text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-[var(--color-ink-muted-48)] mb-3 uppercase">
              Start
            </h2>
            <input
              value={start}
              onChange={(e) =>
                setStart(
                  e.target.value.replace(/[^a-zA-Z]/g, "").toLowerCase()
                )
              }
              placeholder="e.g. cold"
              className="apple-input w-full h-10 text-[14px]"
            />
          </div>
          <div>
            <h2 className="text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-[var(--color-ink-muted-48)] mb-3 uppercase">
              End
            </h2>
            <input
              value={end}
              onChange={(e) =>
                setEnd(
                  e.target.value.replace(/[^a-zA-Z]/g, "").toLowerCase()
                )
              }
              placeholder="e.g. warm"
              className="apple-input w-full h-10 text-[14px]"
            />
          </div>
        </div>
        <button
          onClick={handleSubmit}
          className="apple-btn apple-btn-primary text-[14px] mt-4"
        >
          Find Ladder
        </button>
      </div>

      {error && (
        <div className="w-full max-w-2xl apple-card px-6 py-5 mb-5">
          <p className="text-[14px] leading-[1.43] tracking-[-0.224px] text-center text-[var(--color-primary)]">
            {error}
          </p>
        </div>
      )}

      {searched && path !== null && (
        <div className="w-full max-w-2xl apple-card px-6 py-5">
          <p className="text-[12px] font-semibold leading-[1.29] tracking-[-0.224px] text-[var(--color-ink-muted-48)] mb-4 uppercase">
            {path.length - 1} step{path.length - 1 !== 1 ? "s" : ""}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            {path.map((word, wi) => {
              const prevWord = wi > 0 ? path[wi - 1] : null;
              const changedIdx = prevWord ? diffIndex(prevWord, word) : null;
              return (
                <div key={wi} className="flex items-center gap-3">
                  {wi > 0 && (
                    <span className="text-[var(--color-ink-muted-48)] text-[18px] leading-none">
                      {'→'}
                    </span>
                  )}
                  <div className="flex gap-[2px]">
                    {word.split("").map((ch, li) => (
                      <span
                        key={li}
                        className={`inline-flex items-center justify-center w-8 h-8 text-[14px] font-semibold leading-none rounded-[6px] ${
                          changedIdx === li
                            ? "bg-[var(--color-primary)] text-white"
                            : "bg-[var(--color-surface-pearl)] text-[var(--color-ink)] border border-[var(--color-divider-soft)]"
                        }`}
                      >
                        {ch.toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {searched && path === null && (
        <div className="w-full max-w-2xl apple-card px-6 py-5">
          <p className="text-[14px] leading-[1.43] tracking-[-0.224px] text-[var(--color-ink-muted-48)] text-center">
            No ladder found between those words.
          </p>
        </div>
      )}
          <Disclaimer type="utility" />
    </div>
  );
}
