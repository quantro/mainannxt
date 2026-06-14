"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import ThemeToggle from "../theme-toggle";
import { Disclaimer } from "../disclaimer";
import { PageTitle } from "../page-title";

type Mode = "focus" | "shortBreak" | "longBreak";

const TABS: { mode: Mode; label: string }[] = [
  { mode: "focus", label: "Fokus" },
  { mode: "shortBreak", label: "Istirahat Singkat" },
  { mode: "longBreak", label: "Istirahat Panjang" },
];

function formatMMSS(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
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

function getTodayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function readSessions(): number {
  try {
    const raw = localStorage.getItem(`pomodoro-sessions-${getTodayKey()}`);
    return raw ? parseInt(raw, 10) || 0 : 0;
  } catch {
    return 0;
  }
}

function writeSessions(count: number) {
  try {
    localStorage.setItem(`pomodoro-sessions-${getTodayKey()}`, String(count));
  } catch {
    // ignore
  }
}

export default function FocusTimerPage() {
  const [mode, setMode] = useState<Mode>("focus");
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [remaining, setRemaining] = useState(25 * 60);
  const [total, setTotal] = useState(25 * 60);
  const [sessionsToday, setSessionsToday] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const [focusMin, setFocusMin] = useState("25");
  const [shortMin, setShortMin] = useState("5");
  const [longMin, setLongMin] = useState("15");

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setSessionsToday(readSessions());
  }, []);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  function getDuration(m: Mode): number {
    switch (m) {
      case "focus": return Math.max(parseInt(focusMin) || 25, 1) * 60;
      case "shortBreak": return Math.max(parseInt(shortMin) || 5, 1) * 60;
      case "longBreak": return Math.max(parseInt(longMin) || 15, 1) * 60;
    }
  }

  function switchMode(m: Mode) {
    clearTimer();
    setRunning(false);
    setPaused(false);
    setShowCompletion(false);
    setMode(m);
    const dur = getDuration(m);
    setRemaining(dur);
    setTotal(dur);
  }

  function startTimer() {
    const dur = getDuration(mode);
    setRemaining(dur);
    setTotal(dur);
    setRunning(true);
    setPaused(false);
    setShowCompletion(false);
  }

  useEffect(() => {
    if (!running || paused) return;
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearTimer();
          setRunning(false);
          playBeep();
          if (mode === "focus") {
            const next = readSessions() + 1;
            writeSessions(next);
            setSessionsToday(next);
            setShowCompletion(true);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearTimer();
  }, [running, paused, mode, clearTimer]);

  function pauseTimer() {
    setPaused(true);
    clearTimer();
  }

  function resumeTimer() {
    setPaused(false);
  }

  function resetTimer() {
    clearTimer();
    setRunning(false);
    setPaused(false);
    setShowCompletion(false);
    const dur = getDuration(mode);
    setRemaining(dur);
    setTotal(dur);
  }

  const circumference = 2 * Math.PI * 120;
  const progress = total > 0 ? remaining / total : 0;
  const dashoffset = circumference * (1 - progress);

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-12">
      <PageTitle title="Focus Timer" />
      <div className="absolute top-4 right-4"><ThemeToggle /></div>
      <h1 className="cosmic-headline text-[32px] leading-[1.1] text-center mb-1">Focus Timer</h1>
      <p className="text-[13px] text-[var(--color-ink-muted-48)] mb-6 text-center max-w-lg">
        Tingkatkan produktivitas dengan Teknik Pomodoro.
      </p>

      <div className="w-full max-w-md space-y-4">
        <div className="cosmic-card px-5 py-4">
          <div className="flex gap-2 mb-4">
            {TABS.map((tab) => (
              <button
                key={tab.mode}
                onClick={() => switchMode(tab.mode)}
                className={`flex-1 h-9 rounded-[10px] text-[13px] font-semibold transition-colors ${
                  mode === tab.mode
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-[var(--color-surface-pearl)] text-[var(--color-ink-muted-48)]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative flex items-center justify-center py-4">
            <svg width="280" height="280" className="-rotate-90">
              <circle
                cx="140" cy="140" r="120"
                fill="none"
                stroke="var(--color-surface-pearl)"
                strokeWidth="8"
              />
              <circle
                cx="140" cy="140" r="120"
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashoffset}
                style={{ transition: "stroke-dashoffset 0.5s ease" }}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-[56px] font-mono font-bold tracking-[0.1em] text-[var(--color-ink)] tabular-nums">
                {formatMMSS(remaining)}
              </span>
              {showCompletion && (
                <span className="text-[13px] font-semibold text-green-500 mt-1">
                  Sesi fokus selesai! 🎉
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-2 justify-center">
          {!running ? (
            <button onClick={startTimer} className="cosmic-btn-primary h-11 px-8 text-[14px]">
              Mulai
            </button>
          ) : paused ? (
            <button onClick={resumeTimer} className="cosmic-btn-primary h-11 px-8 text-[14px]">
              Lanjutkan
            </button>
          ) : (
            <button onClick={pauseTimer} className="cosmic-btn-primary h-11 px-8 text-[14px]">
              Jeda
            </button>
          )}
          {(running || remaining > 0) && (
            <button onClick={resetTimer} className="cosmic-btn-primary h-11 px-8 text-[14px] !bg-[var(--color-surface-pearl)] !text-[var(--color-ink)]">
              Reset
            </button>
          )}
        </div>

        <div className="cosmic-card px-5 py-3 flex items-center justify-between">
          <span className="text-[13px] text-[var(--color-ink-muted-48)]">
            Hari ini: {sessionsToday} sesi fokus selesai
          </span>
          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            className="p-1.5 rounded-[8px] text-[var(--color-ink-muted-48)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-pearl)] transition-colors"
            aria-label="Buka pengaturan"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
        </div>

        {settingsOpen && (
          <div className="cosmic-card px-5 py-4 space-y-3">
            <h2 className="text-[11px] font-semibold uppercase text-[var(--color-ink-muted-48)]">Pengaturan Durasi (menit)</h2>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] text-[var(--color-ink-muted-48)] mb-1">Fokus</label>
                <input
                  type="number"
                  min="1" max="120"
                  value={focusMin}
                  onChange={(e) => setFocusMin(e.target.value)}
                  className="cosmic-input w-full h-10 text-center text-[14px]"
                />
              </div>
              <div>
                <label className="block text-[11px] text-[var(--color-ink-muted-48)] mb-1">Istirahat Singkat</label>
                <input
                  type="number"
                  min="1" max="30"
                  value={shortMin}
                  onChange={(e) => setShortMin(e.target.value)}
                  className="cosmic-input w-full h-10 text-center text-[14px]"
                />
              </div>
              <div>
                <label className="block text-[11px] text-[var(--color-ink-muted-48)] mb-1">Istirahat Panjang</label>
                <input
                  type="number"
                  min="1" max="60"
                  value={longMin}
                  onChange={(e) => setLongMin(e.target.value)}
                  className="cosmic-input w-full h-10 text-center text-[14px]"
                />
              </div>
            </div>
          </div>
        )}

        <p className="text-[11px] text-[var(--color-ink-muted-48)] text-center leading-[1.5]">
          Berdasarkan Teknik Pomodoro (Francesco Cirillo, 1980-an)
        </p>
      </div>

      <Disclaimer type="utility" />
    </div>
  );
}
