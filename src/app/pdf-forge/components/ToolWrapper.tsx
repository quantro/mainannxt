"use client";
import type { ReactNode } from "react";

export function ToolCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="cosmic-card px-6 py-5">
      <h2 className="text-[12px] font-semibold uppercase text-[var(--color-ink-muted-48)] mb-3">{title}</h2>
      {children}
    </div>
  );
}

export function FileInfo({ name, size }: { name: string; size: number }) {
  return (
    <div className="mt-3 flex items-center justify-between text-[12px] text-[var(--color-ink-muted-48)]">
      <span className="truncate">{name}</span>
    </div>
  );
}

export function DownloadResult({ blob, filename, label }: { blob: Blob | null; filename: string; label?: string }) {
  if (!blob) return null;
  return (
    <div className="cosmic-card px-6 py-5 text-center">
      <p className="text-[13px] font-semibold text-[var(--color-ink)] mb-2">{label || "Done"}</p>
      <a
        href={URL.createObjectURL(blob)}
        download={filename}
        className="inline-block cosmic-btn-primary px-6 py-2 text-[13px]"
      >
        Download {filename}
      </a>
    </div>
  );
}

export function FileInput({
  accept,
  multiple,
  onChange,
  ref_,
}: {
  accept: string;
  multiple?: boolean;
  onChange: (files: FileList | null) => void;
  ref_: React.RefObject<HTMLInputElement | null>;
}) {
  return (
    <input
      ref={ref_}
      type="file"
      accept={accept}
      multiple={multiple}
      onChange={(e) => onChange(e.target.files)}
      className="w-full text-[13px] file:mr-2 file:px-3 file:py-1.5 file:rounded-[8px] file:border-0 file:text-[12px] file:font-semibold file:bg-[var(--color-primary)] file:text-white file:cursor-pointer"
    />
  );
}
