"use client";
import { useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";
import { ToolCard, DownloadResult, FileInput } from "./ToolWrapper";

export default function EditMetadata() {
  const ref = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [subject, setSubject] = useState("");
  const [keywords, setKeywords] = useState("");
  const [blob, setBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);

  async function run() {
    if (!file) return;
    setLoading(true);
    setBlob(null);
    try {
      const pdf = await PDFDocument.load(await file.arrayBuffer());
      if (title.trim()) pdf.setTitle(title.trim());
      if (author.trim()) pdf.setAuthor(author.trim());
      if (subject.trim()) pdf.setSubject(subject.trim());
      if (keywords.trim()) pdf.setKeywords(keywords.split(",").map((k) => k.trim()));
      pdf.setProducer("PDF Forge");
      const b = (await pdf.save()).buffer as ArrayBuffer;
      setBlob(new Blob([b], { type: "application/pdf" }));
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
      <ToolCard title="Metadata">
        <div className="space-y-3">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title"
            className="cosmic-input w-full h-9 text-[13px]" />
          <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Author"
            className="cosmic-input w-full h-9 text-[13px]" />
          <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject"
            className="cosmic-input w-full h-9 text-[13px]" />
          <input value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="Keywords (comma-separated)"
            className="cosmic-input w-full h-9 text-[13px]" />
        </div>
      </ToolCard>
      <button onClick={run} disabled={!file || loading}
        className="cosmic-btn-primary w-full h-11 text-[14px] disabled:opacity-40">
        {loading ? "Updating\u2026" : "Update Metadata"}
      </button>
      <DownloadResult blob={blob} filename="metadata.pdf" label="Metadata updated" />
    </div>
  );
}
