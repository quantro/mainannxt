"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import ThemeToggle from "../theme-toggle";
import { Disclaimer } from "../disclaimer";
import { PageTitle } from "../page-title";

type CipherMode = "caesar" | "rot13" | "atbash" | "vigenere" | "railfence";

function caesar(text: string, shift: number, decode: boolean): string {
  const s = decode ? (26 - shift) % 26 : shift;
  return text.replace(/[a-z]/gi, (ch) => {
    const base = ch >= "a" ? 97 : 65;
    return String.fromCharCode(((ch.charCodeAt(0) - base + s) % 26) + base);
  });
}

function rot13(text: string): string {
  return caesar(text, 13, false);
}

function atbash(text: string): string {
  return text.replace(/[a-z]/gi, (ch) => {
    const base = ch >= "a" ? 97 : 65;
    return String.fromCharCode(25 - (ch.charCodeAt(0) - base) + base);
  });
}

function railFence(text: string, rails: number, decode: boolean): string {
  if (rails < 2) return text;
  if (decode) {
    const positions = Array.from({ length: rails }, () => 0);
    let idx = 0;
    let down = true;
    for (let i = 0; i < text.length; i++) {
      positions[idx]++;
      if (down) { idx++; if (idx === rails) { idx = rails - 2; down = false; } }
      else { idx--; if (idx < 0) { idx = 1; down = true; } }
    }
    const rows: string[] = [];
    let pos = 0;
    for (let r = 0; r < rails; r++) {
      rows.push(text.slice(pos, pos + positions[r]));
      pos += positions[r];
    }
    const result: string[] = [];
    idx = 0; down = true;
    const ri = rows.map(() => 0);
    for (let i = 0; i < text.length; i++) {
      result.push(rows[idx][ri[idx]++]);
      if (down) { idx++; if (idx === rails) { idx = rails - 2; down = false; } }
      else { idx--; if (idx < 0) { idx = 1; down = true; } }
    }
    return result.join("");
  }
  const fence: string[][] = Array.from({ length: rails }, () => []);
  let idx = 0, down = true;
  for (const ch of text) {
    fence[idx].push(ch);
    if (down) { idx++; if (idx === rails) { idx = rails - 2; down = false; } }
    else { idx--; if (idx < 0) { idx = 1; down = true; } }
  }
  return fence.flat().join("");
}

function vigenere(text: string, keyword: string, decode: boolean): string {
  const key = keyword.replace(/[^a-zA-Z]/g, "").toLowerCase();
  if (!key) return text;
  let ki = 0;
  return text.replace(/[a-z]/gi, (ch) => {
    const base = ch >= "a" ? 97 : 65;
    const shift = key.charCodeAt(ki % key.length) - 97;
    ki++;
    const s = decode ? (26 - shift) % 26 : shift;
    return String.fromCharCode(((ch.charCodeAt(0) - base + s) % 26) + base);
  });
}

const modes: { value: CipherMode; label: string }[] = [
  { value: "caesar", label: "Caesar" },
  { value: "rot13", label: "ROT13" },
  { value: "atbash", label: "Atbash" },
  { value: "vigenere", label: "Vigenère" },
  { value: "railfence", label: "Rail Fence" },
];

