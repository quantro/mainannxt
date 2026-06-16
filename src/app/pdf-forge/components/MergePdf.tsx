"use client";
import { useRef, useState, useMemo } from "react";
import { PDFDocument } from "pdf-lib";
import { ToolCard, DownloadResult, FileInput } from "./ToolWrapper";
import { formatSize } from "../utils";

export default function MergePdf() {
  const ref = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);

  const warn = useMemo(() => {
    if (files.length < 2) return "Select at least 2 PDF files.";
    return "";
  }, [files]);

  async function run() {
    if (files.length < 2) return;
    setLoading(true);
    setBlob(null);
    try {
      const merged = await PDFDocument.create();
      for (const f of files) {
        const src = await PDFDocument.load(await f.arrayBuffer());
        const pages = await merged.copyPages(src, src.getPageIndices());
        pages.forEach((p) => merged.addPage(p));
      }
      const b = (await merged.save()).buffer as ArrayBuffer;
      setBlob(new Blob([b], { type: "application/pdf" }));
    } catch (e: unknown) {
      alert("Merge failed: " + (e instanceof Error ? e.message : "Unknown error"));
    }
    setLoading(false);
  }

  return (
    <div className="w-full max-w-2xl space-y-4">
      <ToolCard title="Select PDFs">
        <FileInput accept=".pdf,application/pdf" multiple ref_={ref} onChange={(fl) => setFiles(Array.from(fl || []))} />
        {files.length > 0 && (
          <div className="mt-3 space-y-1">
            {files.map((f, i) => (
              <div key={i} className="flex items-center justify-between text-[12px] text-[var(--color-ink-muted-48)]">
                <span className="truncate">{i + 1}. {f.name}</span>
                <span>{formatSize(f.size)}</span>
              </div>
            ))}
          </div>
        )}
      </ToolCard>
      <button onClick={run} disabled={!!warn || loading}
        className="cosmic-btn-primary w-full h-11 text-[14px] disabled:opacity-40">
        {loading ? "Merging\u2026" : "Merge PDFs"}
      </button>
      {warn && !loading && <p className="text-[12px] text-[var(--color-ink-muted-48)] text-center">{warn}</p>}
      <DownloadResult blob={blob} filename="merged.pdf" label={`Merged ${files.length} files`} />
    </div>
  );
}
