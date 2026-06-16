"use client";
import { useRef, useState } from "react";
import { PDFDocument, degrees, rgb } from "pdf-lib";
import { ToolCard, DownloadResult, FileInput } from "./ToolWrapper";

export default function AddWatermark() {
  const ref = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("DRAFT");
  const [opacity, setOpacity] = useState(0.3);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);

  async function run() {
    if (!file || !text.trim()) return;
    setLoading(true);
    setBlob(null);
    try {
      const pdf = await PDFDocument.load(await file.arrayBuffer());
      const font = await pdf.embedFont("Helvetica");
      const pages = pdf.getPages();
      for (const p of pages) {
        const { width, height } = p.getSize();
        const size = Math.min(width, height) / 6;
        p.drawText(text, {
          x: width / 2 - font.widthOfTextAtSize(text, size) / 2,
          y: height / 2 - size / 2,
          size,
          font,
          color: rgb(opacity, opacity, opacity),
          opacity,
          rotate: degrees(-45),
        });
      }
      const b = (await pdf.save()).buffer as ArrayBuffer;
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
      <ToolCard title="Watermark Text">
        <input value={text} onChange={(e) => setText(e.target.value)}
          placeholder="Enter watermark text"
          className="cosmic-input w-full h-9 text-[13px] mb-3" />
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-[var(--color-ink-muted-48)]">Opacity</span>
          <input type="range" min="0.05" max="0.8" step="0.05" value={opacity}
            onChange={(e) => setOpacity(parseFloat(e.target.value))}
            className="flex-1 accent-[var(--color-primary)]" />
          <span className="text-[11px] text-[var(--color-ink-muted-48)] w-8">{Math.round(opacity * 100)}%</span>
        </div>
      </ToolCard>
      <button onClick={run} disabled={!file || !text.trim() || loading}
        className="cosmic-btn-primary w-full h-11 text-[14px] disabled:opacity-40">
        {loading ? "Applying\u2026" : "Add Watermark"}
      </button>
      <DownloadResult blob={blob} filename="watermarked.pdf" label="Watermark applied" />
    </div>
  );
}
