"use client";

import { useCallback, useState } from "react";
import ThemeToggle from "../theme-toggle";
import { Disclaimer } from "../disclaimer";
import { PageTitle } from "../page-title";
import { useToast } from "../toast";

export default function RandomNumberPage() {
  const { toast } = useToast();
  const [min, setMin] = useState("1");
  const [max, setMax] = useState("100");
  const [count, setCount] = useState("1");
  const [allowDuplicates, setAllowDuplicates] = useState(true);
  const [sortResults, setSortResults] = useState(false);
  const [results, setResults] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(() => {
    const minVal = parseInt(min);
    const maxVal = parseInt(max);
    const countVal = parseInt(count);

    if (isNaN(minVal) || isNaN(maxVal) || isNaN(countVal)) {
      setError("Please enter valid numbers.");
      setResults([]);
      return;
    }

    if (minVal >= maxVal) {
      setError("Max must be greater than Min.");
      setResults([]);
      return;
    }

    const range = maxVal - minVal + 1;

    if (!allowDuplicates && countVal > range) {
      setError(`Cannot generate ${countVal} unique numbers in range ${minVal}–${maxVal} (only ${range} possible values).`);
      setResults([]);
      return;
    }

    setError(null);

    const nums: number[] = [];
    const pool = new Set<number>();

    const maxIter = allowDuplicates ? countVal : Math.min(countVal, range);
    const arr = new Uint32Array(maxIter);

    if (allowDuplicates) {
      crypto.getRandomValues(arr);
      for (let i = 0; i < maxIter; i++) {
        nums.push(minVal + (arr[i] % range));
      }
    } else {
      while (pool.size < maxIter) {
        const batch = new Uint32Array(maxIter - pool.size);
        crypto.getRandomValues(batch);
        for (const v of batch) {
          const n = minVal + (v % range);
          if (!pool.has(n)) {
            pool.add(n);
            nums.push(n);
            if (nums.length >= maxIter) break;
          }
        }
      }
    }

    if (sortResults) nums.sort((a, b) => a - b);
    setResults(nums);
  }, [min, max, count, allowDuplicates, sortResults]);

  async function copyResults() {
    if (results.length === 0) return;
    const text = results.join(", ");
    await navigator.clipboard.writeText(text);
    toast("Copied to clipboard", "success");
  }

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-12">
      <PageTitle title="Random Number" />
      <div className="absolute top-4 right-4"><ThemeToggle /></div>
      <h1 className="apple-headline text-[32px] leading-[1.1] text-center mb-1">Random Number Generator</h1>
      <p className="text-[13px] text-[var(--color-ink-muted-48)] mb-6 text-center max-w-lg">
        Generate cryptographically secure random numbers.
      </p>

      <div className="w-full max-w-md space-y-4">
        <div className="apple-card px-5 py-4 space-y-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-[11px] font-semibold uppercase text-[var(--color-ink-muted-48)] mb-1">Min</label>
              <input
                type="number"
                value={min}
                onChange={(e) => setMin(e.target.value)}
                className="apple-input w-full h-10 text-[14px]"
              />
            </div>
            <div className="flex-1">
              <label className="block text-[11px] font-semibold uppercase text-[var(--color-ink-muted-48)] mb-1">Max</label>
              <input
                type="number"
                value={max}
                onChange={(e) => setMax(e.target.value)}
                className="apple-input w-full h-10 text-[14px]"
              />
            </div>
            <div className="flex-1">
              <label className="block text-[11px] font-semibold uppercase text-[var(--color-ink-muted-48)] mb-1">Count</label>
              <input
                type="number"
                min="1"
                value={count}
                onChange={(e) => setCount(e.target.value)}
                className="apple-input w-full h-10 text-[14px]"
              />
            </div>
          </div>

          <div className="flex gap-4 text-[13px] text-[var(--color-ink)]">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={allowDuplicates} onChange={(e) => setAllowDuplicates(e.target.checked)} className="accent-[var(--color-primary)]" />
              Allow duplicates
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={sortResults} onChange={(e) => setSortResults(e.target.checked)} className="accent-[var(--color-primary)]" />
              Sort results
            </label>
          </div>

          <button onClick={generate} className="apple-btn-primary w-full h-11 text-[14px]">
            Generate
          </button>
        </div>

        {error && (
          <div className="apple-card px-5 py-4 border-red-400/40">
            <p className="text-[13px] text-red-500">{error}</p>
          </div>
        )}

        {results.length > 0 && !error && (
          <div className="apple-card px-5 py-4">
            <div className="flex items-start gap-2 mb-2">
              <div className="flex-1 text-[32px] font-mono font-bold tracking-wide text-[var(--color-ink)] leading-snug break-all">
                {results.length === 1
                  ? results[0]
                  : results.map((n, i) => (
                      <span key={i}>
                        {n}
                        {i < results.length - 1 && <span className="text-[var(--color-ink-muted-48)] text-[20px]">, </span>}
                      </span>
                    ))}
              </div>
              <button onClick={copyResults} className="apple-btn-primary shrink-0 text-[12px] px-3 py-1 mt-1">
                Copy
              </button>
            </div>
          </div>
        )}
      </div>

      <Disclaimer type="utility" />
    </div>
  );
}
