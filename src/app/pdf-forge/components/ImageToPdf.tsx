"use client";
import { useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";
import { ToolCard, DownloadResult, FileInput } from "./ToolWrapper";
import { formatSize } from "../utils";

export default function ImageToPdf() {
  const ref = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);

  async function run() {
    if (files.length === 0) return;
    setLoading(true);
    setBlob(null);
    try {
      const pdf = await PDFDocument.create();
      for (const f of files) {
        const buf = await f.arrayBuffer();
        let img;
        if (f.type === "image/png" || f.name.toLowerCase().endsWith(".png")) {
          img = await pdf.embedPng(buf);
        } else if (f.type?.startsWith("image/jpeg") || /\.jpe?g$/i.test(f.name)) {
          img = await pdf.embedJpg(buf);
        } else {
          const bitmap = await createImageBitmap(new Blob([buf], { type: f.type }));
          const c = document.createElement("canvas");
          c.width = bitmap.width; c.height = bitmap.height;
          c.getContext("2d")!.drawImage(bitmap, 0, 0);
          bitmap.close();
          const png = await new Promise<Blob>((res) => c.toBlob((b) => res(b!), "image/png"));
          img = await pdf.embedPng(await png.arrayBuffer());
        }
        const page = pdf.addPage([img.width, img.height]);
        page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
      }
      if (pdf.getPageCount() === 0) throw new Error("No pages");
      const b = (await pdf.save()).buffer as ArrayBuffer;
      setBlob(new Blob([b], { type: "application/pdf" }));
    } catch (e: unknown) {
      alert("Conversion failed: " + (e instanceof Error ? e.message : "Unknown error"));
    }
    setLoading(false);
  }

  return (
    <div className="w-full max-w-2xl space-y-4">
      <ToolCard title="Select Images">
        <FileInput accept="image/*" multiple ref_={ref} onChange={(fl) => setFiles(Array.from(fl || []))} />
        <p className="text-[10px] text-[var(--color-ink-muted-48)] mt-1.5">JPG, PNG, WebP, BMP, HEIC, SVG, and more</p>
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
      <button onClick={run} disabled={files.length === 0 || loading}
        className="cosmic-btn-primary w-full h-11 text-[14px] disabled:opacity-40">
        {loading ? "Converting\u2026" : "Convert to PDF"}
      </button>
      <DownloadResult blob={blob} filename="images.pdf" label={`Converted ${files.length} image${files.length > 1 ? "s" : ""} to PDF`} />
    </div>
  );
}
