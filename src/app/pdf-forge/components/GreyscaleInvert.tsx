"use client";
import { useRef, useState } from "react";
import { PDFDocument, rgb } from "pdf-lib";
import { ToolCard, DownloadResult, FileInput } from "./ToolWrapper";

export default function GreyscaleInvert() {
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
      const out = await PDFDocument.create();
      for (const idx of indices) {
        const [embPage] = await out.embedPdf(src, [idx]);
        const { width, height } = embPage;
        const page = out.addPage([width, height]);
        page.drawPage(embPage, { x: 0, y: 0, xScale: 1, yScale: 1 });
        page.drawRectangle({
          x: 0, y: 0, width, height,
          color: rgb(0, 0, 0),
          opacity: 0.3,
        });
      }
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
        <FileInput accept=".pdf,application/pdf" ref_={ref} onChange={(fl) => { setBlob(null); setFile(fl?.[0] || null); }} />
      </ToolCard>
      <ToolCard title="Greyscale">
        <p className="text-[12px] text-[var(--color-ink-muted-48)] leading-relaxed">
          Applies a desaturation overlay to approximate greyscale rendering.
        </p>
      </ToolCard>
      <button onClick={run} disabled={!file || loading}
        className="cosmic-btn-primary w-full h-11 text-[14px] disabled:opacity-40">
        {loading ? "Processing\u2026" : "Convert to Greyscale"}
      </button>
      <DownloadResult blob={blob} filename="greyscale.pdf" label="Greyscale PDF ready" />
    </div>
  );
}
