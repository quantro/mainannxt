"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import ThemeToggle from "../theme-toggle";
import { Disclaimer } from "../disclaimer";
import { PageTitle } from "../page-title";

interface Habit {
  id: string;
  name: string;
  completion: Record<string, boolean>;
}

function getWeekDates(): Date[] {
  const now = new Date();
  const day = now.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diff);
  const dates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    dates.push(d);
  }
  return dates;
}

function formatDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatShort(d: Date): string {
  const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
  return `${days[d.getDay()]}, ${d.getDate()}`;
}

function calcStreak(completion: Record<string, boolean>): number {
  const today = new Date();
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = formatDate(d);
    if (completion[key]) streak++;
    else break;
  }
  return streak;
}

let idCounter = 1;
function genId() {
  return String(idCounter++);
}

export default function HabitTrackerPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [input, setInput] = useState("");

  const weekDates = useMemo(() => getWeekDates(), []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("habit-tracker-data");
      if (raw) {
        const parsed: Habit[] = JSON.parse(raw);
        setHabits(parsed);
        const maxId = parsed.reduce((m, h) => Math.max(m, parseInt(h.id) || 0), 0);
        idCounter = maxId + 1;
      }
    } catch { /* ignore */ }
  }, []);

  const save = useCallback(
    (next: Habit[]) => {
      setHabits(next);
      localStorage.setItem("habit-tracker-data", JSON.stringify(next));
    },
    []
  );

  function addHabit() {
    const trimmed = input.trim();
    if (!trimmed) return;
    const next: Habit[] = [
      ...habits,
      { id: genId(), name: trimmed, completion: {} },
    ];
    save(next);
    setInput("");
  }

  function removeHabit(id: string) {
    save(habits.filter((h) => h.id !== id));
  }

  function toggleDay(habitId: string, dateKey: string) {
    const next = habits.map((h) => {
      if (h.id !== habitId) return h;
      return {
        ...h,
        completion: {
          ...h.completion,
          [dateKey]: !h.completion[dateKey],
        },
      };
    });
    save(next);
  }

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-12">
      <PageTitle title="Habit Tracker" />
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <h1 className="cosmic-headline text-[32px] leading-[1.47] tracking-[-0.374px] mb-2">
        Habit Tracker
      </h1>
      <p className="text-[13px] text-[var(--color-ink-muted-48)] mb-8 text-center max-w-lg">
        Lacak kebiasaan harianmu dan bangun rutinitas yang konsisten.
      </p>

      <div className="w-full max-w-3xl cosmic-card px-6 py-5 mb-5">
        <div className="flex items-center gap-2 mb-4">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addHabit()}
            placeholder="Tambah kebiasaan baru..."
            className="cosmic-input flex-1 h-10 text-[14px]"
          />
          <button onClick={addHabit} className="cosmic-btn-primary h-10 px-4 text-[13px] whitespace-nowrap">
            Tambah
          </button>
        </div>

        {habits.length === 0 ? (
          <p className="text-[12px] text-[var(--color-ink-muted-48)] text-center py-8">
            Belum ada kebiasaan. Tambahkan kebiasaan pertama kamu!
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead>
                <tr>
                  <th className="text-left font-semibold text-[var(--color-ink-muted-48)] py-2 pr-3 sticky left-0 bg-[var(--color-canvas)] min-w-[120px]">
                    Kebiasaan
                  </th>
                  {weekDates.map((d, i) => (
                    <th
                      key={i}
                      className="text-center font-semibold text-[var(--color-ink-muted-48)] py-2 px-1.5 min-w-[52px]"
                    >
                      <div>{formatShort(d).split(",")[0]}</div>
                      <div className="text-[10px]">{formatShort(d).split(",")[1]}</div>
                    </th>
                  ))}
                  <th className="text-center font-semibold text-[var(--color-ink-muted-48)] py-2 pl-3 min-w-[56px]">
                    Streak
                  </th>
                </tr>
              </thead>
              <tbody>
                {habits.map((habit) => {
                  const streak = calcStreak(habit.completion);
                  return (
                    <tr key={habit.id} className="border-t border-[var(--color-hairline)]">
                      <td className="py-2.5 pr-3 sticky left-0 bg-[var(--color-canvas)]">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium text-[var(--color-ink)] truncate max-w-[120px]">
                            {habit.name}
                          </span>
                          <button
                            onClick={() => removeHabit(habit.id)}
                            className="text-[var(--color-ink-muted-48)] hover:text-red-500 text-[14px] leading-none shrink-0"
                          >
                            &times;
                          </button>
                        </div>
                      </td>
                      {weekDates.map((d, i) => {
                        const key = formatDate(d);
                        const checked = habit.completion[key] || false;
                        return (
                          <td key={i} className="text-center py-2.5 px-1.5">
                            <button
                              onClick={() => toggleDay(habit.id, key)}
                              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all text-[11px] ${
                                checked
                                  ? "bg-green-500 text-white"
                                  : "bg-[var(--color-surface-pearl)] text-[var(--color-ink-muted-48)] hover:brightness-95 border border-[var(--color-hairline)]"
                              }`}
                            >
                              {checked ? "✓" : ""}
                            </button>
                          </td>
                        );
                      })}
                      <td className="text-center py-2.5 pl-3">
                        <span
                          className={`inline-flex items-center justify-center min-w-[32px] px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                            streak > 0
                              ? "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-200"
                              : "bg-[var(--color-surface-pearl)] text-[var(--color-ink-muted-48)]"
                          }`}
                        >
                          {streak}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="w-full max-w-3xl cosmic-card px-6 py-5">
        <p className="text-[11px] leading-[1.6] text-[var(--color-ink-muted-48)]">
          Konsep habit tracking terinspirasi dari Atomic Habits (James Clear, 2018) dan The Power of Habit (Charles Duhigg, 2012).
        </p>
      </div>

      <Disclaimer type="utility" />
    </div>
  );
}
