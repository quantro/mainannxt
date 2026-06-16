"use client";
import { useRef, useState } from "react";
import { PDFDocument, PDFName, PDFRawStream } from "pdf-lib";
import { ToolCard, DownloadResult, FileInput } from "./ToolWrapper";
import { formatSize } from "../utils";

export default function CompressPdf() {
  const ref = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(0.5);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [origSize, setOrigSize] = useState(0);
  const [loading, setLoading] = useState(false);

  async function run() {
    if (!file) return;
    setLoading(true);
    setBlob(null);
    setOrigSize(file.size);
    try {
      const buf = await file.arrayBuffer();
      const pdf = await PDFDocument.load(buf, { ignoreEncryption: true });
      pdf.setTitle(""); pdf.setAuthor(""); pdf.setSubject(""); pdf.setKeywords([]); pdf.setProducer(""); pdf.setCreator("");
      const objects = pdf.context.enumerateIndirectObjects();
      for (const [, obj] of objects) {
        if (obj instanceof PDFRawStream) {
          const f1 = obj.dict.get(PDFName.of("Filter"));
          const f2 = obj.dict.get(PDFName.of("SubFilter"));
          if ((f1 === PDFName.of("DCTDecode") || f2 === PDFName.of("DCTDecode")) && obj.contents.length > 100) {
            try {
              const blob2 = new Blob([obj.contents as BlobPart], { type: "image/jpeg" });
              const bitmap = await createImageBitmap(blob2);
              const c = document.createElement("canvas");
              c.width = bitmap.width; c.height = bitmap.height;
              c.getContext("2d")!.drawImage(bitmap, 0, 0);
              bitmap.close();
              const comp = await new Promise<Blob>((res) => c.toBlob((b) => res(b!), "image/jpeg", quality));
              const u = new Uint8Array(await comp.arrayBuffer());
              if (u.length < obj.contents.length) (obj as any).contents = u;
            } catch { /* skip */ }
          }
        }
      }
      const saved = await pdf.save({ useObjectStreams: true });
      setBlob(new Blob([saved.buffer as ArrayBuffer], { type: "application/pdf" }));
    } catch (e: unknown) {
      alert("Compression failed: " + (e instanceof Error ? e.message : "Unknown error"));
    }
    setLoading(false);
  }

  return (
    <div className="w-full max-w-2xl space-y-4">
      <ToolCard title="Select PDF">
        <FileInput accept=".pdf,application/pdf" ref_={ref} onChange={(fl) => { setBlob(null); setFile(fl?.[0] || null); }} />
      </ToolCard>
      <ToolCard title="Compression Level">
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-[var(--color-ink-muted-48)] w-10 text-right">Light</span>
          <input type="range" min="0" max="2" step="1"
            value={quality > 0.7 ? 0 : quality > 0.3 ? 1 : 2}
            onChange={(e) => setQuality(parseInt(e.target.value) === 0 ? 0.8 : parseInt(e.target.value) === 1 ? 0.5 : 0.2)}
            className="flex-1 accent-[var(--color-primary)]" />
          <span className="text-[11px] text-[var(--color-ink-muted-48)] w-10">Max</span>
        </div>
      </ToolCard>
      <button onClick={run} disabled={!file || loading}
        className="cosmic-btn-primary w-full h-11 text-[14px] disabled:opacity-40">
        {loading ? "Compressing\u2026" : "Compress PDF"}
      </button>
      {blob && (
        <div className="cosmic-card px-6 py-5 text-center">
          <p className="text-[13px] font-semibold text-[var(--color-ink)] mb-1">Compressed</p>
          <p className="text-[11px] text-[var(--color-ink-muted-48)] mb-3">{formatSize(origSize)} &rarr; {formatSize(blob.size)} ({Math.round((1 - blob.size / origSize) * 100)}% reduction)</p>
          <a href={URL.createObjectURL(blob)} download={"compressed-" + file?.name}
            className="inline-block cosmic-btn-primary px-6 py-2 text-[13px]">Download</a>
        </div>
      )}
    </div>
  );
}
