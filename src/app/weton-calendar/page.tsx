"use client";

import { useMemo, useState } from "react";
import ThemeToggle from "../theme-toggle";
import { Disclaimer } from "../disclaimer";
import { PageTitle } from "../page-title";

const DAYS = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const PASARAN = ["Legi", "Pahing", "Pon", "Wage", "Kliwon"];

const PASARAN_COLORS = [
  "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
  "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
];

const WETON_NAMES: string[] = [];
for (const day of DAYS) {
  for (const pasaran of PASARAN) {
    WETON_NAMES.push(`${day} ${pasaran}`);
  }
}

function gregorianToJdn(y: number, m: number, d: number): number {
  const a = Math.floor((14 - m) / 12);
  const yy = y + 4800 - a;
  const mm = m + 12 * a - 3;
  return d + Math.floor((153 * mm + 2) / 5) + 365 * yy + Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400) - 32045;
}

function daysInMonth(month: number, year: number) {
  return new Date(year, month, 0).getDate();
}

interface DayInfo {
  day: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
  jdn: number;
  dayOfWeek: number;
  pasaranIndex: number;
  wetonDay: string;
  wetonPasaran: string;
}

export default function WetonCalendarPage() {
  const now = useMemo(() => new Date(), []);
  const [yearText, setYearText] = useState(String(now.getFullYear()));
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [calculated, setCalculated] = useState(true);

  const year = parseInt(yearText) || now.getFullYear();

  const today = useMemo(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
  }, []);

  const days: DayInfo[] = useMemo(() => {
    const result: DayInfo[] = [];
    const firstOfMonth = new Date(year, month - 1, 1);
    const startDay = firstOfMonth.getDay();
    const totalDays = daysInMonth(month, year);
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;
    const prevTotal = daysInMonth(prevMonth, prevYear);
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;

    for (let i = startDay - 1; i >= 0; i--) {
      const d = prevTotal - i;
      const jdn = gregorianToJdn(prevYear, prevMonth, d);
      result.push({
        day: d,
        month: prevMonth,
        year: prevYear,
        isCurrentMonth: false,
        jdn,
        dayOfWeek: (jdn + 1) % 7,
        pasaranIndex: ((jdn + 1) % 5 + 5) % 5,
        wetonDay: DAYS[(jdn + 1) % 7],
        wetonPasaran: PASARAN[((jdn + 1) % 5 + 5) % 5],
      });
    }

    for (let d = 1; d <= totalDays; d++) {
      const jdn = gregorianToJdn(year, month, d);
      result.push({
        day: d,
        month,
        year,
        isCurrentMonth: true,
        jdn,
        dayOfWeek: (jdn + 1) % 7,
        pasaranIndex: ((jdn + 1) % 5 + 5) % 5,
        wetonDay: DAYS[(jdn + 1) % 7],
        wetonPasaran: PASARAN[((jdn + 1) % 5 + 5) % 5],
      });
    }

    const remaining = 42 - result.length;
    for (let d = 1; d <= remaining; d++) {
      const jdn = gregorianToJdn(nextYear, nextMonth, d);
      result.push({
        day: d,
        month: nextMonth,
        year: nextYear,
        isCurrentMonth: false,
        jdn,
        dayOfWeek: (jdn + 1) % 7,
        pasaranIndex: ((jdn + 1) % 5 + 5) % 5,
        wetonDay: DAYS[(jdn + 1) % 7],
        wetonPasaran: PASARAN[((jdn + 1) % 5 + 5) % 5],
      });
    }

    return result;
  }, [year, month]);

  const isToday = (d: DayInfo) =>
    calculated && d.year === today.year && d.month === today.month && d.day === today.day;

  const monthLabel = new Date(2000, month - 1, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-12">
      <PageTitle title="Weton Calendar" />
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <h1 className="cosmic-headline text-[34px] leading-[1.47] tracking-[-0.374px] mb-2">
        Weton Calendar
      </h1>
      <p className="text-[13px] text-[var(--color-ink-muted-48)] mb-6 text-center max-w-lg">
        View the Javanese weton (day + pasaran) for every day in any month.
      </p>

      <div className="w-full max-w-3xl cosmic-card px-6 py-5 mb-5">
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div>
            <label className="text-[10px] font-semibold uppercase text-[var(--color-ink-muted-48)]">Year</label>
            <input
              value={yearText}
              onChange={(e) => setYearText(e.target.value.replace(/[^0-9-]/g, ""))}
              onKeyDown={(e) => e.key === "Enter" && setCalculated((c) => !c)}
              placeholder="e.g. 2025"
              className="cosmic-input w-full h-9 text-[13px] mt-0.5"
            />
          </div>
          <div>
            <label className="text-[10px] font-semibold uppercase text-[var(--color-ink-muted-48)]">Month</label>
            <select value={month} onChange={(e) => setMonth(parseInt(e.target.value))} className="cosmic-input w-full h-9 text-[13px] mt-0.5">
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>{new Date(2000, m - 1, 1).toLocaleDateString("en-US", { month: "long" })}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setCalculated((c) => !c)}
            className="cosmic-btn-primary h-10 px-6 text-[13px]"
          >
            Calculate
          </button>
          <button
            onClick={() => {
              setYearText(String(now.getFullYear()));
              setMonth(now.getMonth() + 1);
              setCalculated(true);
            }}
            className="text-[11px] text-[var(--color-primary)] hover:underline"
          >
            Back to today
          </button>
        </div>
      </div>

      <div className="w-full max-w-3xl cosmic-card px-4 py-4 mb-5">
        <div className="text-[15px] font-semibold text-[var(--color-ink)] text-center mb-3">{monthLabel}</div>

        <div className="grid grid-cols-7 gap-px">
          {DAYS.map((d) => (
            <div key={d} className="text-center text-[10px] font-semibold uppercase text-[var(--color-ink-muted-48)] py-1">
              {d.slice(0, 3)}
            </div>
          ))}
          {days.map((d, idx) => {
            const isTodayFlag = isToday(d);
            return (
              <div
                key={idx}
                className={`relative min-h-[72px] rounded-[6px] p-1 text-center transition-colors ${
                  !d.isCurrentMonth
                    ? "opacity-30"
                    : isTodayFlag
                    ? "ring-2 ring-[var(--color-primary)] bg-[var(--color-primary)]/5"
                    : "hover:bg-[var(--color-surface-pearl)]"
                }`}
              >
                <div className={`text-[12px] font-semibold ${
                  isTodayFlag ? "text-[var(--color-primary)]" : "text-[var(--color-ink)]"
                }`}>
                  {d.day}
                </div>
                <div className={`mt-0.5 text-[9px] leading-tight font-medium rounded-[3px] px-0.5 ${PASARAN_COLORS[d.pasaranIndex]}`}>
                  {d.wetonDay.slice(0, 3)}
                  <br />
                  {d.wetonPasaran}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="w-full max-w-3xl cosmic-card px-6 py-5 mb-5">
        <h3 className="text-[12px] font-semibold uppercase text-[var(--color-ink-muted-48)] mb-3">
          All 35 Weton Combinations &#8212; Legend
        </h3>
        <div className="grid grid-cols-5 gap-1.5">
          {WETON_NAMES.map((name, i) => {
            const pasaranIdx = i % 5;
            return (
              <div
                key={name}
                className={`px-1 py-1.5 rounded-[8px] text-center text-[9px] font-medium ${PASARAN_COLORS[pasaranIdx]}`}
              >
                {name}
              </div>
            );
          })}
        </div>
      </div>

      <div className="w-full max-w-3xl cosmic-card px-6 py-5 mb-5">
        <h3 className="text-[12px] font-semibold uppercase text-[var(--color-ink-muted-48)] mb-3">
          The Significance of Weton in Javanese Culture
        </h3>
        <div className="space-y-3 text-[13px] leading-[1.7] text-[var(--color-ink)]">
          <p>
            In Javanese tradition, <em>weton</em> (a portmanteau of <em>waktu</em> meaning time and <em>wetonan</em> meaning birth) is the deeply meaningful intersection of the seven-day Gregorian week with the indigenous five-day <em>pasaran</em> cycle. Every day in the Javanese calendar is identified by both its weekday name and its pasaran name, creating a 35-day cycle called <em>selapanan</em>. A person's weton at birth is considered their spiritual signature, believed to shape their character, destiny, and compatibility with others. The calculation has been used for centuries to determine auspicious wedding dates, the timing of the <em>tedhak siten</em> (a child's first step to the earth ceremony), house-moving days, and even the best time to open a business.
          </p>
          <p>
            The five pasaran days &#8212; Legi, Pahing, Pon, Wage, and Kliwon &#8212; each carry distinct energies. Legi (sweet) is associated with harmony and gentle beginnings; Pahing (pain/bitter) carries intense, powerful energy suited for important undertakings; Pon (expert) favors skill, trade, and craftsmanship; Wage (wage/money) is connected to labor and practical matters; and Kliwon (kluwung/rainbow) is considered the most spiritually charged, a day when the veil between the seen and unseen worlds is thinnest. Each weton is associated with specific <em>neptu</em> (numerological values), and the sum of a person's neptu is used in divination to predict fortune, character tendencies, and matchmaking compatibility.
          </p>
          <p>
            The weton calendar remains deeply relevant in modern Javanese society, both in Indonesia and throughout the Javanese diaspora. Many families still consult a <em>primbon</em> (traditional Javanese almanac) before major life decisions. The system reflects the Javanese philosophical concept of <em>sangkan paraning dumadi</em> &#8212; the belief that understanding one's origin and destiny requires harmony between the cosmic cycles of nature and the individual soul. Far from being a mere superstition, the weton system is a sophisticated calendrical framework that encodes centuries of Javanese wisdom about time, human nature, and the relationship between the microcosm of the individual and the macrocosm of the universe.
          </p>
        </div>
      </div>

      <Disclaimer type="divination" />
    </div>
  );
}
