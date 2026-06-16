"use client";
import { useRef, useState } from "react";
import { PDFDocument, degrees, rgb } from "pdf-lib";
import { ToolCard, DownloadResult, FileInput } from "./ToolWrapper";

const POSITIONS = [
  { label: "Top Left", x: 0.05, y: 0.9 },
  { label: "Top Right", x: 0.6, y: 0.9 },
  { label: "Center", x: 0.35, y: 0.48 },
  { label: "Bottom Left", x: 0.05, y: 0.05 },
  { label: "Bottom Right", x: 0.6, y: 0.05 },
];

export default function AddStamp() {
  const ref = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("APPROVED");
  const [pos, setPos] = useState(POSITIONS[0]);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);

  async function run() {
    if (!file || !text.trim()) return;
    setLoading(true);
    setBlob(null);
    try {
      const pdf = await PDFDocument.load(await file.arrayBuffer());
      const font = await pdf.embedFont("Helvetica-Bold");
      const pages = pdf.getPages();
      for (const p of pages) {
        const { width, height } = p.getSize();
        const size = 24;
        p.drawText(text, {
          x: width * pos.x,
          y: height * pos.y,
          size,
          font,
          color: rgb(0.8, 0.2, 0.2),
          opacity: 0.7,
          rotate: degrees(-15),
        });
      }
      const buf = (await pdf.save()).buffer as ArrayBuffer;
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
      <ToolCard title="Stamp Text">
        <input value={text} onChange={(e) => setText(e.target.value)}
          placeholder="e.g. APPROVED, RECEIVED, DRAFT"
          className="cosmic-input w-full h-9 text-[13px] mb-3" />
        <div className="grid grid-cols-3 gap-2">
          {POSITIONS.map((p) => (
            <button key={p.label} onClick={() => setPos(p)}
              className={`px-3 py-2 rounded-[11px] text-[11px] font-semibold transition-all ${
                pos.label === p.label ? "bg-[var(--color-primary)] text-white" : "bg-[var(--color-surface-pearl)] text-[var(--color-ink-muted-48)]"
              }`}>{p.label}</button>
          ))}
        </div>
      </ToolCard>
      <button onClick={run} disabled={!file || !text.trim() || loading}
        className="cosmic-btn-primary w-full h-11 text-[14px] disabled:opacity-40">
        {loading ? "Stamping\u2026" : "Add Stamp"}
      </button>
      <DownloadResult blob={blob} filename="stamped.pdf" label="Stamp applied" />
    </div>
  );
}
