"use client";
import { useState } from "react";
import { PDFDocument, rgb } from "pdf-lib";
import { ToolCard, DownloadResult } from "./ToolWrapper";

export default function TextToPdf() {
  const [text, setText] = useState("");
  const [blob, setBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);

  async function run() {
    const t = text.trim();
    if (!t) return;
    setLoading(true);
    setBlob(null);
    try {
      const pdf = await PDFDocument.create();
      const font = await pdf.embedFont("Helvetica");
      const fs = 12, margin = 50, pw = 612, ph = 792, mw = pw - margin * 2;
      const lines: string[] = [];
      for (const para of t.split("\n")) {
        const words = para.split(" ");
        let line = "";
        for (const word of words) {
          const test = line ? line + " " + word : word;
          if (font.widthOfTextAtSize(test, fs) > mw) { lines.push(line); line = word; }
          else line = test;
        }
        if (line) lines.push(line);
        lines.push("");
      }
      let y = ph - margin;
      let page = pdf.addPage([pw, ph]);
      for (const line of lines) {
        if (y < margin + fs) { page = pdf.addPage([pw, ph]); y = ph - margin; }
        page.drawText(line || " ", { x: margin, y: y - fs, size: fs, font, color: rgb(0, 0, 0) });
        y -= line === "" ? fs * 1.5 : fs * 1.35;
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
      <ToolCard title="Enter Text">
        <textarea value={text} onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your text here\u2026" rows={10}
          className="cosmic-input w-full resize-y text-[14px] leading-[1.6]" />
      </ToolCard>
      <button onClick={run} disabled={!text.trim() || loading}
        className="cosmic-btn-primary w-full h-11 text-[14px] disabled:opacity-40">
        {loading ? "Creating\u2026" : "Create PDF"}
      </button>
      <DownloadResult blob={blob} filename="document.pdf" label="PDF created" />
    </div>
  );
}
