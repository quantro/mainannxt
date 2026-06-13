"use client";

export function Disclaimer({ type = "utility" }: { type?: "divination" | "utility" }) {
  return (
    <div className="mt-6 px-4 py-3 rounded-[11px] bg-[var(--color-surface-pearl)] border border-[var(--color-border)]">
      <p className="text-[11px] leading-[1.6] text-[var(--color-ink-muted-48)] text-center">
        {type === "divination"
          ? "Readings are for entertainment, educational, and spiritual exploration purposes only. They are not a substitute for professional advice."
          : "This tool is provided for informational and entertainment purposes only. Results should not be relied upon for critical decisions."}
      </p>
    </div>
  );
}
