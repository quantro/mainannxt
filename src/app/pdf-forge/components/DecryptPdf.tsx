"use client";
import { ToolCard } from "./ToolWrapper";

export default function DecryptPdf() {
  return (
    <div className="w-full max-w-2xl space-y-4">
      <ToolCard title="Not Available in Browser">
        <p className="text-[13px] text-[var(--color-ink-muted-48)] leading-relaxed">
          PDF decryption is not supported by the browser-based pdf-lib library.
          For removing PDF passwords, try desktop tools like bentopdf or Acrobat.
        </p>
      </ToolCard>
    </div>
  );
}
