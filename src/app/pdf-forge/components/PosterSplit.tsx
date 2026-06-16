"use client";
import { useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";
import { ToolCard, DownloadResult, FileInput } from "./ToolWrapper";

export default function PosterSplit() {
  const ref = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [cols, setCols] = useState("2");
  const [rows, setRows] = useState("2");
  const [blob, setBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);

  async function run() {
    if (!file) return;
    setLoading(true);
    setBlob(null);
    try {
      const src = await PDFDocument.load(await file.arrayBuffer());
      const out = await PDFDocument.create();
      const c = parseInt(cols) || 2;
      const r = parseInt(rows) || 2;
      for (const idx of src.getPageIndices()) {
        const [emb] = await out.embedPdf(src, [idx]);
        const tw = emb.width / c;
        const th = emb.height / r;
        for (let row = 0; row < r; row++) {
          for (let col = 0; col < c; col++) {
            const page = out.addPage([tw, th]);
            page.drawPage(emb, {
              x: -col * tw,
              y: -(r - 1 - row) * th + (emb.height - th * r),
              xScale: 1,
              yScale: 1,
            });
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
      <ToolCard title="Grid Size">
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="text-[10px] font-semibold uppercase text-[var(--color-ink-muted-48)]">Columns</label>
            <input value={cols} onChange={(e) => setCols(e.target.value.replace(/\D/g, ""))}
              className="cosmic-input w-full h-9 text-[13px] mt-0.5" />
          </div>
          <div className="flex-1">
            <label className="text-[10px] font-semibold uppercase text-[var(--color-ink-muted-48)]">Rows</label>
            <input value={rows} onChange={(e) => setRows(e.target.value.replace(/\D/g, ""))}
              className="cosmic-input w-full h-9 text-[13px] mt-0.5" />
          </div>
        </div>
      </ToolCard>
      <button onClick={run} disabled={!file || loading}
        className="cosmic-btn-primary w-full h-11 text-[14px] disabled:opacity-40">
        {loading ? "Splitting\u2026" : "Split for Poster"}
      </button>
      <DownloadResult blob={blob} filename="poster-tiles.pdf" label="Poster tiles created" />
    </div>
  );
}
