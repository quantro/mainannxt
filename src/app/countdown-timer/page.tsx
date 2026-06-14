"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ThemeToggle from "../theme-toggle";
import { Disclaimer } from "../disclaimer";
import { PageTitle } from "../page-title";

type Mode = "countdown" | "stopwatch";

function formatTime(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function playBeep() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 880;
    gain.gain.value = 0.3;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch {
    // ignore
  }
}

export default function CountdownTimerPage() {
  const [mode, setMode] = useState<Mode>("countdown");

  // Countdown state
  const [hours, setHours] = useState("0");
  const [minutes, setMinutes] = useState("5");
  const [seconds, setSeconds] = useState("0");
  const [remaining, setRemaining] = useState(0);
  const [cdRunning, setCdRunning] = useState(false);
  const [cdPaused, setCdPaused] = useState(false);
  const cdIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Stopwatch state
  const [elapsed, setElapsed] = useState(0);
  const [swRunning, setSwRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const swIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearCd = useCallback(() => {
    if (cdIntervalRef.current) {
      clearInterval(cdIntervalRef.current);
      cdIntervalRef.current = null;
    }
  }, []);

  const clearSw = useCallback(() => {
    if (swIntervalRef.current) {
      clearInterval(swIntervalRef.current);
      swIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      clearCd();
      clearSw();
    };
  }, [clearCd, clearSw]);

  function startCountdown() {
    const h = parseInt(hours) || 0;
    const m = parseInt(minutes) || 0;
    const s = parseInt(seconds) || 0;
    const total = h * 3600 + m * 60 + s;
    if (total <= 0) return;
    setRemaining(total);
    setCdRunning(true);
    setCdPaused(false);
  }

  useEffect(() => {
    if (!cdRunning || cdPaused) return;
    cdIntervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearCd();
          setCdRunning(false);
          playBeep();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearCd();
  }, [cdRunning, cdPaused, clearCd]);

  function pauseCountdown() {
    setCdPaused(true);
    clearCd();
  }

  function resumeCountdown() {
    setCdPaused(false);
  }

  function resetCountdown() {
    clearCd();
    setCdRunning(false);
    setCdPaused(false);
    setRemaining(0);
  }

  function startStopwatch() {
    setSwRunning(true);
    setElapsed(0);
    setLaps([]);
  }

  useEffect(() => {
    if (!swRunning) return;
    const start = Date.now() - elapsed * 1000;
    swIntervalRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - start) / 1000));
    }, 100);
    return () => clearSw();
  }, [swRunning, elapsed, clearSw]);

  function pauseStopwatch() {
    setSwRunning(false);
    clearSw();
  }

  function resetStopwatch() {
    clearSw();
    setSwRunning(false);
    setElapsed(0);
    setLaps([]);
  }

  function recordLap() {
    setLaps((prev) => [...prev, elapsed]);
  }

  const displayTime =
    mode === "countdown"
      ? formatTime(remaining)
      : formatTime(elapsed);

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-12">
      <PageTitle title="Countdown Timer" />
      <div className="absolute top-4 right-4"><ThemeToggle /></div>
      <h1 className="apple-headline text-[32px] leading-[1.1] text-center mb-1">Countdown Timer</h1>
      <p className="text-[13px] text-[var(--color-ink-muted-48)] mb-6 text-center max-w-lg">
        Count down to zero or track elapsed time.
      </p>

      <div className="w-full max-w-md space-y-4">
        <div className="apple-card px-5 py-4">
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => { setMode("countdown"); resetCountdown(); resetStopwatch(); }}
              className={`flex-1 h-9 rounded-[10px] text-[13px] font-semibold transition-colors ${
                mode === "countdown"
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-[var(--color-surface-pearl)] text-[var(--color-ink-muted-48)]"
              }`}
            >
              Countdown
            </button>
            <button
              onClick={() => { setMode("stopwatch"); resetCountdown(); resetStopwatch(); }}
              className={`flex-1 h-9 rounded-[10px] text-[13px] font-semibold transition-colors ${
                mode === "stopwatch"
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-[var(--color-surface-pearl)] text-[var(--color-ink-muted-48)]"
              }`}
            >
              Stopwatch
            </button>
          </div>

          <div className="text-center">
            <div className="text-[56px] font-mono font-bold tracking-[0.1em] text-[var(--color-ink)] tabular-nums">
              {displayTime}
            </div>
          </div>
        </div>

        {mode === "countdown" && (
          <>
            {!cdRunning && remaining === 0 && (
              <div className="apple-card px-5 py-4">
                <div className="flex gap-2 justify-center">
                  <input
                    type="number"
                    min="0"
                    max="99"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    className="apple-input w-16 h-10 text-center text-[14px]"
                    placeholder="HH"
                  />
                  <span className="self-center text-[var(--color-ink-muted-48)] text-[20px] font-light">:</span>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={minutes}
                    onChange={(e) => setMinutes(e.target.value)}
                    className="apple-input w-16 h-10 text-center text-[14px]"
                    placeholder="MM"
                  />
                  <span className="self-center text-[var(--color-ink-muted-48)] text-[20px] font-light">:</span>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={seconds}
                    onChange={(e) => setSeconds(e.target.value)}
                    className="apple-input w-16 h-10 text-center text-[14px]"
                    placeholder="SS"
                  />
                </div>
              </div>
            )}

            <div className="flex gap-2 justify-center">
              {!cdRunning ? (
                <button onClick={startCountdown} className="apple-btn-primary h-11 px-8 text-[14px]">
                  Start
                </button>
              ) : cdPaused ? (
                <button onClick={resumeCountdown} className="apple-btn-primary h-11 px-8 text-[14px]">
                  Resume
                </button>
              ) : (
                <button onClick={pauseCountdown} className="apple-btn-primary h-11 px-8 text-[14px]">
                  Pause
                </button>
              )}
              {(cdRunning || remaining > 0) && (
                <button onClick={resetCountdown} className="apple-btn-primary h-11 px-8 text-[14px] !bg-[var(--color-surface-pearl)] !text-[var(--color-ink)]">
                  Reset
                </button>
              )}
            </div>
          </>
        )}

        {mode === "stopwatch" && (
          <>
            <div className="flex gap-2 justify-center">
              {!swRunning ? (
                <button onClick={startStopwatch} className="apple-btn-primary h-11 px-8 text-[14px]">
                  {elapsed === 0 ? "Start" : "Resume"}
                </button>
              ) : (
                <button onClick={pauseStopwatch} className="apple-btn-primary h-11 px-8 text-[14px]">
                  Pause
                </button>
              )}
              {elapsed > 0 && (
                <button onClick={resetStopwatch} className="apple-btn-primary h-11 px-8 text-[14px] !bg-[var(--color-surface-pearl)] !text-[var(--color-ink)]">
                  Reset
                </button>
              )}
              {swRunning && (
                <button onClick={recordLap} className="apple-btn-primary h-11 px-8 text-[14px]">
                  Lap
                </button>
              )}
            </div>

            {laps.length > 0 && (
              <div className="apple-card px-5 py-4 max-h-48 overflow-y-auto">
                <h2 className="text-[11px] font-semibold uppercase text-[var(--color-ink-muted-48)] mb-2">Laps</h2>
                <div className="space-y-1">
                  {laps.map((lap, i) => (
                    <div key={i} className="flex justify-between text-[13px] text-[var(--color-ink)]">
                      <span className="text-[var(--color-ink-muted-48)]">Lap {i + 1}</span>
                      <span className="font-mono">{formatTime(lap)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <Disclaimer type="utility" />
    </div>
  );
}
