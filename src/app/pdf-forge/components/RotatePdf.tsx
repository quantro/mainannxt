"use client";
import { useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";
import { ToolCard, DownloadResult, FileInput } from "./ToolWrapper";

const ROTATIONS = [0, 90, 180, 270] as const;

export default function RotatePdf() {
  const ref = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [deg, setDeg] = useState<number>(90);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);

  async function run() {
    if (!file) return;
    setLoading(true);
    setBlob(null);
    try {
      const pdf = await PDFDocument.load(await file.arrayBuffer());
      pdf.getPages().forEach((p) => {
        const r = p.getRotation();
        p.setRotation({ ...r, angle: ((r?.angle || 0) + deg) % 360 });
      });
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
      <ToolCard title="Rotation Angle">
        <div className="flex gap-2">
          {ROTATIONS.map((d) => (
            <button key={d} onClick={() => setDeg(d)}
              className={`flex-1 px-3 py-2 rounded-[11px] text-[13px] font-semibold transition-all ${
                deg === d ? "bg-[var(--color-primary)] text-white" : "bg-[var(--color-surface-pearl)] text-[var(--color-ink-muted-48)]"
              }`}>{d}\u00B0</button>
          ))}
        </div>
      </ToolCard>
      <button onClick={run} disabled={!file || loading}
        className="cosmic-btn-primary w-full h-11 text-[14px] disabled:opacity-40">
        {loading ? "Rotating\u2026" : "Rotate PDF"}
      </button>
      <DownloadResult blob={blob} filename="rotated.pdf" label="Rotated successfully" />
    </div>
  );
}
