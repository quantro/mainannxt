"use client";

import { useMemo, useRef, useState } from "react";
import { PDFDocument, PDFName, PDFRawStream, rgb } from "pdf-lib";
import ThemeToggle from "../theme-toggle";
import { Disclaimer } from "../disclaimer";

type Tool = "compress" | "merge" | "split" | "image" | "text";

const TOOLS: { key: Tool; icon: string; label: string }[] = [
  { key: "compress", icon: "\uD83D\uDCE6", label: "Compress PDF" },
  { key: "merge", icon: "\uD83D\uDCCB", label: "Merge PDFs" },
  { key: "split", icon: "\u2702\uFE0F", label: "Split PDF" },
  { key: "image", icon: "\uD83D\uDDBC\uFE0F", label: "Image to PDF" },
  { key: "text", icon: "\u270D\uFE0F", label: "Text to PDF" },
];

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1048576).toFixed(1) + " MB";
}

export default function PdfForgePage() {
  const [tab, setTab] = useState<Tool>("merge");

  const [mergeFiles, setMergeFiles] = useState<File[]>([]);
  const [mergeBlob, setMergeBlob] = useState<Blob | null>(null);
  const [mergeLoading, setMergeLoading] = useState(false);

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const [imageLoading, setImageLoading] = useState(false);

  const [text, setText] = useState("");
  const [textBlob, setTextBlob] = useState<Blob | null>(null);
  const [textLoading, setTextLoading] = useState(false);

  const [compressFile, setCompressFile] = useState<File | null>(null);
  const [compressQuality, setCompressQuality] = useState(0.5);
  const [compressBlob, setCompressBlob] = useState<Blob | null>(null);
  const [compressOrigSize, setCompressOrigSize] = useState(0);
  const [compressLoading, setCompressLoading] = useState(false);

  const [splitFile, setSplitFile] = useState<File | null>(null);
  const [splitRange, setSplitRange] = useState("");
  const [splitBlob, setSplitBlob] = useState<Blob | null>(null);
  const [splitLoading, setSplitLoading] = useState(false);
  const [splitTotalPages, setSplitTotalPages] = useState(0);

  const mergeInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const compressInputRef = useRef<HTMLInputElement>(null);
  const splitInputRef = useRef<HTMLInputElement>(null);

  async function doMerge() {
    if (mergeFiles.length < 2) return;
    setMergeLoading(true);
    setMergeBlob(null);
    try {
      const merged = await PDFDocument.create();
      for (const file of mergeFiles) {
        const src = await PDFDocument.load(await file.arrayBuffer());
        const pages = await merged.copyPages(src, src.getPageIndices());
        pages.forEach((p) => merged.addPage(p));
      }
      const pdfBytes = (await merged.save()).buffer as ArrayBuffer;
      setMergeBlob(new Blob([pdfBytes], { type: "application/pdf" }));
    } catch (e: unknown) {
      alert("Merge failed: " + (e instanceof Error ? e.message : "Unknown error"));
    }
    setMergeLoading(false);
  }

  async function doImageToPdf() {
    if (imageFiles.length === 0) return;
    setImageLoading(true);
    setImageBlob(null);
    try {
      const pdf = await PDFDocument.create();
      for (const file of imageFiles) {
        const buf = await file.arrayBuffer();
        let img;
        if (file.type === "image/png" || file.name.toLowerCase().endsWith(".png")) {
          img = await pdf.embedPng(buf);
        } else if (file.type?.startsWith("image/jpeg") || file.name.toLowerCase().endsWith(".jpg") || file.name.toLowerCase().endsWith(".jpeg")) {
          img = await pdf.embedJpg(buf);
        } else {
          const blob = new Blob([buf], { type: file.type || "image/png" });
          const bitmap = await createImageBitmap(blob);
          const canvas = document.createElement("canvas");
          canvas.width = bitmap.width;
          canvas.height = bitmap.height;
          const ctx = canvas.getContext("2d")!;
          ctx.drawImage(bitmap, 0, 0);
          bitmap.close();
          const pngBlob = await new Promise<Blob>((res) => canvas.toBlob((b) => res(b!), "image/png"));
          img = await pdf.embedPng(await pngBlob.arrayBuffer());
        }
        const page = pdf.addPage([img.width, img.height]);
        page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
      }
      if (pdf.getPageCount() === 0) throw new Error("No pages created");
      const pdfBytes = (await pdf.save()).buffer as ArrayBuffer;
      setImageBlob(new Blob([pdfBytes], { type: "application/pdf" }));
    } catch (e: unknown) {
      alert("Conversion failed: " + (e instanceof Error ? e.message : "Unknown error"));
    }
    setImageLoading(false);
  }

  async function doTextToPdf() {
    const t = text.trim();
    if (!t) return;
    setTextLoading(true);
    setTextBlob(null);
    try {
      const pdf = await PDFDocument.create();
      const helvetica = await pdf.embedFont("Helvetica");
      const fontSize = 12;
      const margin = 50;
      const pageWidth = 612;
      const pageHeight = 792;
      const maxWidth = pageWidth - margin * 2;
      const lines: string[] = [];
      for (const para of t.split("\n")) {
        const words = para.split(" ");
        let line = "";
        for (const word of words) {
          const test = line ? line + " " + word : word;
          if (helvetica.widthOfTextAtSize(test, fontSize) > maxWidth) {
            lines.push(line);
            line = word;
          } else {
            line = test;
          }
        }
        if (line) lines.push(line);
        lines.push("");
      }
      let y = pageHeight - margin;
      let page = pdf.addPage([pageWidth, pageHeight]);
      for (const line of lines) {
        if (y < margin + fontSize) {
          page = pdf.addPage([pageWidth, pageHeight]);
          y = pageHeight - margin;
        }
        page.drawText(line || " ", {
          x: margin,
          y: y - fontSize,
          size: fontSize,
          font: helvetica,
          color: rgb(0, 0, 0),
        });
        y -= line === "" ? fontSize * 1.5 : fontSize * 1.35;
      }
      const pdfBytes = (await pdf.save()).buffer as ArrayBuffer;
      setTextBlob(new Blob([pdfBytes], { type: "application/pdf" }));
    } catch (e: unknown) {
      alert("PDF creation failed: " + (e instanceof Error ? e.message : "Unknown error"));
    }
    setTextLoading(false);
  }

  async function doCompress() {
    const file = compressFile;
    if (!file) return;
    setCompressLoading(true);
    setCompressBlob(null);
    const origSize = file.size;
    setCompressOrigSize(origSize);
    try {
      const buf = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buf, { ignoreEncryption: true });

      pdfDoc.setTitle("");
      pdfDoc.setAuthor("");
      pdfDoc.setSubject("");
      pdfDoc.setKeywords([]);
      pdfDoc.setProducer("");
      pdfDoc.setCreator("");

      const quality = compressQuality;
      const objects = pdfDoc.context.enumerateIndirectObjects();
      for (const [, obj] of objects) {
        if (obj instanceof PDFRawStream) {
          const filter = obj.dict.get(PDFName.of("Filter"));
          const filter2 = obj.dict.get(PDFName.of("SubFilter"));
          if (
            (filter === PDFName.of("DCTDecode") || filter2 === PDFName.of("DCTDecode")) &&
            obj.contents.length > 100
          ) {
            try {
              const blob = new Blob([obj.contents as BlobPart], { type: "image/jpeg" });
              const bitmap = await createImageBitmap(blob);
              const canvas = document.createElement("canvas");
              canvas.width = bitmap.width;
              canvas.height = bitmap.height;
              const ctx = canvas.getContext("2d")!;
              ctx.drawImage(bitmap, 0, 0);
              bitmap.close();
              const compressedBlob = await new Promise<Blob>((res) =>
                canvas.toBlob((b) => res(b!), "image/jpeg", quality)
              );
              const compressed = new Uint8Array(await compressedBlob.arrayBuffer());
              if (compressed.length < obj.contents.length) {
                (obj as any).contents = compressed;
              }
            } catch {
              /* skip images that fail */
            }
          }
        }
      }

      const saved = await pdfDoc.save({ useObjectStreams: true });
      const compressedBytes = saved.buffer as ArrayBuffer;
      setCompressBlob(new Blob([compressedBytes], { type: "application/pdf" }));
    } catch (e: unknown) {
      alert("Compression failed: " + (e instanceof Error ? e.message : "Unknown error"));
    }
    setCompressLoading(false);
  }

  async function doSplit() {
    const file = splitFile;
    const range = splitRange.trim();
    if (!file || !range) return;
    setSplitLoading(true);
    setSplitBlob(null);
    try {
      const pdfDoc = await PDFDocument.load(await file.arrayBuffer());
      const total = pdfDoc.getPageCount();
      setSplitTotalPages(total);
      const pages: number[] = [];
      for (const part of range.split(",")) {
        const trimmed = part.trim();
        if (trimmed.includes("-")) {
          const [a, b] = trimmed.split("-").map((s) => parseInt(s.trim()));
          const from = Math.max(1, Math.min(a, b));
          const to = Math.min(Math.max(a, b), total);
          for (let i = from; i <= to; i++) pages.push(i);
        } else {
          const n = parseInt(trimmed);
          if (n >= 1 && n <= total) pages.push(n);
        }
      }
      const unique = [...new Set(pages)].filter((p) => p >= 1 && p <= total);
      if (unique.length === 0) throw new Error("No valid pages in range");
      const out = await PDFDocument.create();
      const copied = await out.copyPages(pdfDoc, unique.map((p) => p - 1));
      copied.forEach((p) => out.addPage(p));
      const pdfBytes = (await out.save()).buffer as ArrayBuffer;
      setSplitBlob(new Blob([pdfBytes], { type: "application/pdf" }));
    } catch (e: unknown) {
      alert("Split failed: " + (e instanceof Error ? e.message : "Unknown error"));
    }
    setSplitLoading(false);
  }

  const mergeWarn = useMemo(() => {
    if (mergeFiles.length < 2) return "Select at least 2 PDF files to merge.";
    return "";
  }, [mergeFiles]);

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-12">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <h1 className="apple-headline text-[34px] leading-[1.47] tracking-[-0.374px] mb-2">
        PDF Forge
      </h1>
      <p className="text-[13px] text-[var(--color-ink-muted-48)] mb-6 text-center max-w-lg">
        Client-side PDF tools: compress, merge, image-to-PDF, and text-to-PDF. Nothing leaves your device.
      </p>

      <div className="w-full max-w-2xl flex gap-1 mb-5">
        {TOOLS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 px-3 py-2.5 rounded-[11px] text-[13px] font-semibold transition-all ${
              tab === t.key
                ? "bg-[var(--color-primary)] text-white"
                : "bg-[var(--color-surface-pearl)] text-[var(--color-ink-muted-48)] hover:brightness-95"
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {tab === "compress" && (
        <div className="w-full max-w-2xl space-y-4">
          <div className="apple-card px-6 py-5">
            <h2 className="text-[12px] font-semibold uppercase text-[var(--color-ink-muted-48)] mb-3">Select PDF</h2>
            <input
              ref={compressInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={(e) => {
                setCompressBlob(null);
                setCompressFile(e.target.files?.[0] || null);
              }}
              className="w-full text-[13px] file:mr-2 file:px-3 file:py-1.5 file:rounded-[8px] file:border-0 file:text-[12px] file:font-semibold file:bg-[var(--color-primary)] file:text-white file:cursor-pointer"
            />
            {compressFile && (
              <div className="mt-3 flex items-center justify-between text-[12px] text-[var(--color-ink-muted-48)]">
                <span className="truncate">{compressFile.name}</span>
                <span>{formatSize(compressFile.size)}</span>
              </div>
            )}
          </div>
          <div className="apple-card px-6 py-5">
            <h2 className="text-[12px] font-semibold uppercase text-[var(--color-ink-muted-48)] mb-3">Compression Level</h2>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-[var(--color-ink-muted-48)] w-10 text-right">Light</span>
              <input
                type="range"
                min="0"
                max="2"
                step="1"
                value={compressQuality > 0.7 ? 0 : compressQuality > 0.3 ? 1 : 2}
                onChange={(e) => {
                  const v = parseInt(e.target.value);
                  setCompressQuality(v === 0 ? 0.8 : v === 1 ? 0.5 : 0.2);
                }}
                className="flex-1 accent-[var(--color-primary)]"
              />
              <span className="text-[11px] text-[var(--color-ink-muted-48)] w-10">Max</span>
            </div>
            <p className="text-[11px] text-[var(--color-ink-muted-48)] mt-2 text-center">
              Recompresses JPEG images at the selected quality + deflate stream compression.
              For advanced features, use the full bentopdf toolkit.
            </p>
          </div>
          <button
            onClick={doCompress}
            disabled={!compressFile || compressLoading}
            className="apple-btn-primary w-full h-11 text-[14px] disabled:opacity-40"
          >
            {compressLoading ? "Compressing\u2026" : "Compress PDF"}
          </button>
          {compressBlob && (
            <div className="apple-card px-6 py-5 text-center">
              <p className="text-[13px] font-semibold text-[var(--color-ink)] mb-1">
                Compressed successfully
              </p>
              <p className="text-[11px] text-[var(--color-ink-muted-48)] mb-3">
                {formatSize(compressOrigSize)} &rarr; {formatSize(compressBlob.size)}
                {" "}({Math.round((1 - compressBlob.size / compressOrigSize) * 100)}% reduction)
              </p>
              <a
                href={URL.createObjectURL(compressBlob)}
                download={"compressed-" + compressFile?.name}
                className="inline-block apple-btn-primary px-6 py-2 text-[13px]"
              >
                Download compressed PDF
              </a>
            </div>
          )}
        </div>
      )}

      {tab === "split" && (
        <div className="w-full max-w-2xl space-y-4">
          <div className="apple-card px-6 py-5">
            <h2 className="text-[12px] font-semibold uppercase text-[var(--color-ink-muted-48)] mb-3">Select PDF</h2>
            <input
              ref={splitInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={(e) => {
                setSplitBlob(null);
                setSplitTotalPages(0);
                setSplitFile(e.target.files?.[0] || null);
              }}
              className="w-full text-[13px] file:mr-2 file:px-3 file:py-1.5 file:rounded-[8px] file:border-0 file:text-[12px] file:font-semibold file:bg-[var(--color-primary)] file:text-white file:cursor-pointer"
            />
            {splitFile && (
              <div className="mt-3 flex items-center justify-between text-[12px] text-[var(--color-ink-muted-48)]">
                <span className="truncate">{splitFile.name}</span>
                <span>{formatSize(splitFile.size)}</span>
              </div>
            )}
          </div>
          <div className="apple-card px-6 py-5">
            <h2 className="text-[12px] font-semibold uppercase text-[var(--color-ink-muted-48)] mb-3">Page Range</h2>
            <input
              value={splitRange}
              onChange={(e) => setSplitRange(e.target.value)}
              placeholder='e.g. 1-3, 5, 7-9'
              className="apple-input w-full h-9 text-[13px]"
            />
            {splitTotalPages > 0 && (
              <p className="text-[11px] text-[var(--color-ink-muted-48)] mt-1">PDF has {splitTotalPages} pages. Enter page numbers or ranges separated by commas.</p>
            )}
          </div>
          <button
            onClick={doSplit}
            disabled={!splitFile || !splitRange.trim() || splitLoading}
            className="apple-btn-primary w-full h-11 text-[14px] disabled:opacity-40"
          >
            {splitLoading ? "Splitting\u2026" : "Split PDF"}
          </button>
          {splitBlob && (
            <div className="apple-card px-6 py-5 text-center">
              <p className="text-[13px] font-semibold text-[var(--color-ink)] mb-2">Extracted pages successfully</p>
              <a
                href={URL.createObjectURL(splitBlob)}
                download="split.pdf"
                className="inline-block apple-btn-primary px-6 py-2 text-[13px]"
              >
                Download split.pdf
              </a>
            </div>
          )}
        </div>
      )}

      {tab === "merge" && (
        <div className="w-full max-w-2xl space-y-4">
          <div className="apple-card px-6 py-5">
            <h2 className="text-[12px] font-semibold uppercase text-[var(--color-ink-muted-48)] mb-3">Select PDFs</h2>
            <input
              ref={mergeInputRef}
              type="file"
              accept=".pdf,application/pdf"
              multiple
              onChange={(e) => {
                setMergeBlob(null);
                setMergeFiles(Array.from(e.target.files || []));
              }}
              className="w-full text-[13px] file:mr-2 file:px-3 file:py-1.5 file:rounded-[8px] file:border-0 file:text-[12px] file:font-semibold file:bg-[var(--color-primary)] file:text-white file:cursor-pointer"
            />
            {mergeFiles.length > 0 && (
              <div className="mt-3 space-y-1">
                {mergeFiles.map((f, i) => (
                  <div key={i} className="flex items-center justify-between text-[12px] text-[var(--color-ink-muted-48)]">
                    <span className="truncate">{i + 1}. {f.name}</span>
                    <span>{formatSize(f.size)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={doMerge}
            disabled={!!mergeWarn || mergeLoading}
            className="apple-btn-primary w-full h-11 text-[14px] disabled:opacity-40"
          >
            {mergeLoading ? "Merging\u2026" : "Merge PDFs"}
          </button>
          {mergeWarn && !mergeLoading && (
            <p className="text-[12px] text-[var(--color-ink-muted-48)] text-center">{mergeWarn}</p>
          )}
          {mergeBlob && (
            <div className="apple-card px-6 py-5 text-center">
              <p className="text-[13px] font-semibold text-[var(--color-ink)] mb-2">
                Merged {mergeFiles.length} files successfully
              </p>
              <a
                href={URL.createObjectURL(mergeBlob)}
                download="merged.pdf"
                className="inline-block apple-btn-primary px-6 py-2 text-[13px]"
              >
                Download merged.pdf
              </a>
            </div>
          )}
        </div>
      )}

      {tab === "image" && (
        <div className="w-full max-w-2xl space-y-4">
          <div className="apple-card px-6 py-5">
            <h2 className="text-[12px] font-semibold uppercase text-[var(--color-ink-muted-48)] mb-3">Select Images</h2>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                setImageBlob(null);
                setImageFiles(Array.from(e.target.files || []));
              }}
              className="w-full text-[13px] file:mr-2 file:px-3 file:py-1.5 file:rounded-[8px] file:border-0 file:text-[12px] file:font-semibold file:bg-[var(--color-primary)] file:text-white file:cursor-pointer"
            />
            <p className="text-[10px] text-[var(--color-ink-muted-48)] mt-1.5">Supports JPG, PNG, WebP, BMP, HEIC, and more</p>
            {imageFiles.length > 0 && (
              <div className="mt-3 space-y-1">
                {imageFiles.map((f, i) => (
                  <div key={i} className="flex items-center justify-between text-[12px] text-[var(--color-ink-muted-48)]">
                    <span className="truncate">{i + 1}. {f.name}</span>
                    <span>{formatSize(f.size)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={doImageToPdf}
            disabled={imageFiles.length === 0 || imageLoading}
            className="apple-btn-primary w-full h-11 text-[14px] disabled:opacity-40"
          >
            {imageLoading ? "Converting\u2026" : "Convert to PDF"}
          </button>
          {imageBlob && (
            <div className="apple-card px-6 py-5 text-center">
              <p className="text-[13px] font-semibold text-[var(--color-ink)] mb-2">
                Converted {imageFiles.length} image{imageFiles.length > 1 ? "s" : ""} to PDF
              </p>
              <a
                href={URL.createObjectURL(imageBlob)}
                download="images.pdf"
                className="inline-block apple-btn-primary px-6 py-2 text-[13px]"
              >
                Download images.pdf
              </a>
            </div>
          )}
        </div>
      )}

      {tab === "text" && (
        <div className="w-full max-w-2xl space-y-4">
          <div className="apple-card px-6 py-5">
            <h2 className="text-[12px] font-semibold uppercase text-[var(--color-ink-muted-48)] mb-3">Enter Text</h2>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type or paste your text here\u2026"
              rows={10}
              className="apple-input w-full resize-y text-[14px] leading-[1.6]"
            />
          </div>
          <button
            onClick={doTextToPdf}
            disabled={!text.trim() || textLoading}
            className="apple-btn-primary w-full h-11 text-[14px] disabled:opacity-40"
          >
            {textLoading ? "Creating PDF\u2026" : "Create PDF"}
          </button>
          {textBlob && (
            <div className="apple-card px-6 py-5 text-center">
              <p className="text-[13px] font-semibold text-[var(--color-ink)] mb-2">PDF created successfully</p>
              <a
                href={URL.createObjectURL(textBlob)}
                download="document.pdf"
                className="inline-block apple-btn-primary px-6 py-2 text-[13px]"
              >
                Download document.pdf
              </a>
            </div>
          )}
        </div>
      )}

      <div className="w-full max-w-2xl mt-6 apple-card px-6 py-4">
        <p className="text-[12px] leading-[1.6] text-[var(--color-ink-muted-48)] text-center">
          Inspired by{" "}
          <a href="https://bentopdf.com" target="_blank" rel="noopener noreferrer" className="text-[var(--color-primary)] font-semibold hover:underline">
            BentoPDF
          </a>
          , an open-source privacy-first PDF toolkit.
          For advanced features (split, encrypt, OCR, watermark, and more), visit the original project.
        </p>
      </div>

      <Disclaimer type="utility" />
    </div>
  );
}
