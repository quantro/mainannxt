"use client";
import { useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";
import { ToolCard, DownloadResult, FileInput } from "./ToolWrapper";

export default function CropPdf() {
  const ref = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [top, setTop] = useState("0");
  const [bottom, setBottom] = useState("0");
  const [left, setLeft] = useState("0");
  const [right, setRight] = useState("0");
  const [blob, setBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);

  async function run() {
    if (!file) return;
    setLoading(true);
    setBlob(null);
    try {
      const pdf = await PDFDocument.load(await file.arrayBuffer());
      for (const page of pdf.getPages()) {
        const { width, height } = page.getSize();
        const t = parseFloat(top) || 0;
        const b = parseFloat(bottom) || 0;
        const l = parseFloat(left) || 0;
        const r = parseFloat(right) || 0;
        page.setCropBox(l, b, width - l - r, height - t - b);
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
      <ToolCard title="Crop Margins (points)">
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Top", val: top, set: setTop },
            { label: "Bottom", val: bottom, set: setBottom },
            { label: "Left", val: left, set: setLeft },
            { label: "Right", val: right, set: setRight },
          ].map(({ label, val, set }) => (
            <div key={label}>
              <label className="text-[10px] font-semibold uppercase text-[var(--color-ink-muted-48)]">{label}</label>
              <input value={val} onChange={(e) => set(e.target.value.replace(/[^0-9.]/g, ""))}
                className="cosmic-input w-full h-9 text-[13px] mt-0.5" />
            </div>
          ))}
        </div>
      </ToolCard>
      <button onClick={run} disabled={!file || loading}
        className="cosmic-btn-primary w-full h-11 text-[14px] disabled:opacity-40">
        {loading ? "Cropping\u2026" : "Crop PDF"}
      </button>
      <DownloadResult blob={blob} filename="cropped.pdf" label="PDF cropped" />
    </div>
  );
}
