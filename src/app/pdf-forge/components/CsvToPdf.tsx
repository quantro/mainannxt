"use client";
import { useRef, useState } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { ToolCard, DownloadResult, FileInput } from "./ToolWrapper";

export default function CsvToPdf() {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [csv, setCsv] = useState("Name,Email,Role\nAlice,alice@example.com,Designer\nBob,bob@example.com,Developer\nCharlie,charlie@example.com,Manager");
  const [blob, setBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);
  const [headers, setHeaders] = useState<string[]>([]);

  function parseCsv(text: string): string[][] {
    const rows: string[][] = [];
    for (const line of text.split("\n")) {
      const tr = line.trim();
      if (!tr) continue;
      const cols: string[] = [];
      let cur = "";
      let inQ = false;
      for (const ch of tr) {
        if (ch === '"') { inQ = !inQ; continue; }
        if (ch === "," && !inQ) { cols.push(cur.trim()); cur = ""; continue; }
        cur += ch;
      }
      cols.push(cur.trim());
      rows.push(cols);
    }
    return rows;
  }

  async function run() {
    if (!csv.trim()) return;
    setLoading(true);
    setBlob(null);
    try {
      const data = parseCsv(csv);
      if (data.length < 2) throw new Error("Need at least a header row and one data row");
      const hdrs = data[0];
      setHeaders(hdrs);
      const rows = data.slice(1);
      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      let page = pdfDoc.addPage([595.28, 841.89]);
      const margin = 40;
      const avail = 595.28 - margin * 2;
      const colW = avail / hdrs.length;
      const lh = 18;
      let y = 800;
      const maxY = 60;

      function drawRow(cols: string[], isHeader: boolean) {
        const f = isHeader ? bold : font;
        for (let i = 0; i < cols.length; i++) {
          page.drawText(cols[i] || "", {
            x: margin + i * colW + 4,
            y,
            size: 9,
            font: f,
            color: rgb(0.1, 0.1, 0.1),
          });
        }
        y -= lh;
      }

      drawRow(hdrs, true);
      y -= 4;
      for (const row of rows) {
        if (y < maxY) {
          // new page
          page.drawText("(continued\u2026)", { x: margin, y: margin - 10, size: 8, font, color: rgb(0.5, 0.5, 0.5) });
          page = pdfDoc.addPage([595.28, 841.89]);
          y = 800;
          drawRow(hdrs, true);
          y -= 4;
        }
        drawRow(row, false);
      }
      const b = (await pdfDoc.save()).buffer as ArrayBuffer;
      setBlob(new Blob([b], { type: "application/pdf" }));
    } catch (e: unknown) {
      alert("Failed: " + (e instanceof Error ? e.message : "Unknown error"));
    }
    setLoading(false);
  }

  return (
    <div className="w-full max-w-2xl space-y-4">
      <ToolCard title="Enter CSV Data">
        <textarea ref={ref} value={csv} onChange={(e) => setCsv(e.target.value)}
          rows={10} className="cosmic-input w-full resize-y text-[13px] font-mono leading-relaxed"
          placeholder="Paste CSV data here\u2026" />
        {headers.length > 0 && (
          <p className="text-[11px] text-[var(--color-ink-muted-48)] mt-1">{headers.length} columns detected</p>
        )}
      </ToolCard>
      <button onClick={run} disabled={!csv.trim() || loading}
        className="cosmic-btn-primary w-full h-11 text-[14px] disabled:opacity-40">
        {loading ? "Generating\u2026" : "Convert CSV to PDF"}
      </button>
      <DownloadResult blob={blob} filename="table.pdf" label="CSV converted to PDF table" />
    </div>
  );
}
