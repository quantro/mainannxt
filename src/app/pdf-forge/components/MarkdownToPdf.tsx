"use client";
import { useRef, useState } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { ToolCard, DownloadResult, FileInput } from "./ToolWrapper";

export default function MarkdownToPdf() {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = useState("# My Document\n\nHello **world**!\n\n- Item 1\n- Item 2\n\n1. First\n2. Second");
  const [blob, setBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);

  async function run() {
    if (!text.trim()) return;
    setLoading(true);
    setBlob(null);
    try {
      const pdf = await PDFDocument.create();
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
      let page = pdf.addPage([595.28, 841.89]);
      let y = 800;
      const margin = 50;
      const maxW = 495;
      const lines = text.split("\n");
      const fs = 11;
      const lh = 16;

      for (const raw of lines) {
        const line = raw.trimEnd();
        if (!line) { y -= lh; continue; }

        let currentFont = font;
        let size = fs;
        let prefix = "";
        let content = line;

        if (line.startsWith("# ")) { size = 24; currentFont = bold; content = line.slice(2); y -= 6; }
        else if (line.startsWith("## ")) { size = 18; currentFont = bold; content = line.slice(3); y -= 4; }
        else if (line.startsWith("### ")) { size = 14; currentFont = bold; content = line.slice(4); y -= 2; }
        else if (line.startsWith("- ") || line.startsWith("* ")) { prefix = "\u2022 "; content = line.slice(2); }
        else if (/^\d+[.)]\s/.test(line)) { prefix = line.match(/^\d+[.)]/)?.[0] + " "; content = line.replace(/^\d+[.)]\s*/, ""); }
        else if (line.startsWith("> ")) { content = line.slice(2); }

        const boldParts = content.split(/(\*\*.*?\*\*)/);
        const words = boldParts.length > 1 ? boldParts : [content];
        let x = margin + (prefix ? font.widthOfTextAtSize(prefix, size) : 0);
        if (prefix) {
          page.drawText(prefix, { x: margin, y, size, font, color: rgb(0.1, 0.1, 0.1) });
        }
        for (const w of words) {
          const isBold = w.startsWith("**") && w.endsWith("**");
          const txt = isBold ? w.slice(2, -2) : w;
          const f = isBold ? bold : currentFont;
          page.drawText(txt, { x, y, size, font: f, color: rgb(0.1, 0.1, 0.1) });
          x += f.widthOfTextAtSize(txt, size);
        }

        y -= lh + size - fs;
        if (y < 60) { page = pdf.addPage([595.28, 841.89]); y = 800; }
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
      <ToolCard title="Enter Markdown">
        <textarea ref={ref} value={text} onChange={(e) => setText(e.target.value)}
          rows={12} className="cosmic-input w-full resize-y text-[13px] font-mono leading-relaxed"
          placeholder="Type or paste Markdown here\u2026" />
      </ToolCard>
      <button onClick={run} disabled={!text.trim() || loading}
        className="cosmic-btn-primary w-full h-11 text-[14px] disabled:opacity-40">
        {loading ? "Generating\u2026" : "Convert to PDF"}
      </button>
      <DownloadResult blob={blob} filename="document.pdf" label="Markdown converted to PDF" />
    </div>
  );
}
