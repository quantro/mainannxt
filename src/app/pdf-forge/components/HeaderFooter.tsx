"use client";
import { useRef, useState } from "react";
import { PDFDocument, rgb } from "pdf-lib";
import { ToolCard, DownloadResult, FileInput } from "./ToolWrapper";

export default function HeaderFooter() {
  const ref = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [header, setHeader] = useState("");
  const [footer, setFooter] = useState("");
  const [blob, setBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);

  async function run() {
    if (!file) return;
    setLoading(true);
    setBlob(null);
    try {
      const pdf = await PDFDocument.load(await file.arrayBuffer());
      const font = await pdf.embedFont("Helvetica");
      const pages = pdf.getPages();
      for (const p of pages) {
        const { width, height } = p.getSize();
        if (header.trim()) {
          p.drawText(header.trim(), { x: 36, y: height - 24, size: 9, font, color: rgb(0.5, 0.5, 0.5) });
        }
        if (footer.trim()) {
          p.drawText(footer.trim(), { x: 36, y: 18, size: 9, font, color: rgb(0.5, 0.5, 0.5) });
        }
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
      <ToolCard title="Header &amp; Footer">
        <input value={header} onChange={(e) => setHeader(e.target.value)}
          placeholder="Header text (optional)"
          className="cosmic-input w-full h-9 text-[13px] mb-2" />
        <input value={footer} onChange={(e) => setFooter(e.target.value)}
          placeholder="Footer text (optional)"
          className="cosmic-input w-full h-9 text-[13px]" />
      </ToolCard>
      <button onClick={run} disabled={!file || loading}
        className="cosmic-btn-primary w-full h-11 text-[14px] disabled:opacity-40">
        {loading ? "Applying\u2026" : "Add Header & Footer"}
      </button>
      <DownloadResult blob={blob} filename="header-footer.pdf" label="Header & footer applied" />
    </div>
  );
}
