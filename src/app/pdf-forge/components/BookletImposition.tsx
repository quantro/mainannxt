"use client";
import { useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";
import { ToolCard, DownloadResult, FileInput } from "./ToolWrapper";

export default function BookletImposition() {
  const ref = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);

  async function run() {
    if (!file) return;
    setLoading(true);
    setBlob(null);
    try {
      const src = await PDFDocument.load(await file.arrayBuffer());
      const n = src.getPageCount();
      const out = await PDFDocument.create();
      const pages = src.getPageIndices();
      const total = n + (n % 4 === 0 ? 0 : 4 - (n % 4));
      for (let i = 0; i < total; i += 2) {
        const a = total - 1 - i;
        const b = i;
        for (const idx of [a, b]) {
          if (idx < n) {
            const [copied] = await out.copyPages(src, [idx]);
            out.addPage(copied);
          } else {
            out.addPage();
          }
        }
      }
      const buf = (await out.save()).buffer as ArrayBuffer;
      setBlob(new Blob([buf], { type: "application/pdf" }));
    } catch (e: unknown) {
      alert("Failed: " + (e instanceof Error ? e.message : "Unknown error"));
    }
    setLoading(false);
  }

  return (
    <div className="w-full max-w-2xl space-y-4">
      <ToolCard title="Select PDF">
        <FileInput accept=".pdf,application/pdf" ref_={ref} onChange={(fl) => { setBlob(null); setFile(fl?.[0] || null); }} />
      </ToolCard>
      <p className="text-[12px] text-[var(--color-ink-muted-48)] text-center">
        Reorders pages for saddle-stitch booklet printing. Adds blank pages if needed to make a multiple of 4. Print double-sided, fold, and staple.
      </p>
      <button onClick={run} disabled={!file || loading}
        className="cosmic-btn-primary w-full h-11 text-[14px] disabled:opacity-40">
        {loading ? "Arranging\u2026" : "Create Booklet"}
      </button>
      <DownloadResult blob={blob} filename="booklet.pdf" label="Booklet created" />
    </div>
  );
}
