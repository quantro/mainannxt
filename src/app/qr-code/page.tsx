"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import ThemeToggle from "../theme-toggle";
import { Disclaimer } from "../disclaimer";

export default function QrCodePage() {
  const [text, setText] = useState("");
  const [errorLevel, setErrorLevel] = useState<"L" | "M" | "Q" | "H">("M");
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!text.trim() || !canvasRef.current) return;
    QRCode.toCanvas(canvasRef.current, text.trim(), {
      width: 280,
      margin: 2,
      errorCorrectionLevel: errorLevel,
      color: { dark: fgColor, light: bgColor },
    }).catch(() => {});
  }, [text, errorLevel, fgColor, bgColor]);

  async function doDownload() {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = "qrcode.png";
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  }

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-12">
      <div className="absolute top-4 right-4"><ThemeToggle /></div>
      <h1 className="apple-headline text-[34px] leading-[1.47] tracking-[-0.374px] mb-2">QR Code Generator</h1>
      <p className="text-[13px] text-[var(--color-ink-muted-48)] mb-6 text-center max-w-lg">
        Generate QR codes from any text or URL.
      </p>

      <div className="w-full max-w-md space-y-4">
        <div className="apple-card px-5 py-4">
          <h2 className="text-[11px] font-semibold uppercase text-[var(--color-ink-muted-48)] mb-2">Content</h2>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste text / URL here…"
            rows={3}
            className="apple-input w-full resize-none text-[14px]"
          />
        </div>

        <div className="apple-card px-5 py-4 space-y-3">
          <h2 className="text-[11px] font-semibold uppercase text-[var(--color-ink-muted-48)]">Options</h2>
          <div className="grid grid-cols-2 gap-3 text-[13px]">
            <div>
              <label className="text-[11px] text-[var(--color-ink-muted-48)] block mb-0.5">Error Correction</label>
              <select value={errorLevel} onChange={(e) => setErrorLevel(e.target.value as any)} className="apple-input w-full h-9 text-[12px]">
                <option value="L">Low (7%)</option>
                <option value="M">Medium (15%)</option>
                <option value="Q">Quartile (25%)</option>
                <option value="H">High (30%)</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] text-[var(--color-ink-muted-48)] block mb-0.5">Foreground</label>
              <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-full h-9 rounded-[8px] cursor-pointer border-0 p-0.5" />
            </div>
            <div>
              <label className="text-[11px] text-[var(--color-ink-muted-48)] block mb-0.5">Background</label>
              <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-full h-9 rounded-[8px] cursor-pointer border-0 p-0.5" />
            </div>
          </div>
        </div>

        <div className="apple-card px-5 py-5 flex flex-col items-center">
          {text.trim() ? (
            <>
              <canvas ref={canvasRef} className="rounded-[8px]" width={280} height={280} />
              <button onClick={doDownload} className="apple-btn-primary mt-3 px-5 py-1.5 text-[13px]">Download PNG</button>
            </>
          ) : (
            <div className="w-[280px] h-[280px] rounded-[8px] bg-[var(--color-surface-pearl)] flex items-center justify-center text-[13px] text-[var(--color-ink-muted-48)]">
              QR code will appear here
            </div>
          )}
        </div>
      </div>

      <Disclaimer type="utility" />
    </div>
  );
}
