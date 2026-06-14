"use client";

import { useCallback, useMemo, useState } from "react";
import ThemeToggle from "../theme-toggle";
import { Disclaimer } from "../disclaimer";
import { PageTitle } from "../page-title";

const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DIGITS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+-=[]{}|;':\",./<>?~`";
const AMBIGUOUS = "0O1lI|!";

function getStrength(score: number): { label: string; color: string } {
  if (score < 25) return { label: "Weak", color: "#ff3b30" };
  if (score < 50) return { label: "Fair", color: "#ff9500" };
  if (score < 75) return { label: "Good", color: "#ffcc00" };
  if (score < 90) return { label: "Strong", color: "#34c759" };
  return { label: "Very Strong", color: "#007aff" };
}

export default function PasswordGeneratorPage() {
  const [length, setLength] = useState(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useDigits, setUseDigits] = useState(true);
  const [useSymbols, setUseSymbols] = useState(false);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(true);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const charset = useMemo(() => {
    let s = "";
    if (useUpper) s += UPPERCASE;
    if (useLower) s += LOWERCASE;
    if (useDigits) s += DIGITS;
    if (useSymbols) s += SYMBOLS;
    if (excludeAmbiguous) for (const c of AMBIGUOUS) s = s.replaceAll(c, "");
    return s;
  }, [useUpper, useLower, useDigits, useSymbols, excludeAmbiguous]);

  const generate = useCallback(() => {
    if (!charset) return;
    let pwd = "";
    const arr = new Uint32Array(length);
    crypto.getRandomValues(arr);
    for (let i = 0; i < length; i++) pwd += charset[arr[i] % charset.length];
    setPassword(pwd);
    setCopied(false);
  }, [charset, length]);

  const strength = useMemo(() => {
    if (!password) return { label: "", color: "" };
    let score = 0;
    if (/[a-z]/.test(password)) score += 10;
    if (/[A-Z]/.test(password)) score += 15;
    if (/\d/.test(password)) score += 15;
    if (/[^a-zA-Z0-9]/.test(password)) score += 25;
    score += Math.min(password.length * 4, 35);
    return getStrength(score);
  }, [password]);

  async function doCopy() {
    if (!password) return;
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-12">
      <PageTitle title="Password Generator" />
      <div className="absolute top-4 right-4"><ThemeToggle /></div>
      <h1 className="cosmic-headline text-[34px] leading-[1.47] tracking-[-0.374px] mb-2">Password Generator</h1>
      <p className="text-[13px] text-[var(--color-ink-muted-48)] mb-6 text-center max-w-lg">
        Generate secure, random passwords in your browser.
      </p>

      <div className="w-full max-w-md space-y-4">
        {password && (
          <div className="cosmic-card px-5 py-4">
            <div className="flex items-center gap-2">
              <code className="flex-1 text-[15px] font-mono tracking-wider break-all select-all">{password}</code>
              <button onClick={doCopy} className="cosmic-btn-ghost shrink-0 text-[12px] px-2 py-1">{copied ? "Copied!" : "Copy"}</button>
              <button onClick={generate} className="cosmic-btn-primary shrink-0 text-[12px] px-3 py-1">Regenerate</button>
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-[var(--color-surface-pearl)] overflow-hidden">
              <div className="h-full rounded-full transition-all duration-300" style={{ width: Math.min(password.length * 6.25, 100) + "%", backgroundColor: strength.color }} />
            </div>
            {strength.label && <p className="text-[11px] font-semibold mt-1 text-right" style={{ color: strength.color }}>{strength.label}</p>}
          </div>
        )}

        <div className="cosmic-card px-5 py-4 space-y-4">
          <div>
            <label className="text-[11px] font-semibold uppercase text-[var(--color-ink-muted-48)]">Length: {length}</label>
            <input type="range" min="4" max="64" value={length} onChange={(e) => setLength(parseInt(e.target.value))} className="w-full accent-[var(--color-primary)] mt-1" />
            <div className="flex justify-between text-[10px] text-[var(--color-ink-muted-48)]"><span>4</span><span>64</span></div>
          </div>

          <div className="space-y-2 text-[13px] text-[var(--color-ink)]">
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={useUpper} onChange={(e) => setUseUpper(e.target.checked)} className="accent-[var(--color-primary)]" /> Uppercase (A-Z)</label>
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={useLower} onChange={(e) => setUseLower(e.target.checked)} className="accent-[var(--color-primary)]" /> Lowercase (a-z)</label>
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={useDigits} onChange={(e) => setUseDigits(e.target.checked)} className="accent-[var(--color-primary)]" /> Digits (0-9)</label>
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={useSymbols} onChange={(e) => setUseSymbols(e.target.checked)} className="accent-[var(--color-primary)]" /> Symbols (!@#$%...)</label>
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={excludeAmbiguous} onChange={(e) => setExcludeAmbiguous(e.target.checked)} className="accent-[var(--color-primary)]" /> Exclude ambiguous (0O1lI|!)</label>
          </div>
        </div>

        <button onClick={generate} disabled={!charset} className="cosmic-btn-primary w-full h-11 text-[14px] disabled:opacity-40">
          {password ? "Regenerate" : "Generate Password"}
        </button>
      </div>

      <Disclaimer type="utility" />
    </div>
  );
}
