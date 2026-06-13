"use client";

import { useMemo, useRef, useState } from "react";
import ThemeToggle from "../theme-toggle";

const COLORS = [
  "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7",
  "#DDA0DD", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E9",
  "#F8C471", "#82E0AA", "#F1948A", "#85929E", "#73C6B6",
  "#E59866", "#AED6F1", "#D7BDE2", "#A3E4D7", "#FAD7A0",
  "#A9CCE3", "#D5F5E3", "#FADBD8", "#D4E6F1", "#F5CBA7",
  "#ABEBC6", "#F2D7D5", "#AEB6BF", "#A9DFBF", "#F9E79F",
];

export default function WheelPage() {
  const [names, setNames] = useState<string[]>(["Alice", "Bob", "Charlie", "Diana"]);
  const [input, setInput] = useState("");
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const segmentAngle = useMemo(() => 360 / names.length, [names]);
  const radius = 180;

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

    const spinDeg = 1800 + Math.random() * 720;
    const totalRotation = rotation + spinDeg;
    setRotation(totalRotation);

    const normalized = totalRotation % 360;
    const winIdx = Math.floor((360 - (normalized % 360)) / segmentAngle) % names.length;
    const picked = names[winIdx];

    setTimeout(() => {
      setWinner(picked);
      setSpinning(false);
    }, 4000);
  }

  function drawCanvas(ctx: CanvasRenderingContext2D, rot: number) {
    const cx = radius;
    const cy = radius;
    const seg = (2 * Math.PI) / names.length;

    ctx.clearRect(0, 0, radius * 2, radius * 2);

    names.forEach((name, i) => {
      const startAngle = rot + i * seg - Math.PI / 2;
      const endAngle = startAngle + seg;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius - 4, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = COLORS[i % COLORS.length];
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.stroke();

      const midAngle = startAngle + seg / 2;
      const textR = radius * 0.62;
      const tx = cx + Math.cos(midAngle) * textR;
      const ty = cy + Math.sin(midAngle) * textR;

      ctx.save();
      ctx.translate(tx, ty);
      ctx.rotate(midAngle + Math.PI / 2);
      ctx.fillStyle = "#1a1a1a";
      ctx.font = "bold 11px -apple-system, system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const maxLen = Math.floor((radius * 0.35) / 6.5);
      const label = name.length > maxLen ? name.slice(0, maxLen) + ".." : name;
      ctx.fillText(label, 0, 0);
      ctx.restore();
    });

    const grd = ctx.createRadialGradient(cx, cy, 8, cx, cy, radius * 0.18);
    grd.addColorStop(0, "#fff");
    grd.addColorStop(1, "#f0f0f0");
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.14, 0, 2 * Math.PI);
    ctx.fillStyle = grd;
    ctx.fill();
    ctx.strokeStyle = "#ddd";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-12">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <h1 className="apple-headline text-[34px] leading-[1.47] tracking-[-0.374px] mb-2">
        Wheel of Names
      </h1>
      <p className="text-[13px] text-[var(--color-ink-muted-48)] mb-8 text-center max-w-lg">
        Add names and spin to pick a random winner.
      </p>

      <div className="w-full max-w-2xl apple-card px-6 py-5 mb-5">
        <div className="flex items-center gap-2 mb-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addName()}
            placeholder="Enter a name..."
            className="apple-input flex-1 h-10 text-[14px]"
          />
          <button onClick={addName} className="apple-btn-primary h-10 px-4 text-[13px] whitespace-nowrap">
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
          {/* Pointer */}
          <div className="absolute top-[-8px] left-1/2 -translate-x-1/2 z-10">
            <svg width="28" height="30" viewBox="0 0 28 30">
              <polygon points="14,30 0,0 28,0" fill="#FF3B30" stroke="#fff" strokeWidth="2" />
            </svg>
          </div>
          <canvas
            ref={canvasRef}
            width={radius * 2}
            height={radius * 2}
            className="w-[360px] h-[360px] rounded-full shadow-lg"
            style={{ transform: `rotate(${rotation}deg)`, transition: spinning ? "transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)" : "none" }}
          />
        </div>
        <button
          onClick={spin}
          disabled={spinning || names.length < 2}
          className="apple-btn-primary mt-6 h-12 px-10 text-[15px] font-semibold disabled:opacity-40"
        >
          {spinning ? "Spinning..." : "Spin the Wheel!"}
        </button>
      </div>

      {winner && (
        <div className="w-full max-w-2xl apple-card px-6 py-5 text-center animate-in fade-in">
          <div className="text-[36px] mb-2">🎉</div>
          <div className="text-[12px] font-semibold uppercase text-[var(--color-ink-muted-48)] mb-1">Winner</div>
          <div className="text-[28px] font-bold text-[var(--color-ink)]">{winner}</div>
        </div>
      )}

      {!winner && names.length >= 2 && (
        <div className="w-full max-w-2xl apple-card px-6 py-5">
          <h2 className="text-[12px] font-semibold uppercase text-[var(--color-ink-muted-48)] mb-2">How It Works</h2>
          <p className="text-[13px] leading-[1.6] text-[var(--color-ink-muted-48)]">
            Enter names above, then spin the wheel. The pointer at the top determines the winner. Each segment is colored for easy identification. You need at least 2 names to spin.
          </p>
        </div>
      )}
    </div>
  );
}
