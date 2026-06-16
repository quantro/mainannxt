"use client";
import { useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";
import { ToolCard, DownloadResult, FileInput } from "./ToolWrapper";

export default function DeletePages() {
  const ref = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [ranges, setRanges] = useState("");
  const [blob, setBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  async function run() {
    if (!file || !ranges.trim()) return;
    setLoading(true);
    setBlob(null);
    try {
      const pdf = await PDFDocument.load(await file.arrayBuffer());
      const t = pdf.getPageCount();
      setTotal(t);
      const toDelete = new Set<number>();
      for (const part of ranges.split(",")) {
        const tr = part.trim();
        if (tr.includes("-")) {
          const [a, b] = tr.split("-").map((s) => parseInt(s.trim()));
          const from = Math.max(1, Math.min(a, b));
          const to2 = Math.min(Math.max(a, b), t);
          for (let i = from; i <= to2; i++) toDelete.add(i - 1);
        } else {
          const n = parseInt(tr);
          if (n >= 1 && n <= t) toDelete.add(n - 1);
        }
      }
      const keep = pdf.getPageIndices().filter((i) => !toDelete.has(i));
      if (keep.length === 0) throw new Error("Would delete all pages");
      const out = await PDFDocument.create();
      const copied = await out.copyPages(pdf, keep);
      copied.forEach((p) => out.addPage(p));
      const b = (await out.save()).buffer as ArrayBuffer;
      setBlob(new Blob([b], { type: "application/pdf" }));
    } catch (e: unknown) {
      alert("Failed: " + (e instanceof Error ? e.message : "Unknown error"));
    }
    setLoading(false);
  }

  return (
    <div className="w-full max-w-2xl space-y-4">
      <ToolCard title="Select PDF">
        <FileInput accept=".pdf,application/pdf" ref_={ref} onChange={(fl) => { setBlob(null); setTotal(0); setFile(fl?.[0] || null); }} />
      </ToolCard>
      <ToolCard title="Pages to Delete">
        <input value={ranges} onChange={(e) => setRanges(e.target.value)}
          placeholder="e.g. 1, 3-5, 7"
          className="cosmic-input w-full h-9 text-[13px]" />
        {total > 0 && <p className="text-[11px] text-[var(--color-ink-muted-48)] mt-1">PDF has {total} pages.</p>}
      </ToolCard>
      <button onClick={run} disabled={!file || !ranges.trim() || loading}
        className="cosmic-btn-primary w-full h-11 text-[14px] disabled:opacity-40">
        {loading ? "Deleting\u2026" : "Delete Pages"}
      </button>
      <DownloadResult blob={blob} filename="deleted.pdf" label="Pages deleted" />
    </div>
  );
}
