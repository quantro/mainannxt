"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import ThemeToggle from "../theme-toggle";
import { Disclaimer } from "../disclaimer";
import { PageTitle } from "../page-title";

export default function Home() {
  const [names, setNames] = useState<string[]>(["", "", "", ""]);
  const [positions, setPositions] = useState<number[]>([0, 0, 0, 0]);
  const [offsets, setOffsets] = useState<number[]>([0, 0, 0, 0]);
  const [targetWord, setTargetWord] = useState("");
  const [showPositions, setShowPositions] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<{
    found: boolean;
    order: number[];
    letterIdxs: number[];
    recomputedOffsets: number[];
    assignments: { nameIdx: number; letterIdx: number }[];
  } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const updateName = useCallback((i: number, val: string) => {
    setNames((prev) => {
      const next = [...prev];
      next[i] = val;
      return next;
    });
  }, []);

  const addName = useCallback(() => {
    setNames((prev) => [...prev, ""]);
    setPositions((prev) => [...prev, 0]);
    setOffsets((prev) => [...prev, 0]);
  }, []);

  const removeName = useCallback((i: number) => {
    setNames((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((_, idx) => idx !== i);
    });
    setPositions((prev) => prev.filter((_, idx) => idx !== i));
    setOffsets((prev) => prev.filter((_, idx) => idx !== i));
    setImageUrl(null);
  }, []);

  const updatePosition = useCallback((i: number, val: number) => {
    setPositions((prev) => {
      const next = [...prev];
      next[i] = Math.max(0, val);
      return next;
    });
    setImageUrl(null);
  }, []);

  const updateOffset = useCallback((i: number, val: number) => {
    setOffsets((prev) => {
      const next = [...prev];
      next[i] = Math.max(0, val);
      return next;
    });
    setImageUrl(null);
  }, []);

  const word = useMemo(
    () =>
      names
        .map((name, i) => name[positions[i]] || "")
        .join("")
        .toLowerCase(),
    [names, positions]
  );

  const hasContent = useMemo(
    () => names.some((n) => n.trim().length > 0),
    [names]
  );

  function getKPermutations<T>(arr: T[], k: number): T[][] {
    if (k === 0) return [[]];
    const result: T[][] = [];
    for (let i = 0; i < arr.length; i++) {
      const rest = getKPermutations(
        arr.filter((_, idx) => idx !== i),
        k - 1
      );
      for (const r of rest) result.push([arr[i], ...r]);
    }
    return result;
  }

  function findPattern() {
    const letters = targetWord
      .toLowerCase()
      .replace(/[^a-zA-Z]/g, "")
      .split("");

    if (!letters.length) return;
    if (letters.length > names.length) {
      setSuggestion({
        found: false,
        order: [],
        letterIdxs: [],
        recomputedOffsets: [],
        assignments: [],
      });
      return;
    }

    const k = letters.length;
    const perms = getKPermutations(names.map((_, i) => i), k);

    type Candidate = { nameIdx: number; letterIdx: number };

    for (const order of perms) {
      const candidates: Candidate[][] = letters.map((ch, idx) => {
        const ni = order[idx];
        const name = names[ni].toLowerCase();
        const result: Candidate[] = [];
        for (let li = 0; li < name.length; li++) {
          if (name[li] === ch) result.push({ nameIdx: ni, letterIdx: li });
        }
        return result;
      });

      if (candidates.some((c) => c.length === 0)) continue;

      const used = new Set<number>();
      const result: (Candidate | null)[] = [];

      function backtrack(idx: number): boolean {
        if (idx === letters.length) return true;
        for (const c of candidates[idx]) {
          if (used.has(c.nameIdx)) continue;
          used.add(c.nameIdx);
          result[idx] = c;
          if (backtrack(idx + 1)) return true;
          used.delete(c.nameIdx);
          result[idx] = null;
        }
        return false;
      }

      if (backtrack(0)) {
        const assignments = result as Candidate[];
        const order = assignments.map((a) => a.nameIdx);
        const letterIdxs = assignments.map((a) => a.letterIdx);
        const maxPos = Math.max(...letterIdxs);
        const recomputedOffsets = letterIdxs.map((p) => maxPos - p);
        setSuggestion({
          found: true,
          order,
          letterIdxs,
          recomputedOffsets,
          assignments,
        });
        return;
      }
    }

    setSuggestion({
      found: false,
      order: [],
      letterIdxs: [],
      recomputedOffsets: [],
      assignments: letters.map(() => ({ nameIdx: 0, letterIdx: 0 })),
    });
  }

  function applySuggestion() {
    if (!suggestion || !suggestion.found) return;
    const { order, letterIdxs, recomputedOffsets } = suggestion;
    const used = new Set(order);
    const unused = names.map((_, i) => i).filter((i) => !used.has(i));
    const newOrder = [...order, ...unused];
    const newNames = newOrder.map((i) => names[i]);
    const newPositions = newOrder.map((i) => {
      const idx = order.indexOf(i);
      return idx !== -1 ? letterIdxs[idx] : positions[i];
    });
    const newOffsets = newOrder.map((i) => {
      const idx = order.indexOf(i);
      return idx !== -1 ? recomputedOffsets[idx] : offsets[i];
    });
    setNames(newNames);
    setPositions(newPositions);
    setOffsets(newOffsets);
    setImageUrl(null);
  }

  function generateImage() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dark =
      document.documentElement.getAttribute("data-theme") === "dark";

    const cellSize = 44;
    const cellGap = 4;
    const paddingX = 40;
    const paddingY = 40;
    const fontSize = 20;
    const highlightColor = "#0066cc";
    const emptyBg = dark ? "#2a2a2c" : "#fafaf9";
    const emptyBorder = dark ? "#38383a" : "#e7e5e4";
    const cellBg = dark ? "#272729" : "#f5f5f4";
    const cellBorder = dark ? "#38383a" : "#d6d3d1";
    const textColor = dark ? "#f5f5f7" : "#292524";
    const canvasBg = dark ? "#1d1d1f" : "#fefefe";
    const titleColor = dark ? "#f5f5f7" : "#1c1917";

    const cols = Math.max(
      ...names.map((n, i) => (n ? offsets[i] + n.length : 0)),
      1
    );
    const rows = names.length;

    const gridW = cols * (cellSize + cellGap) - cellGap;
    const gridH = rows * (cellSize + cellGap) - cellGap;
    const resultW = 60;
    const gap = 50;
    const titleH = 32;

    const canvasW = paddingX * 2 + gridW + gap + resultW;
    const canvasH = paddingY * 2 + titleH + 10 + gridH;

    canvas.width = canvasW * 2;
    canvas.height = canvasH * 2;
    canvas.style.width = `${canvasW}px`;
    canvas.style.height = `${canvasH}px`;
    ctx.scale(2, 2);

    ctx.fillStyle = canvasBg;
    ctx.fillRect(0, 0, canvasW, canvasH);

    ctx.fillStyle = titleColor;
    ctx.font = "600 18px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText("Word Maker", canvasW / 2, paddingY);

    const gridX = paddingX;
    const gridY = paddingY + titleH + 10;

    ctx.font = `600 ${fontSize}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (let r = 0; r < rows; r++) {
      const name = names[r] || "";
      const offset = offsets[r];
      for (let c = 0; c < cols; c++) {
        const x = gridX + c * (cellSize + cellGap);
        const y = gridY + r * (cellSize + cellGap);
        const localIdx = c - offset;
        const letter =
          localIdx >= 0 && localIdx < name.length ? name[localIdx] : "";

        if (!letter) {
          ctx.fillStyle = emptyBg;
          ctx.fillRect(x, y, cellSize, cellSize);
          ctx.strokeStyle = emptyBorder;
          ctx.lineWidth = 1;
          ctx.strokeRect(x, y, cellSize, cellSize);
          continue;
        }

        const isHighlighted = localIdx === positions[r];

        if (isHighlighted) {
          ctx.fillStyle = highlightColor;
          ctx.fillRect(x, y, cellSize, cellSize);
          ctx.fillStyle = "#fff";
        } else {
          ctx.fillStyle = cellBg;
          ctx.fillRect(x, y, cellSize, cellSize);
          ctx.fillStyle = textColor;
        }

        ctx.strokeStyle = isHighlighted ? highlightColor : cellBorder;
        ctx.lineWidth = isHighlighted ? 2 : 1;
        ctx.strokeRect(x, y, cellSize, cellSize);

        ctx.fillText(letter.toUpperCase(), x + cellSize / 2, y + cellSize / 2);
      }
    }

    const resultX = gridX + gridW + gap;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `600 ${fontSize}px system-ui, -apple-system, sans-serif`;

    const resultStartY = gridY + (gridH - rows * (cellSize + cellGap)) / 2;
    for (let r = 0; r < rows; r++) {
      const name = names[r] || "";
      const pos = positions[r];
      if (!name || !name[pos]) continue;

      const letter = name[pos].toUpperCase();
      const x = resultX + resultW / 2;
      const y = resultStartY + r * (cellSize + cellGap) + cellSize / 2;

      ctx.fillStyle = dark ? "#f5f5f7" : "#1c1917";
      ctx.fillText(letter, x - 1, y);
      ctx.fillText(letter, x + 1, y);
      ctx.fillText(letter, x, y - 1);
      ctx.fillText(letter, x, y + 1);

      ctx.fillStyle = highlightColor;
      ctx.fillText(letter, x, y);
    }

    setImageUrl(canvas.toDataURL("image/png"));
  }

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-12">
      <PageTitle title="Word Maker" />
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <h1 className="cosmic-headline text-[34px] leading-[1.47] tracking-[-0.374px] mb-8">
        Word Maker
      </h1>

      <div className="w-full max-w-2xl cosmic-card px-6 py-5 mb-5">
        <h2 className="text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-[var(--color-ink-muted-48)] mb-3 uppercase">
          Names
        </h2>
        <div className="space-y-2">
          {names.map((name, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-[14px] leading-[1.43] tracking-[-0.224px] text-[var(--color-ink-muted-48)] w-5 text-right shrink-0">
                {i + 1}
              </span>
              <input
                value={name}
                onChange={(e) => updateName(i, e.target.value)}
                placeholder={`Name ${i + 1}`}
                className="cosmic-input flex-1 h-10 text-[14px]"
              />
              {showPositions && (
                <input
                  type="number"
                  min={1}
                  max={Math.max(name.length || 1, 1)}
                  value={positions[i] + 1}
                  onChange={(e) =>
                    updatePosition(i, Math.max(0, Number(e.target.value) - 1))
                  }
                  className="w-14 h-10 px-2 text-center cosmic-input text-[14px]"
                  title="Position"
                />
              )}
              <button
                onClick={() => removeName(i)}
                disabled={names.length <= 1}
                className="text-[var(--color-ink-muted-48)] hover:text-[var(--color-primary)] disabled:opacity-30 text-lg leading-none px-1 transition-colors"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 mt-3">
          <button onClick={addName} className="cosmic-btn-ghost text-[12px]">
            + Add name
          </button>
          <button
            onClick={() => setShowPositions((v) => !v)}
            className="text-[12px] leading-[1] tracking-[-0.12px] text-[var(--color-ink-muted-48)] hover:text-[var(--color-primary)] transition-colors"
          >
            {showPositions ? "Hide" : "Show"} positions
          </button>
        </div>
      </div>

      {hasContent && (
        <div className="w-full max-w-2xl cosmic-card px-6 py-5 mb-5">
          <h2 className="text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-[var(--color-ink-muted-48)] mb-3 uppercase">
            Target Word
          </h2>
          <input
            value={targetWord}
            onChange={(e) =>
              setTargetWord(
                e.target.value.replace(/[^a-zA-Z]/g, "").toLowerCase()
              )
            }
            placeholder="Type a word to make..."
            className="cosmic-input w-full h-10 text-[14px]"
          />
          <div className="flex items-center gap-3 mt-3">
            <button
              onClick={findPattern}
              disabled={!targetWord}
              className="cosmic-btn cosmic-btn-primary text-[14px]"
            >
              Find Pattern
            </button>
          </div>
          {suggestion && (
            <div className="mt-4 text-[14px] leading-[1.43]">
              {suggestion.found ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[var(--color-primary)] text-[12px] font-semibold">
                      Found:
                    </span>
                    {targetWord.split("").map((ch, i) => {
                      const ni = suggestion.order[i];
                      const li = suggestion.letterIdxs[i];
                      return (
                        <span
                          key={i}
                          className="text-[12px] leading-[1] bg-[var(--color-surface-pearl)] text-[var(--color-ink)] px-2 py-1.5 rounded-[11px] border border-[var(--color-divider-soft)]"
                        >
                          <span className="font-semibold">
                            {ch.toUpperCase()}
                          </span>{" "}
                          {names[ni] || "?"} (pos {li + 1})
                        </span>
                      );
                    })}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {suggestion.order.map((ni, i) => (
                      <span
                        key={i}
                        className="text-[12px] text-[var(--color-ink-muted-48)]"
                      >
                        {names[ni] || `#${ni + 1}`} offset{" "}
                        {suggestion.recomputedOffsets[i]}
                      </span>
                    ))}
                    <button
                      onClick={applySuggestion}
                      className="text-[12px] text-[var(--color-primary)] hover:underline transition-colors"
                    >
                      Apply (reorder names)
                    </button>
                  </div>
                </div>
              ) : (
                <span className="text-[12px] text-[var(--color-ink-muted-48)]">
                  No pattern found. Try a different word or add more names.
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {hasContent && (
        <>
          <button
            onClick={() => setShowAdvanced((v) => !v)}
            className="text-[12px] leading-[1] tracking-[-0.12px] text-[var(--color-ink-muted-48)] hover:text-[var(--color-primary)] transition-colors mb-4"
          >
            {showAdvanced ? "Hide" : "Show"} offset &amp; advanced
          </button>

          {showAdvanced && (
            <div className="w-full max-w-2xl cosmic-card px-6 py-5 mb-5">
              <h2 className="text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-[var(--color-ink-muted-48)] mb-3 uppercase">
                Offset (grid column start)
              </h2>
              <div className="space-y-3">
                {names.map((name, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-[14px] leading-[1.43] tracking-[-0.224px] text-[var(--color-ink-muted-48)] truncate min-w-0 flex-1">
                      {name.trim() || `Name ${i + 1}`}
                    </span>
                    <span className="text-[12px] text-[var(--color-ink-muted-48)]">
                      offset
                    </span>
                    <input
                      type="number"
                      min={0}
                      value={offsets[i]}
                      onChange={(e) =>
                        updateOffset(i, Math.max(0, Number(e.target.value)))
                      }
                      className="w-14 h-10 px-2 text-center cosmic-input text-[14px]"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={generateImage}
            className="cosmic-btn cosmic-btn-primary text-[14px] mb-6"
          >
            Generate Image
          </button>
        </>
      )}

      {imageUrl && (
        <div className="w-full max-w-2xl cosmic-card px-6 py-5 mb-6">
          <img
            src={imageUrl}
            alt="Generated word art"
            className="w-full rounded-[11px]"
          />
          <a
            href={imageUrl}
            download="word-maker.png"
            className="cosmic-btn cosmic-btn-primary text-[14px] mt-4"
          >
            Download PNG
          </a>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
          <Disclaimer type="utility" />
    </div>
  );
}
