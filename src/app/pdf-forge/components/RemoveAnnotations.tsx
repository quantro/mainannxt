"use client";
import { useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";
import { ToolCard, DownloadResult, FileInput } from "./ToolWrapper";

export default function RemoveAnnotations() {
  const ref = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  async function run() {
    if (!file) return;
    setLoading(true);
    setBlob(null);
    try {
      const pdf = await PDFDocument.load(await file.arrayBuffer());
      let count = 0;
      for (const page of pdf.getPages()) {
        const annots = page.node.Annots();
        if (annots) {
          count += annots.size();
          while (annots.size() > 0) annots.remove(0);
        }
      }
      setTotal(count);
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
      <p className="text-[12px] text-[var(--color-ink-muted-48)] text-center">
        Strips all annotations, comments, highlights, and markup from every page.
      </p>
      <button onClick={run} disabled={!file || loading}
        className="cosmic-btn-primary w-full h-11 text-[14px] disabled:opacity-40">
        {loading ? "Removing\u2026" : "Remove Annotations"}
      </button>
      {total > 0 && <p className="text-[12px] text-[var(--color-ink-muted-48)] text-center">Removed {total} annotation{total !== 1 ? "s" : ""}</p>}
      <DownloadResult blob={blob} filename="clean.pdf" label="Annotations removed" />
    </div>
  );
}
