"use client";
import { useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";
import { ToolCard, DownloadResult, FileInput } from "./ToolWrapper";

export default function SplitPdf() {
  const ref = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [range, setRange] = useState("");
  const [blob, setBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  async function run() {
    if (!file || !range.trim()) return;
    setLoading(true);
    setBlob(null);
    try {
      const pdf = await PDFDocument.load(await file.arrayBuffer());
      const t = pdf.getPageCount();
      setTotal(t);
      const pages: number[] = [];
      for (const part of range.split(",")) {
        const tr = part.trim();
        if (tr.includes("-")) {
          const [a, b] = tr.split("-").map((s) => parseInt(s.trim()));
          const from = Math.max(1, Math.min(a, b));
          const to = Math.min(Math.max(a, b), t);
          for (let i = from; i <= to; i++) pages.push(i);
        } else {
          const n = parseInt(tr);
          if (n >= 1 && n <= t) pages.push(n);
        }
      }
      const u = [...new Set(pages)].filter((p) => p >= 1 && p <= t);
      if (u.length === 0) throw new Error("No valid pages");
      const out = await PDFDocument.create();
      const copied = await out.copyPages(pdf, u.map((p) => p - 1));
      copied.forEach((p) => out.addPage(p));
      const b = (await out.save()).buffer as ArrayBuffer;
      setBlob(new Blob([b], { type: "application/pdf" }));
    } catch (e: unknown) {
      alert("Split failed: " + (e instanceof Error ? e.message : "Unknown error"));
    }
    setLoading(false);
  }

  return (
    <div className="w-full max-w-2xl space-y-4">
      <ToolCard title="Select PDF">
        <FileInput accept=".pdf,application/pdf" ref_={ref} onChange={(fl) => { setBlob(null); setTotal(0); setFile(fl?.[0] || null); }} />
      </ToolCard>
      <ToolCard title="Page Range">
        <input value={range} onChange={(e) => setRange(e.target.value)}
          placeholder="e.g. 1-3, 5, 7-9"
          className="cosmic-input w-full h-9 text-[13px]" />
        {total > 0 && <p className="text-[11px] text-[var(--color-ink-muted-48)] mt-1">PDF has {total} pages.</p>}
      </ToolCard>
      <button onClick={run} disabled={!file || !range.trim() || loading}
        className="cosmic-btn-primary w-full h-11 text-[14px] disabled:opacity-40">
        {loading ? "Splitting\u2026" : "Split PDF"}
      </button>
      <DownloadResult blob={blob} filename="split.pdf" label="Extracted pages successfully" />
    </div>
  );
}
