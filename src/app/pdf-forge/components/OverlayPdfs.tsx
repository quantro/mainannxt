"use client";
import { useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";
import { ToolCard, DownloadResult, FileInput } from "./ToolWrapper";

export default function OverlayPdfs() {
  const ref1 = useRef<HTMLInputElement>(null);
  const ref2 = useRef<HTMLInputElement>(null);
  const [fileA, setFileA] = useState<File | null>(null);
  const [fileB, setFileB] = useState<File | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);

  async function run() {
    if (!fileA || !fileB) return;
    setLoading(true);
    setBlob(null);
    try {
      const base = await PDFDocument.load(await fileA.arrayBuffer());
      const overlay = await PDFDocument.load(await fileB.arrayBuffer());
      const pages = base.getPages();
      const max = Math.min(pages.length, overlay.getPageCount());
      for (let i = 0; i < max; i++) {
        const [emb] = await base.embedPdf(overlay, [i]);
        const { width, height } = pages[i].getSize();
        pages[i].drawPage(emb, { x: 0, y: 0, xScale: 1, yScale: 1 });
      }
      const buf = (await base.save()).buffer as ArrayBuffer;
      setBlob(new Blob([buf], { type: "application/pdf" }));
    } catch (e: unknown) {
      alert("Failed: " + (e instanceof Error ? e.message : "Unknown error"));
    }
    setLoading(false);
  }

  return (
    <div className="w-full max-w-2xl space-y-4">
      <ToolCard title="Base PDF (overlay will be placed on top)">
        <FileInput accept=".pdf,application/pdf" ref_={ref1} onChange={(fl) => { setBlob(null); setFileA(fl?.[0] || null); }} />
      </ToolCard>
      <ToolCard title="Overlay PDF">
        <FileInput accept=".pdf,application/pdf" ref_={ref2} onChange={(fl) => { setBlob(null); setFileB(fl?.[0] || null); }} />
      </ToolCard>
      <p className="text-[12px] text-[var(--color-ink-muted-48)] text-center">
        Overlays matching pages from the second PDF onto the first, page by page.
      </p>
      <button onClick={run} disabled={!fileA || !fileB || loading}
        className="cosmic-btn-primary w-full h-11 text-[14px] disabled:opacity-40">
        {loading ? "Overlaying\u2026" : "Overlay PDFs"}
      </button>
      <DownloadResult blob={blob} filename="overlay.pdf" label="PDFs overlaid" />
    </div>
  );
}
