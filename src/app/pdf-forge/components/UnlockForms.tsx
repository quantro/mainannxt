"use client";
import { useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";
import { ToolCard, DownloadResult, FileInput } from "./ToolWrapper";

export default function UnlockForms() {
  const ref = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);

  async function run() {
    if (!file) return;
    setLoading(true);
    setBlob(null);
    try {
      const pdf = await PDFDocument.load(await file.arrayBuffer());
      const form = pdf.getForm();
      const fields = form.getFields();
      setCount(fields.length);
      for (const f of fields) {
        f.disableReadOnly();
      }
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
        Removes the read-only restriction from all form fields, allowing them to be edited.
      </p>
      <button onClick={run} disabled={!file || loading}
        className="cosmic-btn-primary w-full h-11 text-[14px] disabled:opacity-40">
        {loading ? "Unlocking\u2026" : "Unlock Form Fields"}
      </button>
      {count > 0 && <p className="text-[12px] text-[var(--color-ink-muted-48)] text-center">{count} field{count !== 1 ? "s" : ""} unlocked</p>}
      <DownloadResult blob={blob} filename="unlocked.pdf" label="Form fields unlocked" />
    </div>
  );
}
