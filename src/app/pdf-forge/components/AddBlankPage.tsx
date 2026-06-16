"use client";
import { useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";
import { ToolCard, DownloadResult, FileInput } from "./ToolWrapper";

export default function AddBlankPage() {
  const ref = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [after, setAfter] = useState("");
  const [blob, setBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  async function run() {
    if (!file) return;
    setLoading(true);
    setBlob(null);
    try {
      const pdf = await PDFDocument.load(await file.arrayBuffer());
      const t = pdf.getPageCount();
      setTotal(t);
      const page = after.trim() ? parseInt(after.trim()) : t;
      const idx = Math.max(0, Math.min(page, t));
      pdf.insertPage(idx);
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
        <FileInput accept=".pdf,application/pdf" ref_={ref} onChange={(fl) => { setBlob(null); setTotal(0); setFile(fl?.[0] || null); }} />
      </ToolCard>
      <ToolCard title="Insert After Page">
        <input value={after} onChange={(e) => setAfter(e.target.value)}
          placeholder="Leave empty for end of document"
          className="cosmic-input w-full h-9 text-[13px]" />
        {total > 0 && <p className="text-[11px] text-[var(--color-ink-muted-48)] mt-1">PDF has {total} pages.</p>}
      </ToolCard>
      <button onClick={run} disabled={!file || loading}
        className="cosmic-btn-primary w-full h-11 text-[14px] disabled:opacity-40">
        {loading ? "Adding\u2026" : "Add Blank Page"}
      </button>
      <DownloadResult blob={blob} filename="with-blank.pdf" label="Blank page added" />
    </div>
  );
}
