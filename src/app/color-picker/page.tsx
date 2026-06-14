"use client";

import { useCallback, useMemo, useState } from "react";
import ThemeToggle from "../theme-toggle";
import { Disclaimer } from "../disclaimer";
import { PageTitle } from "../page-title";
import { useToast } from "../toast";

function parseHex(s: string): { r: number; g: number; b: number } | null {
  const hex = s.replace(/^#/, "");
  if (/^[0-9a-fA-F]{3}$/.test(hex)) {
    const r = parseInt(hex[0] + hex[0], 16);
    const g = parseInt(hex[1] + hex[1], 16);
    const b = parseInt(hex[2] + hex[2], 16);
    return { r, g, b };
  }
  if (/^[0-9a-fA-F]{6}$/.test(hex)) {
    return {
      r: parseInt(hex.slice(0, 2), 16),
      g: parseInt(hex.slice(2, 4), 16),
      b: parseInt(hex.slice(4, 6), 16),
    };
  }
  return null;
}

function parseRgb(s: string): { r: number; g: number; b: number } | null {
  const m = s.match(/^rgba?\(\s*(\d{1,3})\s*[,/]\s*(\d{1,3})\s*[,/]\s*(\d{1,3})/);
  if (!m) return null;
  return {
    r: Math.min(255, parseInt(m[1])),
    g: Math.min(255, parseInt(m[2])),
    b: Math.min(255, parseInt(m[3])),
  };
}

function parseHsl(s: string): { r: number; g: number; b: number } | null {
  const m = s.match(/^hsla?\(\s*(\d+)\s*[,/]\s*(\d+)%\s*[,/]\s*(\d+)%/);
  if (!m) return null;
  return hslToRgb(parseInt(m[1]), parseInt(m[2]), parseInt(m[3]));
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; }
  else if (h < 120) { r = x; g = c; }
  else if (h < 180) { g = c; b = x; }
  else if (h < 240) { g = x; b = c; }
  else if (h < 300) { r = x; b = c; }
  else { r = c; b = x; }
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) * 60; break;
      case g: h = ((b - r) / d + 2) * 60; break;
      case b: h = ((r - g) / d + 4) * 60; break;
    }
  }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function toHex(n: number): string {
  return n.toString(16).padStart(2, "0").toUpperCase();
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function rgbToRgbString(r: number, g: number, b: number): string {
  return `rgb(${r}, ${g}, ${b})`;
}

function hslToHslString(h: number, s: number, l: number): string {
  return `hsl(${h}, ${s}%, ${l}%)`;
}

function parseColor(input: string): { r: number; g: number; b: number } | null {
  const trimmed = input.trim();
  return parseHex(trimmed) || parseRgb(trimmed) || parseHsl(trimmed);
}

function randomRgb(): { r: number; g: number; b: number } {
  return {
    r: Math.floor(Math.random() * 256),
    g: Math.floor(Math.random() * 256),
    b: Math.floor(Math.random() * 256),
  };
}

export default function ColorPickerPage() {
  const [input, setInput] = useState("#0066CC");
  const { toast } = useToast();

  const color = useMemo(() => parseColor(input), [input]);

  const hex = color ? rgbToHex(color.r, color.g, color.b) : "";
  const rgb = color ? rgbToRgbString(color.r, color.g, color.b) : "";
  const hsl = color ? (() => {
    const { h, s, l } = rgbToHsl(color.r, color.g, color.b);
    return hslToHslString(h, s, l);
  })() : "";

  const handleRandom = useCallback(() => {
    const { r, g, b } = randomRgb();
    setInput(rgbToHex(r, g, b));
  }, []);

  const copy = useCallback(async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    toast(`Copied ${label}`, "success");
  }, [toast]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-12">
      <PageTitle title="Color Picker" />
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <h1 className="apple-headline text-[32px] leading-[1.1] text-center mb-1">
        Color Picker
      </h1>
      <p className="text-[13px] text-[var(--color-ink-muted-48)] mb-6 text-center max-w-lg">
        Parse and convert between HEX, RGB, and HSL color formats.
      </p>

      <div className="w-full max-w-md space-y-4">
        <div className="apple-card px-5 py-4 space-y-4">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="#0066CC"
            className="apple-input w-full h-10 text-[14px]"
          />

          <div
            className="w-full h-28 rounded-[11px] border border-[var(--color-hairline)]"
            style={{ backgroundColor: color ? rgb : "transparent" }}
          />

          <div className="flex gap-2">
            <button
              onClick={handleRandom}
              className="apple-btn-primary text-[13px] px-4 py-2 flex-1"
            >
              Random Color
            </button>
          </div>
        </div>

        {color && (
          <div className="apple-card px-5 py-4 space-y-3">
            <FormatRow label="HEX" value={hex} onCopy={() => copy(hex, "HEX")} />
            <FormatRow label="RGB" value={rgb} onCopy={() => copy(rgb, "RGB")} />
            <FormatRow label="HSL" value={hsl} onCopy={() => copy(hsl, "HSL")} />
          </div>
        )}

        {!color && input.trim() && (
          <div className="apple-card px-5 py-4 text-center">
            <p className="text-[13px] text-[var(--color-ink-muted-48)]">
              Enter a valid HEX, RGB, or HSL color value.
            </p>
          </div>
        )}
      </div>

      <Disclaimer type="utility" />
    </div>
  );
}

function FormatRow({ label, value, onCopy }: { label: string; value: string; onCopy: () => void }) {
  return (
    <div className="flex items-center gap-3 px-3 py-2 rounded-[11px] bg-[var(--color-surface-pearl)]">
      <span className="text-[11px] font-semibold uppercase text-[var(--color-ink-muted-48)] w-8 shrink-0">
        {label}
      </span>
      <code className="flex-1 text-[13px] font-mono text-[var(--color-ink)] select-all">
        {value}
      </code>
      <button
        onClick={onCopy}
        className="apple-btn-ghost text-[11px] px-2 py-1 shrink-0"
      >
        Copy
      </button>
    </div>
  );
}
