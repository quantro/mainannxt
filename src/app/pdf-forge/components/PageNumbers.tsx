"use client";
import { useRef, useState } from "react";
import { PDFDocument, rgb } from "pdf-lib";
import { ToolCard, DownloadResult, FileInput } from "./ToolWrapper";

export default function PageNumbers() {
  const ref = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [pos, setPos] = useState<"bottom" | "top">("bottom");
  const [startNum, setStartNum] = useState("1");
  const [blob, setBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);

  async function run() {
    if (!file) return;
    setLoading(true);
    setBlob(null);
    try {
      const pdf = await PDFDocument.load(await file.arrayBuffer());
      const font = await pdf.embedFont("Helvetica");
      const start = parseInt(startNum) || 1;
      const pages = pdf.getPages();
      for (let i = 0; i < pages.length; i++) {
        const p = pages[i];
        const { width, height } = p.getSize();
        const num = (start + i).toString();
        const w = font.widthOfTextAtSize(num, 10);
        const x = (width - w) / 2;
        const y = pos === "bottom" ? 30 : height - 30;
        p.drawText(num, { x, y, size: 10, font, color: rgb(0.4, 0.4, 0.4) });
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
      <ToolCard title="Page Number Settings">
        <div className="flex gap-2 mb-3">
          {(["bottom", "top"] as const).map((p) => (
            <button key={p} onClick={() => setPos(p)}
              className={`flex-1 px-3 py-2 rounded-[11px] text-[13px] font-semibold transition-all ${
                pos === p ? "bg-[var(--color-primary)] text-white" : "bg-[var(--color-surface-pearl)] text-[var(--color-ink-muted-48)]"
              }`}>{p === "bottom" ? "Bottom" : "Top"}</button>
          ))}
        </div>
        <input value={startNum} onChange={(e) => setStartNum(e.target.value.replace(/\D/g, ""))}
          placeholder="Starting number"
          className="cosmic-input w-full h-9 text-[13px]" />
      </ToolCard>
      <button onClick={run} disabled={!file || loading}
        className="cosmic-btn-primary w-full h-11 text-[14px] disabled:opacity-40">
        {loading ? "Adding\u2026" : "Add Page Numbers"}
      </button>
      <DownloadResult blob={blob} filename="numbered.pdf" label="Page numbers added" />
    </div>
  );
}
