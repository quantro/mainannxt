"use client";
import { useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";
import { ToolCard, DownloadResult, FileInput } from "./ToolWrapper";

export default function PdfToSinglePage() {
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
      const indices = src.getPageIndices();
      const a4w = 595.28;
      let totalH = 0;
      const dims: { w: number; h: number }[] = [];
      for (const i of indices) {
        const [page] = await src.embedPdf(src, [i]);
        dims.push({ w: page.width, h: page.height });
        totalH += page.height;
      }
      const out = await PDFDocument.create();
      const single = out.addPage([a4w, totalH]);
      let yOff = totalH;
      for (let i = 0; i < indices.length; i++) {
        const [emb] = await out.embedPdf(src, [indices[i]]);
        const sc = a4w / emb.width;
        const dh = emb.height * sc;
        yOff -= dh;
        single.drawPage(emb, { x: 0, y: yOff, xScale: sc, yScale: sc });
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
        Stacks all pages vertically onto one long A4-width page.
      </p>
      <button onClick={run} disabled={!file || loading}
        className="cosmic-btn-primary w-full h-11 text-[14px] disabled:opacity-40">
        {loading ? "Merging\u2026" : "Convert to Single Page"}
      </button>
      <DownloadResult blob={blob} filename="single-page.pdf" label="Single page created" />
    </div>
  );
}
