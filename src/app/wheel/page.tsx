"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ThemeToggle from "../theme-toggle";
import { Disclaimer } from "../disclaimer";
import { PageTitle } from "../page-title";

const COLORS = [
  "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7",
  "#DDA0DD", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E9",
  "#F8C471", "#82E0AA", "#F1948A", "#85929E", "#73C6B6",
  "#E59866", "#AED6F1", "#D7BDE2", "#A3E4D7", "#FAD7A0",
  "#A9CCE3", "#D5F5E3", "#FADBD8", "#D4E6F1", "#F5CBA7",
  "#ABEBC6", "#F2D7D5", "#AEB6BF", "#A9DFBF", "#F9E79F",
];

function isDark(hex: string) {
  const c = hex.replace("#", "");
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  return r * 0.299 + g * 0.587 + b * 0.114 < 140;
}

export default function WheelPage() {
  const [names, setNames] = useState<string[]>(["Alice", "Bob", "Charlie", "Diana"]);
  const [input, setInput] = useState("");
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const radius = 180;

  const segAngle = useMemo(() => 360 / names.length, [names]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || names.length === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cx = radius;
    const cy = radius;
    const seg = (2 * Math.PI) / names.length;

    ctx.clearRect(0, 0, radius * 2, radius * 2);

    names.forEach((name, i) => {
      const startAngle = i * seg - Math.PI / 2;
      const endAngle = startAngle + seg;

      // Segment fill
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius - 4, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = COLORS[i % COLORS.length];
      ctx.fill();

      // Segment border
      ctx.strokeStyle = "rgba(255,255,255,0.6)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Text
      const midAngle = startAngle + seg / 2;
      const textR = radius * 0.62;
      const tx = cx + Math.cos(midAngle) * textR;
      const ty = cy + Math.sin(midAngle) * textR;

      ctx.save();
      ctx.translate(tx, ty);
      ctx.rotate(midAngle + Math.PI / 2);
      ctx.fillStyle = isDark(COLORS[i % COLORS.length]) ? "#fff" : "#1a1a1a";
      ctx.font = `bold ${Math.max(10, Math.min(14, 200 / names.length))}px -apple-system, system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const maxLen = Math.max(3, Math.floor((radius * 0.35) / (5 + names.length * 0.4)));
      const label = name.length > maxLen ? name.slice(0, maxLen - 1) + "…" : name;
      ctx.fillText(label, 0, 0);
      ctx.restore();
    });

    // Center hub with ring
    ctx.beginPath();
    ctx.arc(cx, cy, 16, 0, 2 * Math.PI);
    const g = ctx.createRadialGradient(cx - 4, cy - 4, 2, cx, cy, 16);
    g.addColorStop(0, "#fff");
    g.addColorStop(1, "#e0e0e0");
    ctx.fillStyle = g;
    ctx.fill();
    ctx.strokeStyle = "#ccc";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }, [names, radius]);

  function addName() {
    const trimmed = input.trim();
    if (trimmed && !names.includes(trimmed)) {
      setNames([...names, trimmed]);
      setInput("");
    }
  }

  function removeName(name: string) {
    if (names.length <= 2) return;
    setNames(names.filter((n) => n !== name));
    setWinner(null);
  }

  function spin() {
    if (spinning || names.length < 2) return;
    setSpinning(true);
    setWinner(null);

    const extraSpins = 5 + Math.floor(Math.random() * 3);
    const spinDeg = extraSpins * 360 + Math.random() * 360;
    const totalRotation = rotation + spinDeg;
    setRotation(totalRotation);

    const normalized = ((totalRotation % 360) + 360) % 360;
    const winIdx = Math.floor((360 - normalized) / segAngle) % names.length;
    const picked = names[winIdx];

    setTimeout(() => {
      setWinner(picked);
      setSpinning(false);
    }, 4500);
  }

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-12">
      <PageTitle title="Wheel of Names" />
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <h1 className="cosmic-headline text-[34px] leading-[1.47] tracking-[-0.374px] mb-2">
        Wheel of Names
      </h1>
      <p className="text-[13px] text-[var(--color-ink-muted-48)] mb-8 text-center max-w-lg">
        Add names and spin to pick a random winner.
      </p>

      <div className="w-full max-w-2xl cosmic-card px-6 py-5 mb-5">
        <div className="flex items-center gap-2 mb-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addName()}
            placeholder="Enter a name..."
            className="cosmic-input flex-1 h-10 text-[14px]"
          />
          <button onClick={addName} className="cosmic-btn-primary h-10 px-4 text-[13px] whitespace-nowrap">
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {names.map((name) => (
            <span
              key={name}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[8px] text-[12px] bg-[var(--color-surface-pearl)] text-[var(--color-ink)]"
            >
              {name}
              <button
                onClick={() => removeName(name)}
                className="text-[var(--color-ink-muted-48)] hover:text-red-500 leading-none text-[14px]"
                disabled={names.length <= 2}
              >
                &times;
              </button>
            </span>
          ))}
        </div>
        {names.length < 2 && (
          <p className="text-[11px] text-red-400 mt-2">Add at least 2 names to spin.</p>
        )}
      </div>

      <div className="relative w-full max-w-[400px] mx-auto mb-6 flex flex-col items-center">
        <div className="w-[360px] h-[360px] relative touch-none">
          <div className="absolute top-[-8px] left-1/2 -translate-x-1/2 z-10">
            <svg width="28" height="32" viewBox="0 0 28 32">
              <polygon points="14,32 0,0 28,0" fill="#FF3B30" stroke="#fff" strokeWidth="2" />
            </svg>
          </div>
          <canvas
            ref={canvasRef}
            width={radius * 2}
            height={radius * 2}
            className="w-[360px] h-[360px] rounded-full shadow-xl"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: spinning
                ? "transform 4.5s cubic-bezier(0.13, 0.72, 0.14, 1)"
                : "none",
            }}
          />
        </div>
        <button
          onClick={spin}
          disabled={spinning || names.length < 2}
          className="cosmic-btn-primary mt-6 h-12 px-10 text-[15px] font-semibold disabled:opacity-40"
        >
          {spinning ? "Spinning..." : "Spin the Wheel!"}
        </button>
      </div>

      {winner && (
        <div className="w-full max-w-2xl cosmic-card px-6 py-5 text-center">
          <div className="text-[36px] mb-2">🎉</div>
          <div className="text-[12px] font-semibold uppercase text-[var(--color-ink-muted-48)] mb-1">Winner</div>
          <div className="text-[28px] font-bold text-[var(--color-ink)]">{winner}</div>
        </div>
      )}

      {!winner && names.length >= 2 && (
        <div className="w-full max-w-2xl cosmic-card px-6 py-5">
          <h2 className="text-[12px] font-semibold uppercase text-[var(--color-ink-muted-48)] mb-2">How It Works</h2>
          <p className="text-[13px] leading-[1.6] text-[var(--color-ink-muted-48)]">
            Enter names above, then spin the wheel. The pointer at the top determines the winner. Each segment is colored for easy identification. You need at least 2 names to spin.
          </p>
        </div>
      )}
          <Disclaimer type="utility" />
    </div>
  );
}
