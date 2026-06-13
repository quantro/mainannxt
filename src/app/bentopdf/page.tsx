"use client";

import { useEffect } from "react";
import ThemeToggle from "../theme-toggle";
import { Disclaimer } from "../disclaimer";

export default function BentoPDFPage() {
  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    return () => { document.documentElement.style.overflow = ""; };
  }, []);

  return (
    <div className="flex flex-col h-dvh">
      <div className="flex items-center gap-3 px-4 py-2 border-b border-[var(--color-border-subtle)] shrink-0">
        <span className="text-[15px]">📄</span>
        <span className="text-[15px] font-semibold tracking-[-0.2px]">BentoPDF</span>
        <span className="text-[11px] text-[var(--color-ink-muted-48)] ml-auto">Privacy-first PDF toolkit</span>
        <ThemeToggle />
      </div>
      <iframe
        src="https://bentopdf.com"
        className="flex-1 w-full border-0"
        title="BentoPDF"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      />
      <div className="px-4 py-1.5 border-t border-[var(--color-border-subtle)] shrink-0">
        <p className="text-[10px] text-[var(--color-ink-muted-48)] text-center">
          BentoPDF is open source under Apache 2.0 &middot;{" "}
          <a href="https://github.com/goodtab/bentopdf" target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--color-ink)]">
            github.com/goodtab/bentopdf
          </a>
        </p>
      </div>
    </div>
  );
}
