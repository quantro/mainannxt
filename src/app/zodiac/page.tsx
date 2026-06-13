"use client";

import { useMemo, useState } from "react";
import ThemeToggle from "../theme-toggle";

interface ZodiacSign {
  name: string;
  symbol: string;
  emoji: string;
  dateRange: string;
  element: string;
  quality: string;
  rulingPlanet: string;
  traits: string[];
  strengths: string[];
  weaknesses: string[];
  compatibility: string[];
  description: string;
}

const ZODIAC_SIGNS: ZodiacSign[] = [
  {
    name: "Aries", symbol: "\u2648", emoji: "\uD83D\uDC0F",
    dateRange: "Mar 21 \u2013 Apr 19", element: "Fire", quality: "Cardinal",
    rulingPlanet: "Mars",
    traits: ["assertive", "courageous", "impulsive", "confident", "passionate"],
    strengths: ["natural leader", "fearless", "optimistic", "energetic"],
    weaknesses: ["impatient", "short-tempered", "aggressive", "moody"],
    compatibility: ["Gemini", "Leo", "Sagittarius", "Aquarius"],
    description: "Aries is the first sign of the zodiac, and those born under this sign are known for their bold, competitive spirit. Ruled by Mars, the planet of war and energy, Aries individuals are natural pioneers who charge headfirst into every situation."
  },
  {
    name: "Taurus", symbol: "\u2649", emoji: "\uD83D\uDC02",
    dateRange: "Apr 20 \u2013 May 20", element: "Earth", quality: "Fixed",
    rulingPlanet: "Venus",
    traits: ["determined", "practical", "reliable", "stubborn", "sensual"],
    strengths: ["dependable", "patient", "devoted", "grounded"],
    weaknesses: ["possessive", "stubborn", "resistant to change", "materialistic"],
    compatibility: ["Cancer", "Virgo", "Capricorn", "Pisces"],
    description: "Taurus is an earth sign represented by the Bull. Like their celestial spirit animal, Taureans enjoy a relaxed pace and appreciate the finer things in life. Ruled by Venus, they have a deep appreciation for beauty, art, and sensual pleasures."
  },
  {
    name: "Gemini", symbol: "\u264A", emoji: "\uD83D\uDC65",
    dateRange: "May 21 \u2013 Jun 20", element: "Air", quality: "Mutable",
    rulingPlanet: "Mercury",
    traits: ["intellectual", "adaptable", "curious", "witty", "restless"],
    strengths: ["versatile", "communicative", "quick-witted", "charming"],
    weaknesses: ["indecisive", "inconsistent", "superficial", "anxious"],
    compatibility: ["Leo", "Libra", "Aquarius", "Aries"],
    description: "Gemini is represented by the Twins, reflecting their dual nature. Ruled by Mercury, the planet of communication, Geminis are masters of language, constantly seeking new information and experiences. Their adaptability is unmatched."
  },
  {
    name: "Cancer", symbol: "\u264B", emoji: "\uD83E\uDD88",
    dateRange: "Jun 21 \u2013 Jul 22", element: "Water", quality: "Cardinal",
    rulingPlanet: "The Moon",
    traits: ["sensitive", "intuitive", "nurturing", "emotional", "protective"],
    strengths: ["compassionate", "loyal", "imaginative", "tenacious"],
    weaknesses: ["moody", "clingy", "pessimistic", "manipulative"],
    compatibility: ["Virgo", "Scorpio", "Pisces", "Taurus"],
    description: "Cancer is a water sign ruled by the Moon, making Cancers deeply intuitive and emotional. Like the crab that represents them, Cancers have a hard exterior but are soft on the inside. Family and home are paramount to their happiness."
  },
  {
    name: "Leo", symbol: "\u264C", emoji: "\uD83E\uDD81",
    dateRange: "Jul 23 \u2013 Aug 22", element: "Fire", quality: "Fixed",
    rulingPlanet: "The Sun",
    traits: ["dramatic", "generous", "proud", "charismatic", "warm"],
    strengths: ["confident", "creative", "passionate", "entertaining"],
    weaknesses: ["arrogant", "stubborn", "self-centered", "lazy"],
    compatibility: ["Libra", "Sagittarius", "Gemini", "Aries"],
    description: "Leo is ruled by the Sun, and Leos shine like the celestial body that governs them. Bold, theatrical, and fiercely loyal, Leos are natural-born leaders who thrive in the spotlight. Their warmth and generosity draw people to them."
  },
  {
    name: "Virgo", symbol: "\u264D", emoji: "\uD83D\uDC69\u200D\uD83D\uDCBB",
    dateRange: "Aug 23 \u2013 Sep 22", element: "Earth", quality: "Mutable",
    rulingPlanet: "Mercury",
    traits: ["analytical", "detail-oriented", "modest", "practical", "perfectionist"],
    strengths: ["meticulous", "reliable", "intelligent", "helpful"],
    weaknesses: ["critical", "overthinking", "picky", "shy"],
    compatibility: ["Scorpio", "Capricorn", "Taurus", "Cancer"],
    description: "Virgo is an earth sign historically associated with wheat and grain, representing agriculture and abundance. Ruled by Mercury, Virgos have sharp minds and a meticulous nature. They are the perfectionists of the zodiac, always striving to improve."
  },
  {
    name: "Libra", symbol: "\u264E", emoji: "\u2696\uFE0F",
    dateRange: "Sep 23 \u2013 Oct 22", element: "Air", quality: "Cardinal",
    rulingPlanet: "Venus",
    traits: ["diplomatic", "charming", "social", "idealistic", "fair"],
    strengths: ["balanced", "gracious", "cooperative", "peaceful"],
    weaknesses: ["indecisive", "avoidant", "people-pleaser", "self-pitying"],
    compatibility: ["Sagittarius", "Aquarius", "Gemini", "Leo"],
    description: "Libra is represented by the Scales, symbolizing balance and harmony. Ruled by Venus, Libras have an innate sense of beauty, justice, and fairness. They are the diplomats of the zodiac, always seeking to create equilibrium in all areas of life."
  },
  {
    name: "Scorpio", symbol: "\u264F", emoji: "\uD83E\uDD82",
    dateRange: "Oct 23 \u2013 Nov 21", element: "Water", quality: "Fixed",
    rulingPlanet: "Pluto",
    traits: ["passionate", "resourceful", "determined", "mysterious", "intense"],
    strengths: ["brave", "loyal", "perceptive", "focused"],
    weaknesses: ["jealous", "secretive", "vengeful", "possessive"],
    compatibility: ["Capricorn", "Pisces", "Cancer", "Virgo"],
    description: "Scorpio is one of the most misunderstood signs of the zodiac. Ruled by Pluto, the planet of transformation, Scorpios are intense, passionate, and unafraid to delve into life's mysteries. Their emotional depth knows no bounds."
  },
  {
    name: "Sagittarius", symbol: "\u2650", emoji: "\uD83C\uDFF9",
    dateRange: "Nov 22 \u2013 Dec 21", element: "Fire", quality: "Mutable",
    rulingPlanet: "Jupiter",
    traits: ["adventurous", "optimistic", "honest", "restless", "philosophical"],
    strengths: ["generous", "fun-loving", "independent", "intellectual"],
    weaknesses: ["tactless", "impatient", "irresponsible", "flighty"],
    compatibility: ["Aquarius", "Aries", "Leo", "Libra"],
    description: "Sagittarius, represented by the Archer, is always aiming for new horizons. Ruled by Jupiter, the planet of expansion and luck, Sagittarians are optimistic, freedom-loving, and constantly seeking truth and meaning through travel and philosophy."
  },
  {
    name: "Capricorn", symbol: "\u2651", emoji: "\uD83D\uDC10",
    dateRange: "Dec 22 \u2013 Jan 19", element: "Earth", quality: "Cardinal",
    rulingPlanet: "Saturn",
    traits: ["ambitious", "disciplined", "patient", "responsible", "practical"],
    strengths: ["reliable", "determined", "organized", "wise"],
    weaknesses: ["pessimistic", "rigid", "cold", "workaholic"],
    compatibility: ["Pisces", "Taurus", "Virgo", "Scorpio"],
    description: "Capricorn is represented by the Sea-Goat, a mythological creature that embodies ambition and resilience. Ruled by Saturn, the planet of discipline and structure, Capricorns are the CEOs of the zodiac \u2014 practical, responsible, and tirelessly determined."
  },
  {
    name: "Aquarius", symbol: "\u2652", emoji: "\uD83C\uDF0A",
    dateRange: "Jan 20 \u2013 Feb 18", element: "Air", quality: "Fixed",
    rulingPlanet: "Uranus",
    traits: ["innovative", "independent", "humanitarian", "eccentric", "intellectual"],
    strengths: ["progressive", "original", "loyal", "visionary"],
    weaknesses: ["detached", "unpredictable", "rebellious", "stubborn"],
    compatibility: ["Aries", "Gemini", "Libra", "Sagittarius"],
    description: "Aquarius is the water-bearer of the zodiac, pouring out knowledge and wisdom. Ruled by Uranus, the planet of innovation and change, Aquarians are visionaries who think outside the box. They are deeply humanitarian and value freedom above all."
  },
  {
    name: "Pisces", symbol: "\u2653", emoji: "\uD83D\uDC1F",
    dateRange: "Feb 19 \u2013 Mar 20", element: "Water", quality: "Mutable",
    rulingPlanet: "Neptune",
    traits: ["empathic", "artistic", "intuitive", "dreamy", "selfless"],
    strengths: ["compassionate", "creative", "adaptable", "spiritual"],
    weaknesses: ["escapist", "overly trusting", "victim mentality", "vague"],
    compatibility: ["Taurus", "Cancer", "Scorpio", "Capricorn"],
    description: "Pisces, represented by two Fish swimming in opposite directions, symbolizes the constant division of attention between fantasy and reality. Ruled by Neptune, the planet of dreams and illusions, Pisceans are the most intuitive, artistic, and empathic of the zodiac."
  }
];

