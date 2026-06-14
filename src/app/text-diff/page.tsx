"use client";

import { useCallback, useMemo, useState } from "react";
import ThemeToggle from "../theme-toggle";
import { Disclaimer } from "../disclaimer";
import { PageTitle } from "../page-title";
import { useToast } from "../toast";

type DiffLine = { type: "added" | "removed" | "unchanged"; text: string };

function computeDiff(original: string, changed: string): DiffLine[] {
  const origLines = original.split("\n");
  const changedLines = changed.split("\n");
  const maxLen = Math.max(origLines.length, changedLines.length);
  const result: DiffLine[] = [];
  for (let i = 0; i < maxLen; i++) {
    const a = origLines[i] ?? "";
    const b = changedLines[i] ?? "";
    if (i >= origLines.length) {
      result.push({ type: "added", text: b });
    } else if (i >= changedLines.length) {
      result.push({ type: "removed", text: a });
    } else if (a === b) {
      result.push({ type: "unchanged", text: a });
    } else {
      result.push({ type: "removed", text: a });
      result.push({ type: "added", text: b });
    }
  }
  return result;
}

export default function TextDiffPage() {
  const [original, setOriginal] = useState("");
  const [changed, setChanged] = useState("");
  const [compared, setCompared] = useState(false);
  const { toast } = useToast();

  const diff = useMemo(() => {
    if (!compared) return [];
    return computeDiff(original, changed);
  }, [original, changed, compared]);

  const summary = useMemo(() => {
    const added = diff.filter((l) => l.type === "added").length;
    const removed = diff.filter((l) => l.type === "removed").length;
    const unchanged = diff.filter((l) => l.type === "unchanged").length;
    return { added, removed, unchanged };
  }, [diff]);

  const handleCompare = useCallback(() => {
    setCompared(true);
    if (original === changed) {
      toast("No differences found", "info");
    }
  }, [original, changed, toast]);

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-12">
      <PageTitle title="Text Diff" />
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <h1 className="cosmic-headline text-[32px] leading-[1.1] text-center mb-1">
        Text Diff Checker
      </h1>
      <p className="text-[13px] text-[var(--color-ink-muted-48)] mb-6 text-center max-w-lg">
        Compare two blocks of text and see what changed.
      </p>

      <div className="w-full max-w-4xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="cosmic-card px-5 py-4 space-y-3">
            <h2 className="text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-[var(--color-ink-muted-48)] uppercase">
              Original Text
            </h2>
            <textarea
              value={original}
              onChange={(e) => { setOriginal(e.target.value); setCompared(false); }}
              placeholder="Paste original text here..."
              className="cosmic-input w-full min-h-[200px] resize-y rounded-[11px] text-[13px] font-mono leading-[1.5]"
              spellCheck={false}
            />
          </div>
          <div className="cosmic-card px-5 py-4 space-y-3">
            <h2 className="text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-[var(--color-ink-muted-48)] uppercase">
              Changed Text
            </h2>
            <textarea
              value={changed}
              onChange={(e) => { setChanged(e.target.value); setCompared(false); }}
              placeholder="Paste changed text here..."
              className="cosmic-input w-full min-h-[200px] resize-y rounded-[11px] text-[13px] font-mono leading-[1.5]"
              spellCheck={false}
            />
          </div>
        </div>

        <div className="flex justify-center">
          <button onClick={handleCompare} className="cosmic-btn-primary text-[14px] px-8 py-2">
            Compare
          </button>
        </div>

        {compared && diff.length > 0 && (
          <>
            <div className="cosmic-card px-5 py-4 space-y-2">
              <div className="flex gap-4 text-[13px]">
                <span className="text-green-600 font-semibold">{summary.added} added</span>
                <span className="text-red-500 font-semibold">{summary.removed} removed</span>
                <span className="text-gray-400 font-semibold">{summary.unchanged} unchanged</span>
              </div>
            </div>
            <div className="cosmic-card px-5 py-4 space-y-0 overflow-hidden">
              {diff.map((line, i) => (
                <div
                  key={i}
                  className={`px-3 py-1 text-[13px] font-mono leading-[1.6] whitespace-pre-wrap ${
                    line.type === "added"
                      ? "bg-green-50 text-green-800"
                      : line.type === "removed"
                      ? "bg-red-50 text-red-700"
                      : "text-[var(--color-ink-muted-48)]"
                  }`}
                >
                  <span className="select-none mr-2 inline-block w-4 shrink-0">
                    {line.type === "added" ? "+" : line.type === "removed" ? "-" : " "}
                  </span>
                  {line.text || " "}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <Disclaimer type="utility" />
    </div>
  );
}
