"use client";
import { useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";
import { ToolCard, DownloadResult, FileInput } from "./ToolWrapper";

export default function ReorderPages() {
  const ref = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [order, setOrder] = useState("");
  const [blob, setBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  async function run() {
    if (!file || !order.trim()) return;
    setLoading(true);
    setBlob(null);
    try {
      const pdf = await PDFDocument.load(await file.arrayBuffer());
      const t = pdf.getPageCount();
      setTotal(t);
      const pages = order.split(",").map((s) => parseInt(s.trim())).filter((n) => n >= 1 && n <= t);
      if (pages.length === 0) throw new Error("No valid pages");
      const out = await PDFDocument.create();
      const copied = await out.copyPages(pdf, pages.map((p) => p - 1));
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
      <ToolCard title="New Page Order">
        <input value={order} onChange={(e) => setOrder(e.target.value)}
          placeholder="e.g. 3, 1, 2, 5, 4"
          className="cosmic-input w-full h-9 text-[13px]" />
        {total > 0 && <p className="text-[11px] text-[var(--color-ink-muted-48)] mt-1">Enter page numbers in desired order (comma-separated). PDF has {total} pages.</p>}
      </ToolCard>
      <button onClick={run} disabled={!file || !order.trim() || loading}
        className="cosmic-btn-primary w-full h-11 text-[14px] disabled:opacity-40">
        {loading ? "Reordering\u2026" : "Reorder Pages"}
      </button>
      <DownloadResult blob={blob} filename="reordered.pdf" label="Pages reordered" />
    </div>
  );
}