function getZodiac(month: number, day: number): ZodiacSign | null {
  const idx = ZODIAC_SIGNS.findIndex((z) => {
    const parts = z.dateRange.split(" \u2013 ");
    if (parts.length !== 2) return false;
    const startParts = parts[0].split(" ");
    const endParts = parts[1].split(" ");
    const startMonth = monthNum(startParts[0]);
    const startDay = parseInt(startParts[1]);
    const endMonth = monthNum(endParts[0]);
    const endDay = parseInt(endParts[1]);
    if (startMonth === endMonth) {
      return month === startMonth && day >= startDay && day <= endDay;
    }
    return (
      (month === startMonth && day >= startDay) ||
      (month === endMonth && day <= endDay) ||
      (month > startMonth && month < endMonth)
    );
  });
  return idx !== -1 ? ZODIAC_SIGNS[idx] : null;
}

function monthNum(name: string): number {
  const months: Record<string, number> = {
    Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
    Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12
  };
  return months[name] || 0;
}

function formatBirthday(year: number, month: number, day: number): string {
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

export default function ZodiacPage() {
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [year, setYear] = useState("");

  const result = useMemo(() => {
    const m = parseInt(month);
    const d = parseInt(day);
    const y = parseInt(year);
    if (!m || !d || !y || m < 1 || m > 12 || d < 1 || d > 31) return null;
    const sign = getZodiac(m, d);
    return sign ? { sign, birthday: formatBirthday(y, m, d) } : null;
  }, [month, day, year]);

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-12">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <h1 className="apple-headline text-[34px] leading-[1.47] tracking-[-0.374px] mb-8">
        Star Sign Reader
      </h1>

      <div className="w-full max-w-2xl apple-card px-6 py-5 mb-5">
        <h2 className="text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-[var(--color-ink-muted-48)] mb-3 uppercase">
          Birth Date
        </h2>
        <div className="grid grid-cols-3 gap-2">
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="apple-input w-full h-10 text-[14px]"
          >
            <option value="">Month</option>
            {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m, i) => (
              <option key={m} value={i + 1}>{m}</option>
            ))}
          </select>
          <select
            value={day}
            onChange={(e) => setDay(e.target.value)}
            className="apple-input w-full h-10 text-[14px]"
          >
            <option value="">Day</option>
            {Array.from({ length: 31 }, (_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1}</option>
            ))}
          </select>
          <input
            value={year}
            onChange={(e) => setYear(e.target.value.replace(/\D/g, "").slice(0, 4))}
            placeholder="Year"
            className="apple-input w-full h-10 text-[14px]"
          />
        </div>
      </div>

      {result && (
        <div className="w-full max-w-2xl space-y-4">
          <div className="apple-card px-6 py-5 text-center">
            <div className="text-[48px] mb-2">{result.sign.emoji}</div>
            <div className="text-[28px] font-bold text-[var(--color-ink)]">
              {result.sign.symbol} {result.sign.name}
            </div>
            <div className="text-[13px] text-[var(--color-ink-muted-48)] mt-1">
              {result.sign.dateRange}
            </div>
            <div className="text-[12px] text-[var(--color-ink-muted-48)] mt-0.5">
              {result.birthday}
            </div>
          </div>

          <div className="apple-card px-6 py-5">
            <p className="text-[14px] leading-[1.5] text-[var(--color-ink)]">
              {result.sign.description}
            </p>
          </div>

          <div className="apple-card px-6 py-5">
            <h3 className="text-[12px] font-semibold uppercase text-[var(--color-ink-muted-48)] mb-3">Details</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Element", value: result.sign.element },
                { label: "Quality", value: result.sign.quality },
                { label: "Ruling Planet", value: result.sign.rulingPlanet },
                { label: "Symbol", value: `${result.sign.symbol} ${result.sign.name}` },
              ].map((d) => (
                <div key={d.label} className="px-3 py-2 rounded-[11px] bg-[var(--color-surface-pearl)]">
                  <div className="text-[10px] uppercase text-[var(--color-ink-muted-48)] tracking-wider">{d.label}</div>
                  <div className="text-[15px] font-semibold text-[var(--color-ink)] mt-0.5">{d.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="apple-card px-6 py-5">
            <h3 className="text-[12px] font-semibold uppercase text-[var(--color-ink-muted-48)] mb-3">Personality</h3>
            <div className="space-y-3">
              <div>
                <div className="text-[11px] uppercase text-[var(--color-ink-muted-48)] mb-1.5">Traits</div>
                <div className="flex flex-wrap gap-1.5">
                  {result.sign.traits.map((t) => (
                    <span key={t} className="px-2.5 py-1 rounded-[9999px] text-[12px] bg-[var(--color-surface-pearl)] text-[var(--color-ink)]">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[11px] uppercase text-[var(--color-ink-muted-48)] mb-1.5">Strengths</div>
                <div className="flex flex-wrap gap-1.5">
                  {result.sign.strengths.map((s) => (
                    <span key={s} className="px-2.5 py-1 rounded-[9999px] text-[12px] bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[11px] uppercase text-[var(--color-ink-muted-48)] mb-1.5">Weaknesses</div>
                <div className="flex flex-wrap gap-1.5">
                  {result.sign.weaknesses.map((w) => (
                    <span key={w} className="px-2.5 py-1 rounded-[9999px] text-[12px] bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
                      {w}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[11px] uppercase text-[var(--color-ink-muted-48)] mb-1.5">Compatible With</div>
                <div className="flex flex-wrap gap-1.5">
                  {result.sign.compatibility.map((c) => (
                    <span key={c} className="px-2.5 py-1 rounded-[9999px] text-[12px] bg-[var(--color-surface-pearl)] text-[var(--color-ink)]">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!result && (!month || !day || !year) && (
        <div className="w-full max-w-2xl space-y-4">
          <div className="apple-card px-6 py-5">
            <h2 className="text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-[var(--color-ink-muted-48)] mb-3 uppercase">
              About Western Astrology
            </h2>
            <p className="text-[14px] leading-[1.6] text-[var(--color-ink)] mb-3">
              Western astrology is one of the oldest divination systems in the world, with roots tracing back to Babylonian civilization around the 2nd millennium BCE. It was later refined by the Greeks and Romans, and formalized by Ptolemy in his seminal work, the <em>Tetrabiblos</em>. The fundamental premise is that the positions of the Sun, Moon, and planets at the moment of your birth influence your personality, strengths, challenges, and life path.
            </p>
            <p className="text-[14px] leading-[1.6] text-[var(--color-ink)] mb-3">
              The zodiac is divided into twelve signs, each corresponding to a 30-degree segment of the ecliptic &mdash; the apparent path of the Sun across the sky. Your &ldquo;Sun sign&rdquo; (the sign the Sun was in when you were born) is the most well-known aspect of your astrological profile. It represents your core identity, ego, and fundamental personality. But each sign also carries the influence of its ruling planet, its elemental group (Fire, Earth, Air, or Water), and its modality (Cardinal, Fixed, or Mutable), creating a rich tapestry of meaning.
            </p>
            <p className="text-[14px] leading-[1.6] text-[var(--color-ink)]">
              Beyond the Sun sign, a full natal chart maps the position of every planet at your exact moment of birth, revealing your Moon sign (emotions), Rising sign (outer personality), and the planetary placements that shape every facet of your character. This tool provides your core Sun sign reading &mdash; a window into the celestial blueprint you were born with.
            </p>
          </div>
          <div className="apple-card px-6 py-5">
            <p className="text-[14px] leading-[1.43] text-[var(--color-ink-muted-48)] text-center">
              Select your birth date above to reveal your star sign, its element, ruling planet, personality traits, strengths, weaknesses, and who you're most compatible with.
            </p>
          </div>
        </div>
      )}

      {!result && month && day && year && (
        <div className="w-full max-w-2xl apple-card px-6 py-5">
          <p className="text-[14px] leading-[1.43] text-red-500 text-center">
            Invalid date. Please check your inputs.
          </p>
        </div>
      )}
    </div>
  );
}
