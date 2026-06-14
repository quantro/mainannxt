"use client";

import { useCallback, useState } from "react";
import ThemeToggle from "../theme-toggle";
import { Disclaimer } from "../disclaimer";
import { PageTitle } from "../page-title";
import { useToast } from "../toast";

export default function JsonFormatterPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const { toast } = useToast();

  const handleFormat = useCallback(() => {
    setError("");
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
    }
  }, [input]);

  const handleValidate = useCallback(() => {
    setError("");
    try {
      JSON.parse(input);
      toast("Valid JSON", "success");
    } catch (e) {
      setError((e as Error).message);
    }
  }, [input, toast]);

  const handleMinify = useCallback(() => {
    setError("");
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
    }
  }, [input]);

  const handleCopy = useCallback(async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    toast("Copied to clipboard", "success");
  }, [output, toast]);

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-12">
      <PageTitle title="JSON Formatter" />
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <h1 className="apple-headline text-[32px] leading-[1.1] text-center mb-1">
        JSON Formatter &amp; Validator
      </h1>
      <p className="text-[13px] text-[var(--color-ink-muted-48)] mb-6 text-center max-w-lg">
        Format, validate, and minify your JSON data.
      </p>

      <div className="w-full max-w-2xl space-y-4">
        <div className="apple-card px-5 py-4 space-y-3">
          <h2 className="text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-[var(--color-ink-muted-48)] uppercase">
            Input
          </h2>
          <textarea
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(""); }}
            placeholder='{"key": "value"}'
            className="apple-input w-full min-h-[200px] resize-y rounded-[11px] text-[13px] font-mono leading-[1.5]"
            spellCheck={false}
          />
          <div className="flex flex-wrap gap-2">
            <button onClick={handleFormat} className="apple-btn-primary text-[13px] px-5 py-2">
              Format
            </button>
            <button onClick={handleValidate} className="apple-btn-primary text-[13px] px-5 py-2">
              Validate
            </button>
            <button onClick={handleMinify} className="apple-btn-primary text-[13px] px-5 py-2">
              Minify
            </button>
          </div>
        </div>

        {error && (
          <div className="apple-card px-5 py-4 border-red-400">
            <p className="text-[13px] text-red-500 font-mono whitespace-pre-wrap">{error}</p>
          </div>
        )}

        {output && (
          <div className="apple-card px-5 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-[var(--color-ink-muted-48)] uppercase">
                Result
              </h2>
              <button onClick={handleCopy} className="apple-btn-ghost text-[11px] px-2 py-1">
                Copy
              </button>
            </div>
            <pre className="apple-input w-full min-h-[120px] rounded-[11px] text-[13px] font-mono leading-[1.5] overflow-auto whitespace-pre p-4">
              {output}
            </pre>
          </div>
        )}
      </div>

      <Disclaimer type="utility" />
    </div>
  );
}
