"use client";
import { useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";
import { ToolCard, DownloadResult, FileInput } from "./ToolWrapper";

export default function RemoveFormFields() {
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
      for (const field of fields) {
        form.removeField(field);
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
        Permanently removes all interactive form fields (text inputs, checkboxes, buttons, dropdowns, etc.).
      </p>
      <button onClick={run} disabled={!file || loading}
        className="cosmic-btn-primary w-full h-11 text-[14px] disabled:opacity-40">
        {loading ? "Removing\u2026" : "Remove Form Fields"}
      </button>
      {count > 0 && <p className="text-[12px] text-[var(--color-ink-muted-48)] text-center">{count} field{count !== 1 ? "s" : ""} removed</p>}
      <DownloadResult blob={blob} filename="no-forms.pdf" label="Form fields removed" />
    </div>
  );
}
