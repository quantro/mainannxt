"use client";
import { useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";
import { ToolCard, DownloadResult, FileInput } from "./ToolWrapper";

const LAYOUTS = [
  { label: "2-up", cols: 2, rows: 1 },
  { label: "4-up", cols: 2, rows: 2 },
  { label: "6-up", cols: 3, rows: 2 },
  { label: "8-up", cols: 4, rows: 2 },
  { label: "9-up", cols: 3, rows: 3 },
  { label: "16-up", cols: 4, rows: 4 },
];

export default function NUp() {
  const ref = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [layout, setLayout] = useState(LAYOUTS[0]);
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
      const a4w = 595.28;
      const a4h = 841.89;
      const gap = 10;
      const cw = (a4w - gap * (layout.cols + 1)) / layout.cols;
      const ch = (a4h - gap * (layout.rows + 1)) / layout.rows;
      const perSheet = layout.cols * layout.rows;
      for (let s = 0; s < indices.length; s += perSheet) {
        const sheet = out.addPage([a4w, a4h]);
        for (let i = 0; i < perSheet; i++) {
          const srcIdx = s + i;
          if (srcIdx >= indices.length) break;
          const [embPage] = await out.embedPdf(src, [indices[srcIdx]]);
          const { width: pw, height: ph } = embPage;
          const sx = cw / pw;
          const sy = ch / ph;
          const sc = Math.min(sx, sy);
          const dw = pw * sc;
          const dh = ph * sc;
          const col = i % layout.cols;
          const row = Math.floor(i / layout.cols);
          const x = gap + col * (cw + gap) + (cw - dw) / 2;
          const y = a4h - gap - (row + 1) * (ch + gap) + (ch - dh) / 2;
          sheet.drawPage(embPage, { x, y, xScale: sc, yScale: sc });
        }
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
      <ToolCard title="Pages Per Sheet">
        <div className="grid grid-cols-3 gap-2">
          {LAYOUTS.map((l) => (
            <button key={l.label} onClick={() => setLayout(l)}
              className={`px-3 py-2 rounded-[11px] text-[12px] font-semibold transition-all ${
                layout.label === l.label ? "bg-[var(--color-primary)] text-white" : "bg-[var(--color-surface-pearl)] text-[var(--color-ink-muted-48)]"
              }`}>{l.label}</button>
          ))}
        </div>
      </ToolCard>
      <button onClick={run} disabled={!file || loading}
        className="cosmic-btn-primary w-full h-11 text-[14px] disabled:opacity-40">
        {loading ? "Arranging\u2026" : "Arrange N-Up"}
      </button>
      <DownloadResult blob={blob} filename="nup.pdf" label="N-up layout created" />
    </div>
  );
}
