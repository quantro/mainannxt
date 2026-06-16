"use client";
import { useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";
import { ToolCard, DownloadResult, FileInput } from "./ToolWrapper";

const SIZES = [
  { label: "A4 (210x297mm)", w: 595.28, h: 841.89 },
  { label: "Letter (8.5x11in)", w: 612, h: 792 },
  { label: "A3 (297x420mm)", w: 841.89, h: 1190.55 },
  { label: "Legal (8.5x14in)", w: 612, h: 1008 },
  { label: "Tabloid (11x17in)", w: 792, h: 1224 },
  { label: "Square (8.5x8.5in)", w: 612, h: 612 },
];

export default function StandardizePageSize() {
  const ref = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [sel, setSel] = useState(SIZES[0]);
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
      const copied = await out.copyPages(src, indices);
      for (const p of copied) {
        p.setSize(sel.w, sel.h);
        out.addPage(p);
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
      <ToolCard title="Target Page Size">
        <div className="grid grid-cols-2 gap-2">
          {SIZES.map((s) => (
            <button key={s.label} onClick={() => setSel(s)}
              className={`px-3 py-2 rounded-[11px] text-[12px] font-semibold text-left transition-all ${
                sel.label === s.label ? "bg-[var(--color-primary)] text-white" : "bg-[var(--color-surface-pearl)] text-[var(--color-ink-muted-48)]"
              }`}>{s.label}</button>
          ))}
        </div>
      </ToolCard>
      <button onClick={run} disabled={!file || loading}
        className="cosmic-btn-primary w-full h-11 text-[14px] disabled:opacity-40">
        {loading ? "Resizing\u2026" : "Standardize Size"}
      </button>
      <DownloadResult blob={blob} filename="standardized.pdf" label="Page size standardized" />
    </div>
  );
}
