"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import ThemeToggle from "../theme-toggle";
import { Disclaimer } from "../disclaimer";
import { PageTitle } from "../page-title";

const MOODS = [
  { emoji: "😊", label: "Sangat Baik", color: "bg-green-500" },
  { emoji: "🙂", label: "Baik", color: "bg-green-300" },
  { emoji: "😐", label: "Biasa", color: "bg-yellow-400" },
  { emoji: "😟", label: "Kurang Baik", color: "bg-orange-400" },
  { emoji: "😢", label: "Buruk", color: "bg-red-800" },
] as const;

type MoodEntry = { mood: number; note: string };

function formatDate(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

const DAYS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

export default function MoodTrackerPage() {
  const now = useMemo(() => new Date(), []);
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [data, setData] = useState<Record<string, MoodEntry>>({});
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [note, setNote] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("mood-tracker-data");
      if (raw) setData(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  const save = useCallback((next: Record<string, MoodEntry>) => {
    setData(next);
    localStorage.setItem("mood-tracker-data", JSON.stringify(next));
  }, []);

  const todayStr = formatDate(now.getFullYear(), now.getMonth(), now.getDate());

  const dim = daysInMonth(year, month);
  const startDow = new Date(year, month, 1).getDay();

  const days = useMemo(() => {
    const cells: (number | null)[] = [];
    for (let i = 0; i < startDow; i++) cells.push(null);
    for (let d = 1; d <= dim; d++) cells.push(d);
    return cells;
  }, [dim, startDow]);

  const stats = useMemo(() => {
    const counts = Array(MOODS.length).fill(0);
    for (let d = 1; d <= dim; d++) {
      const key = formatDate(year, month, d);
      const entry = data[key];
      if (entry) counts[entry.mood] = (counts[entry.mood] || 0) + 1;
    }
    return counts;
  }, [data, year, month, dim]);

  function handleDayClick(day: number) {
    const key = formatDate(year, month, day);
    const existing = data[key];
    setSelectedDay(day);
    setSelectedMood(existing ? existing.mood : null);
    setNote(existing ? existing.note : "");
  }

  function saveMood() {
    if (selectedDay === null || selectedMood === null) return;
    const key = formatDate(year, month, selectedDay);
    const next = { ...data, [key]: { mood: selectedMood, note } };
    save(next);
  }

  function deleteMood() {
    if (selectedDay === null) return;
    const key = formatDate(year, month, selectedDay);
    const next = { ...data };
    delete next[key];
    save(next);
    setSelectedMood(null);
    setNote("");
  }

  function prevMonth() {
    if (month === 0) { setYear((y) => y - 1); setMonth(11); }
    else setMonth((m) => m - 1);
    setSelectedDay(null);
  }

  function nextMonth() {
    if (month === 11) { setYear((y) => y + 1); setMonth(0); }
    else setMonth((m) => m + 1);
    setSelectedDay(null);
  }

  function isToday(day: number) {
    const today = new Date();
    return year === today.getFullYear() && month === today.getMonth() && day === today.getDate();
  }

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-12">
      <PageTitle title="Mood Tracker" />
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <h1 className="apple-headline text-[32px] leading-[1.47] tracking-[-0.374px] mb-2">
        Mood Tracker
      </h1>
      <p className="text-[13px] text-[var(--color-ink-muted-48)] mb-8 text-center max-w-lg">
        Catat suasana hati harianmu dan lihat polanya dalam sebulan.
      </p>

      <div className="w-full max-w-2xl apple-card px-6 py-5 mb-5">
        <h2 className="text-[12px] font-semibold uppercase text-[var(--color-ink-muted-48)] mb-3">
          Suasana Hati Hari Ini
        </h2>
        <div className="flex flex-wrap gap-3 justify-center mb-4">
          {MOODS.map((m, i) => (
            <button
              key={i}
              onClick={() => {
                const key = formatDate(now.getFullYear(), now.getMonth(), now.getDate());
                const next = { ...data, [key]: { mood: i, note: "" } };
                save(next);
              }}
              className={`flex flex-col items-center gap-1 px-4 py-3 rounded-[11px] transition-all ${
                data[todayStr]?.mood === i
                  ? "bg-[var(--color-primary)] text-white scale-105"
                  : "bg-[var(--color-surface-pearl)] text-[var(--color-ink-muted-48)] hover:brightness-95"
              }`}
            >
              <span className="text-[24px]">{m.emoji}</span>
              <span className="text-[10px] font-semibold">{m.label}</span>
            </button>
          ))}
        </div>
        {data[todayStr] && (
          <p className="text-center text-[12px] text-[var(--color-ink-muted-48)]">
            Hari ini: {MOODS[data[todayStr].mood].emoji} {MOODS[data[todayStr].mood].label}
          </p>
        )}
      </div>

      <div className="w-full max-w-2xl apple-card px-6 py-5 mb-5">
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="apple-btn-ghost text-[12px] px-3 py-1.5">
            &larr; Sebelumnya
          </button>
          <h2 className="text-[15px] font-semibold text-[var(--color-ink)]">
            {MONTHS[month]} {year}
          </h2>
          <button onClick={nextMonth} className="apple-btn-ghost text-[12px] px-3 py-1.5">
            Berikutnya &rarr;
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAYS.map((d) => (
            <div key={d} className="text-center text-[10px] font-semibold text-[var(--color-ink-muted-48)] py-1">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((day, i) => {
            if (day === null) return <div key={`e-${i}`} />;
            const key = formatDate(year, month, day);
            const entry = data[key];
            const moodColor = entry ? MOODS[entry.mood].color : "";
            return (
              <button
                key={key}
                onClick={() => handleDayClick(day)}
                className={`aspect-square rounded-[8px] text-[11px] font-semibold flex flex-col items-center justify-center transition-all ${
                  moodColor
                    ? `${moodColor} text-white`
                    : "bg-[var(--color-surface-pearl)] text-[var(--color-ink-muted-48)]"
                } ${
                  isToday(day) && !moodColor
                    ? "ring-2 ring-[var(--color-primary)]"
                    : ""
                } ${
                  selectedDay === day ? "ring-2 ring-[var(--color-primary)] scale-105" : ""
                }`}
              >
                <span>{day}</span>
                {entry && <span className="text-[8px]">{MOODS[entry.mood].emoji}</span>}
              </button>
            );
          })}
        </div>
      </div>

      <div className="w-full max-w-2xl apple-card px-6 py-5 mb-5">
        <h2 className="text-[12px] font-semibold uppercase text-[var(--color-ink-muted-48)] mb-3">
          Statistik Bulan Ini
        </h2>
        <div className="flex flex-wrap gap-2">
          {MOODS.map((m, i) => (
            <div
              key={i}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-[var(--color-surface-pearl)] text-[11px]"
            >
              <span>{m.emoji}</span>
              <span className="font-semibold text-[var(--color-ink)]">{stats[i]}</span>
              <span className="text-[var(--color-ink-muted-48)]">{m.label}</span>
            </div>
          ))}
        </div>
      </div>

      {selectedDay !== null && (
        <div className="w-full max-w-2xl apple-card px-6 py-5 mb-5">
          <h2 className="text-[12px] font-semibold uppercase text-[var(--color-ink-muted-48)] mb-3">
            {selectedDay} {MONTHS[month]} {year}
          </h2>
          <div className="flex flex-wrap gap-2 mb-3">
            {MOODS.map((m, i) => (
              <button
                key={i}
                onClick={() => setSelectedMood(i)}
                className={`flex items-center gap-1 px-3 py-2 rounded-[8px] text-[12px] transition-all ${
                  selectedMood === i
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-[var(--color-surface-pearl)] text-[var(--color-ink-muted-48)] hover:brightness-95"
                }`}
              >
                <span>{m.emoji}</span>
                <span>{m.label}</span>
              </button>
            ))}
          </div>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Catatan opsional..."
            className="apple-input w-full h-9 text-[13px] mb-3"
          />
          <div className="flex gap-2">
            <button
              onClick={saveMood}
              disabled={selectedMood === null}
              className="apple-btn-primary h-9 px-5 text-[12px] disabled:opacity-40"
            >
              Simpan
            </button>
            {data[formatDate(year, month, selectedDay)] && (
              <button onClick={deleteMood} className="apple-btn-ghost h-9 px-5 text-[12px] text-red-500">
                Hapus
              </button>
            )}
          </div>
        </div>
      )}

      <div className="w-full max-w-2xl apple-card px-6 py-5">
        <p className="text-[11px] leading-[1.6] text-[var(--color-ink-muted-48)]">
          Pelacakan suasana hati berdasarkan prinsip ecological momentary assessment (EMA, Shiffman et al., 2008).
        </p>
      </div>

      <Disclaimer type="utility" />
    </div>
  );
}
