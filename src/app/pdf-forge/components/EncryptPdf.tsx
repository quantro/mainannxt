"use client";
import { ToolCard } from "./ToolWrapper";

export default function EncryptPdf() {
  return (
    <div className="w-full max-w-2xl space-y-4">
      <ToolCard title="Not Available in Browser">
        <p className="text-[13px] text-[var(--color-ink-muted-48)] leading-relaxed">
          PDF encryption requires low-level crypto operations not supported by the browser-based pdf-lib library.
          For password-protecting PDFs, try desktop tools like bentopdf or Acrobat.
        </p>
      </ToolCard>
    </div>
  );
}
