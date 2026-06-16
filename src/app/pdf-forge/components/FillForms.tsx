"use client";
import { useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";
import { ToolCard, DownloadResult, FileInput } from "./ToolWrapper";

export default function FillForms() {
  const ref = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [fields, setFields] = useState<{ name: string; type: string; value: string }[]>([]);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);

  async function loadFields() {
    if (!file) return;
    try {
      const pdf = await PDFDocument.load(await file.arrayBuffer());
      const form = pdf.getForm();
      const all = form.getFields();
      setFields(all.map((f) => ({ name: f.getName(), type: f.constructor.name, value: "" })));
    } catch {
      alert("Could not read form fields from this PDF.");
    }
  }

  async function run() {
    if (!file) return;
    setLoading(true);
    setBlob(null);
    try {
      const pdf = await PDFDocument.load(await file.arrayBuffer());
      const form = pdf.getForm();
      for (const f of fields) {
        if (!f.value) continue;
        try { form.getTextField(f.name).setText(f.value); continue; } catch {}
        try { form.getCheckBox(f.name).check(); continue; } catch {}
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
      <ToolCard title="Select PDF with Form Fields">
        <FileInput accept=".pdf,application/pdf" ref_={ref} onChange={(fl) => { setBlob(null); setFields([]); setFile(fl?.[0] || null); }} />
      </ToolCard>
      {file && fields.length === 0 && (
        <button onClick={loadFields}
          className="cosmic-btn-primary w-full h-11 text-[14px]">
          Load Form Fields
        </button>
      )}
      {fields.length > 0 && (
        <ToolCard title="Fill Form Fields">
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {fields.map((f, i) => (
              <div key={i}>
                <label className="text-[11px] font-semibold text-[var(--color-ink-muted-48)]">{f.name}</label>
                <input value={f.value} onChange={(e) => {
                  const next = [...fields];
                  next[i] = { ...next[i], value: e.target.value };
                  setFields(next);
                }} placeholder={`${f.type} field`}
                  className="cosmic-input w-full h-9 text-[13px] mt-0.5" />
              </div>
            ))}
          </div>
        </ToolCard>
      )}
      {fields.length > 0 && (
        <button onClick={run} disabled={loading}
          className="cosmic-btn-primary w-full h-11 text-[14px] disabled:opacity-40">
          {loading ? "Filling\u2026" : "Fill & Save"}
        </button>
      )}
      <DownloadResult blob={blob} filename="filled.pdf" label="Form fields filled" />
    </div>
  );
}