export default function CipherPage() {
  const [mode, setMode] = useState<CipherMode>("caesar");
  const [text, setText] = useState("");
  const [shift, setShift] = useState(3);
  const [keyword, setKeyword] = useState("");
  const [rails, setRails] = useState(3);
  const [decode, setDecode] = useState(false);
  const [copied, setCopied] = useState(false);

  const noDirection = mode === "rot13" || mode === "atbash";

  useEffect(() => {
    if (noDirection) setDecode(false);
  }, [noDirection]);

  const result = useMemo(() => {
    if (!text) return "";
    switch (mode) {
      case "caesar":
        return caesar(text, shift, decode);
      case "rot13":
        return rot13(text);
      case "atbash":
        return atbash(text);
      case "vigenere":
        return vigenere(text, keyword, decode);
      case "railfence":
        return railFence(text, rails, decode);
    }
  }, [mode, text, shift, keyword, rails, decode]);

  const copyResult = useCallback(() => {
    if (!result) return;
    navigator.clipboard.writeText(result).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [result]);

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-12">
      <PageTitle title="Cipher Tool" />
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <h1 className="apple-headline text-[34px] leading-[1.47] tracking-[-0.374px] mb-8">
        Cipher Tool
      </h1>

      <div className="w-full max-w-2xl apple-card px-6 py-5 mb-5">
        <h2 className="text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-[var(--color-ink-muted-48)] mb-3 uppercase">
          Mode
        </h2>
        <div className="flex flex-wrap gap-2">
          {modes.map((m) => (
            <button
              key={m.value}
              onClick={() => setMode(m.value)}
              className={
                mode === m.value
                  ? "apple-btn apple-btn-primary text-[14px]"
                  : "apple-btn-ghost text-[14px]"
              }
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full max-w-2xl apple-card px-6 py-5 mb-5">
        <h2 className="text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-[var(--color-ink-muted-48)] mb-3 uppercase">
          Input
        </h2>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to cipher..."
          className="w-full bg-[var(--color-canvas)] text-[var(--color-ink)] border border-[var(--color-hairline)] rounded-[11px] px-5 py-3 text-[14px] leading-[1.47] outline-none transition-colors resize-y min-h-[100px] placeholder:text-[var(--color-ink-muted-48)] focus:border-[var(--color-primary)]"
          rows={4}
        />
      </div>

      {mode === "caesar" && (
        <div className="w-full max-w-2xl apple-card px-6 py-5 mb-5">
          <h2 className="text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-[var(--color-ink-muted-48)] mb-3 uppercase">
            Shift Amount
          </h2>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={1}
              max={25}
              value={shift}
              onChange={(e) => setShift(Number(e.target.value))}
              className="flex-1 accent-[var(--color-primary)]"
            />
            <span className="text-[14px] font-semibold leading-[1.43] text-[var(--color-ink)] w-8 text-center tabular-nums">
              {shift}
            </span>
          </div>
        </div>
      )}

      {mode === "railfence" && (
        <div className="w-full max-w-2xl apple-card px-6 py-5 mb-5">
          <h2 className="text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-[var(--color-ink-muted-48)] mb-3 uppercase">
            Rails
          </h2>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={2}
              max={10}
              value={rails}
              onChange={(e) => setRails(Number(e.target.value))}
              className="flex-1 accent-[var(--color-primary)]"
            />
            <span className="text-[14px] font-semibold leading-[1.43] text-[var(--color-ink)] w-8 text-center tabular-nums">
              {rails}
            </span>
          </div>
        </div>
      )}

      {mode === "vigenere" && (
        <div className="w-full max-w-2xl apple-card px-6 py-5 mb-5">
          <h2 className="text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-[var(--color-ink-muted-48)] mb-3 uppercase">
            Keyword
          </h2>
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Enter keyword..."
            className="apple-input w-full h-10 text-[14px]"
          />
        </div>
      )}

      <div className="w-full max-w-2xl apple-card px-6 py-5 mb-5">
        <h2 className="text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-[var(--color-ink-muted-48)] mb-3 uppercase">
          Direction
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setDecode(false)}
            className={
              !decode
                ? "apple-btn apple-btn-primary text-[14px]"
                : "apple-btn-ghost text-[14px]"
            }
          >
            Encode
          </button>
          <button
            onClick={() => setDecode(true)}
            className={
              decode
                ? "apple-btn apple-btn-primary text-[14px]"
                : "apple-btn-ghost text-[14px]"
            }
          >
            Decode
          </button>
        </div>
        {noDirection && (
          <p className="text-[12px] leading-[1.43] tracking-[-0.224px] text-[var(--color-ink-muted-48)] mt-2">
            ROT13 and Atbash are symmetric — encoding and decoding produce the
            same result.
          </p>
        )}
      </div>

      <div className="w-full max-w-2xl apple-card px-6 py-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-[var(--color-ink-muted-48)] uppercase">
            Output
          </h2>
          <button
            onClick={copyResult}
            disabled={!result}
            className="apple-btn-ghost text-[12px] disabled:opacity-40"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <div className="bg-[var(--color-canvas)] text-[var(--color-ink)] border border-[var(--color-hairline)] rounded-[11px] px-5 py-3 text-[14px] leading-[1.47] whitespace-pre-wrap break-words min-h-[60px]">
          {result || (
            <span className="text-[var(--color-ink-muted-48)]">
              Result will appear here...
            </span>
          )}
        </div>
      </div>
          <Disclaimer type="utility" />
    </div>
  );
}
