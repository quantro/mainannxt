"use client";

import { useMemo, useState } from "react";
import ThemeToggle from "../theme-toggle";

interface AnimalSign {
  animal: string;
  emoji: string;
  years: string;
  element: string;
  yinyang: string;
  traits: string[];
  strengths: string[];
  weaknesses: string[];
  compatibility: string[];
  description: string;
  luckyNumbers: string;
  luckyColors: string;
}

const ANIMALS: AnimalSign[] = [
  {
    animal: "Rat", emoji: "\uD83D\uDC39",
    years: "2020, 2008, 1996, 1984, 1972, 1960",
    element: "Water", yinyang: "Yang",
    traits: ["quick-witted", "resourceful", "versatile", "charming"],
    strengths: ["adaptable", "intelligent", "social", "ambitious"],
    weaknesses: ["opportunistic", "stingy", "restless", "manipulative"],
    compatibility: ["Dragon", "Monkey"],
    description: "The Rat is the first sign of the Chinese zodiac, earning its place through cleverness. Those born under this sign are quick-witted, resourceful, and highly adaptable. Rats are natural survivors who thrive in any environment, using their intelligence and charm to navigate life's challenges.",
    luckyNumbers: "2, 3", luckyColors: "Blue, Gold, Green"
  },
  {
    animal: "Ox", emoji: "\uD83D\uDC02",
    years: "2021, 2009, 1997, 1985, 1973, 1961",
    element: "Earth", yinyang: "Yin",
    traits: ["diligent", "dependable", "strong", "determined"],
    strengths: ["patient", "reliable", "disciplined", "honest"],
    weaknesses: ["stubborn", "rigid", "conservative", "judgmental"],
    compatibility: ["Snake", "Rooster"],
    description: "The Ox is a symbol of diligence, dependability, and strength. People born under this sign are patient, hardworking, and methodical. They may not be the fastest or flashiest, but their steady determination ensures they always cross the finish line. An Ox's word is their bond.",
    luckyNumbers: "1, 9", luckyColors: "Blue, Yellow, Green"
  },
  {
    animal: "Tiger", emoji: "\uD83D\uDC2F",
    years: "2022, 2010, 1998, 1986, 1974, 1962",
    element: "Wood", yinyang: "Yang",
    traits: ["brave", "confident", "competitive", "unpredictable"],
    strengths: ["charismatic", "passionate", "courageous", "generous"],
    weaknesses: ["impulsive", "rebellious", "hot-headed", "stubborn"],
    compatibility: ["Horse", "Dog"],
    description: "The Tiger is the king of the jungle in Chinese astrology \u2014 bold, competitive, and fearless. Tigers are natural leaders who command attention wherever they go. They thrive on challenge and adventure, and their magnetic personality draws people to them like moths to a flame.",
    luckyNumbers: "1, 3, 4", luckyColors: "Blue, Gray, Orange"
  },
  {
    animal: "Rabbit", emoji: "\uD83D\uDC07",
    years: "2023, 2011, 1999, 1987, 1975, 1963",
    element: "Wood", yinyang: "Yin",
    traits: ["quiet", "elegant", "kind", "responsible"],
    strengths: ["gentle", "diplomatic", "intuitive", "artistic"],
    weaknesses: ["overly cautious", "indecisive", "detached", "self-indulgent"],
    compatibility: ["Goat", "Pig"],
    description: "The Rabbit is the luckiest sign in the Chinese zodiac. Graceful, gentle, and elegant, Rabbits have a refined sensibility and a deep appreciation for beauty. They are skilled diplomats who prefer peace and harmony, avoiding conflict whenever possible. Their kindness is their greatest strength.",
    luckyNumbers: "3, 6, 9", luckyColors: "Red, Pink, Purple"
  },
  {
    animal: "Dragon", emoji: "\uD83D\uDC32",
    years: "2024, 2012, 2000, 1988, 1976, 1964",
    element: "Earth", yinyang: "Yang",
    traits: ["confident", "intelligent", "enthusiastic", "charismatic"],
    strengths: ["visionary", "courageous", "ambitious", "inspiring"],
    weaknesses: ["arrogant", "demanding", "impatient", "rigid"],
    compatibility: ["Rat", "Monkey"],
    description: "The Dragon is the most powerful and auspicious sign in the Chinese zodiac. Dragons are born leaders \u2014 confident, charismatic, and driven. They have a larger-than-life presence and the vision to achieve great things. In Chinese culture, Dragons are symbols of power, honor, and success.",
    luckyNumbers: "1, 6, 7", luckyColors: "Gold, Silver, Gray"
  },
  {
    animal: "Snake", emoji: "\uD83D\uDC0D",
    years: "2025, 2013, 2001, 1989, 1977, 1965",
    element: "Fire", yinyang: "Yin",
    traits: ["enigmatic", "intelligent", "wise", "intuitive"],
    strengths: ["philosophical", "elegant", "perceptive", "charming"],
    weaknesses: ["secretive", "possessive", "jealous", "materialistic"],
    compatibility: ["Ox", "Rooster"],
    description: "The Snake is the deepest thinker of the Chinese zodiac. Wise, intuitive, and mysterious, Snakes possess a natural elegance and a penetrating intellect. They are often called 'little dragons' in Chinese folklore, sharing many of the Dragon's gifts but preferring quiet contemplation over the spotlight.",
    luckyNumbers: "2, 8, 9", luckyColors: "Black, Red, Yellow"
  },
  {
    animal: "Horse", emoji: "\uD83D\uDC0E",
    years: "2026, 2014, 2002, 1990, 1978, 1966",
    element: "Fire", yinyang: "Yang",
    traits: ["energetic", "independent", "adventurous", "free-spirited"],
    strengths: ["passionate", "warm-hearted", "talented", "positive"],
    weaknesses: ["impatient", "impulsive", "stubborn", "blunt"],
    compatibility: ["Tiger", "Dog"],
    description: "The Horse represents freedom and adventure. Those born under this sign are energetic, independent, and always on the move. Horses have an infectious enthusiasm for life and a restless spirit that drives them to explore the world. They are the most freedom-loving sign of the zodiac.",
    luckyNumbers: "1, 3, 7", luckyColors: "Green, Red, Purple"
  },
  {
    animal: "Goat", emoji: "\uD83D\uDC10",
    years: "2027, 2015, 2003, 1991, 1979, 1967",
    element: "Earth", yinyang: "Yin",
    traits: ["calm", "gentle", "sympathetic", "creative"],
    strengths: ["artistic", "compassionate", "elegant", "intuitive"],
    weaknesses: ["indecisive", "pessimistic", "anxious", "overly dependent"],
    compatibility: ["Rabbit", "Pig"],
    description: "The Goat (or Sheep) is the artist of the Chinese zodiac. Gentle, kind, and deeply creative, Goats have a refined aesthetic sense and a peaceful nature. They prefer a calm, harmonious environment and thrive when surrounded by beauty and the people they love.",
    luckyNumbers: "2, 7", luckyColors: "Brown, Red, Purple"
  },
  {
    animal: "Monkey", emoji: "\uD83D\uDC35",
    years: "2028, 2016, 2004, 1992, 1980, 1968",
    element: "Metal", yinyang: "Yang",
    traits: ["sharp", "smart", "curious", "witty"],
    strengths: ["innovative", "versatile", "charming", "problem-solver"],
    weaknesses: ["mischievous", "arrogant", "deceitful", "restless"],
    compatibility: ["Rat", "Dragon"],
    description: "The Monkey is the genius of the Chinese zodiac. Quick-witted, inventive, and endlessly curious, Monkeys have a brilliant mind and a playful spirit. They are masters of adaptation who can talk their way into or out of any situation. Sun Wukong, the Monkey King, is their legendary archetype.",
    luckyNumbers: "4, 9", luckyColors: "Blue, Gold, White"
  },
  {
    animal: "Rooster", emoji: "\uD83D\uDC14",
    years: "2029, 2017, 2005, 1993, 1981, 1969",
    element: "Metal", yinyang: "Yin",
    traits: ["observant", "hardworking", "courageous", "punctual"],
    strengths: ["confident", "honest", "organized", "loyal"],
    weaknesses: ["critical", "perfectionist", "vain", "blunt"],
    compatibility: ["Ox", "Snake"],
    description: "The Rooster is the most punctual and precise sign of the Chinese zodiac. Hardworking, confident, and observant, Roosters have an eye for detail and a strong sense of responsibility. They are natural leaders in their field, always showing up on time and getting the job done right.",
    luckyNumbers: "5, 7, 8", luckyColors: "Gold, Red, Yellow"
  },
  {
    animal: "Dog", emoji: "\uD83D\uDC36",
    years: "2030, 2018, 2006, 1994, 1982, 1970",
    element: "Earth", yinyang: "Yang",
    traits: ["loyal", "honest", "dependable", "protective"],
    strengths: ["faithful", "courageous", "generous", "intelligent"],
    weaknesses: ["stubborn", "anxious", "critical", "pessimistic"],
    compatibility: ["Tiger", "Horse"],
    description: "The Dog is the most loyal sign in the Chinese zodiac. People born under this sign are honest, dependable, and always ready to stand up for what's right. Dogs have a strong sense of justice and will go to great lengths to protect the people they love. Their loyalty is legendary.",
    luckyNumbers: "3, 7", luckyColors: "Green, Red, Purple"
  },
  {
    animal: "Pig", emoji: "\uD83D\uDC3D",
    years: "2031, 2019, 2007, 1995, 1983, 1971",
    element: "Water", yinyang: "Yin",
    traits: ["compassionate", "generous", "diligent", "honest"],
    strengths: ["gentle", "reliable", "sincere", "brave"],
    weaknesses: ["naive", "materialistic", "indulgent", "easily taken advantage of"],
    compatibility: ["Rabbit", "Goat"],
    description: "The Pig is the most generous and compassionate sign of the Chinese zodiac. Warm-hearted, honest, and hardworking, Pigs approach life with an open heart and a genuine desire to make others happy. They enjoy the finer things in life and have a simple, authentic approach to relationships.",
    luckyNumbers: "2, 5, 8", luckyColors: "Yellow, Gray, Brown"
  }
];

const BASE_YEARS = [2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031];

function getAnimalByYear(year: number): AnimalSign | null {
  if (year < 1900 || year > 2100) return null;
  for (const base of BASE_YEARS) {
    const diff = (year - base) % 12;
    if (diff === 0) {
      const idx = BASE_YEARS.indexOf(base);
      return ANIMALS[idx] || null;
    }
  }
  // Fallback: calculate from known base
  const idx = ((year - 2020) % 12 + 12) % 12;
  return ANIMALS[idx] || null;
}

const ELEMENTS_CYCLE = ["Wood", "Wood", "Fire", "Fire", "Earth", "Earth", "Metal", "Metal", "Water", "Water"];

function getElementForYear(year: number): string {
  const idx = ((year - 2020) % 10 + 10) % 10;
  return ELEMENTS_CYCLE[idx];
}

export default function ChineseZodiacPage() {
  const [year, setYear] = useState("");
  const [name, setName] = useState("");

  const result = useMemo(() => {
    const y = parseInt(year);
    if (!y || y < 1900 || y > 2100) return null;
    const animal = getAnimalByYear(y);
    if (!animal) return null;
    const element = getElementForYear(y);
    return { animal, element, year: y };
  }, [year]);

  const nameResult = useMemo(() => {
    const n = name.trim().toLowerCase();
    if (!n) return null;
    const vowels = (n.match(/[aeiou]/g) || []).length;
    const consonants = n.replace(/[^a-z]/g, "").length - vowels;
    const idx = ((vowels * 7 + consonants * 3) % 12 + 12) % 12;
    return ANIMALS[idx];
  }, [name]);

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-12">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <h1 className="apple-headline text-[34px] leading-[1.47] tracking-[-0.374px] mb-8">
        Chinese Zodiac
      </h1>

      <div className="w-full max-w-2xl apple-card px-6 py-5 mb-5">
        <h2 className="text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-[var(--color-ink-muted-48)] mb-3 uppercase">
          Birth Year
        </h2>
        <input
          value={year}
          onChange={(e) => setYear(e.target.value.replace(/\D/g, "").slice(0, 4))}
          placeholder="Enter your birth year (e.g. 1990)"
          className="apple-input w-full h-10 text-[14px]"
        />
      </div>

      <div className="w-full max-w-2xl apple-card px-6 py-5 mb-5">
        <h2 className="text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-[var(--color-ink-muted-48)] mb-3 uppercase">
          Or Your Name
        </h2>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          className="apple-input w-full h-10 text-[14px]"
        />
        <p className="text-[11px] text-[var(--color-ink-muted-48)] mt-1.5">
          Based on the mystical numerology of vowel and consonant harmony.
        </p>
      </div>

      {result && (
        <div className="w-full max-w-2xl space-y-4">
          <div className="apple-card px-6 py-5 text-center">
            <div className="text-[48px] mb-1">{result.animal.emoji}</div>
            <div className="text-[28px] font-bold text-[var(--color-ink)]">
              {result.animal.animal}
            </div>
            <div className="text-[13px] text-[var(--color-ink-muted-48)] mt-1">
              Born in {result.year} &middot; Element: {result.element} &middot; {result.animal.yinyang}
            </div>
          </div>

          <div className="apple-card px-6 py-5">
            <p className="text-[14px] leading-[1.6] text-[var(--color-ink)]">
              {result.animal.description}
            </p>
          </div>

          <div className="apple-card px-6 py-5">
            <h3 className="text-[12px] font-semibold uppercase text-[var(--color-ink-muted-48)] mb-3">Traits</h3>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {result.animal.traits.map((t) => (
                <span key={t} className="px-2.5 py-1 rounded-[9999px] text-[12px] bg-[var(--color-surface-pearl)] text-[var(--color-ink)]">
                  {t}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <div className="text-[11px] uppercase text-[var(--color-ink-muted-48)] mb-1.5">Strengths</div>
                <div className="flex flex-wrap gap-1.5">
                  {result.animal.strengths.map((s) => (
                    <span key={s} className="px-2.5 py-1 rounded-[9999px] text-[12px] bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[11px] uppercase text-[var(--color-ink-muted-48)] mb-1.5">Weaknesses</div>
                <div className="flex flex-wrap gap-1.5">
                  {result.animal.weaknesses.map((w) => (
                    <span key={w} className="px-2.5 py-1 rounded-[9999px] text-[12px] bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
                      {w}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="apple-card px-6 py-5">
              <h3 className="text-[12px] font-semibold uppercase text-[var(--color-ink-muted-48)] mb-2">Best Matches</h3>
              <div className="flex flex-wrap gap-1.5">
                {result.animal.compatibility.map((c) => (
                  <span key={c} className="px-2.5 py-1 rounded-[9999px] text-[12px] bg-[var(--color-surface-pearl)] text-[var(--color-ink)]">
                    {c}
                  </span>
                ))}
              </div>
            </div>
            <div className="apple-card px-6 py-5">
              <h3 className="text-[12px] font-semibold uppercase text-[var(--color-ink-muted-48)] mb-2">Lucky Numbers</h3>
              <div className="text-[28px] font-bold text-[var(--color-ink)]">{result.animal.luckyNumbers}</div>
              <div className="text-[10px] uppercase text-[var(--color-ink-muted-48)] mt-1">Colors</div>
              <div className="text-[14px] text-[var(--color-ink)]">{result.animal.luckyColors}</div>
            </div>
          </div>

          <div className="apple-card px-6 py-5">
            <h3 className="text-[12px] font-semibold uppercase text-[var(--color-ink-muted-48)] mb-2">Also born in</h3>
            <p className="text-[13px] text-[var(--color-ink)]">{result.animal.years}</p>
          </div>
        </div>
      )}

      {nameResult && !result && (
        <div className="w-full max-w-2xl apple-card px-6 py-5">
          <div className="text-center mb-3">
            <div className="text-[48px] mb-1">{nameResult.emoji}</div>
            <div className="text-[28px] font-bold text-[var(--color-ink)]">{nameResult.animal}</div>
          </div>
          <p className="text-[13px] leading-[1.5] text-[var(--color-ink)]">
            Based on the mystical harmony of your name's vowels and consonants, your spirit animal is the {nameResult.animal}.
          </p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {nameResult.traits.map((t) => (
              <span key={t} className="px-2.5 py-1 rounded-[9999px] text-[12px] bg-[var(--color-surface-pearl)] text-[var(--color-ink)]">
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      {!result && !nameResult && (!year || !name.trim()) && (
        <div className="w-full max-w-2xl space-y-4">
          <div className="apple-card px-6 py-5">
            <h2 className="text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-[var(--color-ink-muted-48)] mb-3 uppercase">
              About Chinese Astrology
            </h2>
            <p className="text-[14px] leading-[1.6] text-[var(--color-ink)] mb-3">
              The Chinese zodiac (生肖, shēngxiào) is a 2,000-year-old system of astrology rooted in ancient Chinese cosmology and timekeeping. According to legend, the Jade Emperor invited all the animals of the kingdom to a great race, and the first twelve to cross the finish line were awarded a place in the zodiac calendar. The clever Rat hitched a ride on the powerful Ox and jumped off at the last second to claim first place, setting the order of the twelve animals for all time.
            </p>
            <p className="text-[14px] leading-[1.6] text-[var(--color-ink)] mb-3">
              Unlike Western astrology, which operates on a monthly cycle, the Chinese zodiac assigns an animal to each year in a repeating 12-year cycle. Your animal sign is determined by your birth year and is believed to shape your personality, destiny, and compatibility with others. Each animal has a fixed element (Wood, Fire, Earth, Metal, or Water) and a Yin or Yang polarity that further refines its expression. The full system also includes a 60-year grand cycle that combines the 12 animals with the 5 elements and 10 Heavenly Stems, creating 60 unique year signatures.
            </p>
            <p className="text-[14px] leading-[1.6] text-[var(--color-ink)] mb-3">
              The animals are grouped into four trines (compatibility clusters) based on shared traits. Rats, Dragons, and Monkeys form the first trine &mdash; driven, ambitious, and clever. Oxen, Snakes, and Roosters form the second &mdash; hardworking, methodical, and dependable. Tigers, Horses, and Dogs form the third &mdash; loyal, adventurous, and passionate. Rabbits, Goats, and Pigs form the fourth &mdash; gentle, creative, and nurturing. Animals within the same trine are considered natural allies.
            </p>
            <p className="text-[14px] leading-[1.6] text-[var(--color-ink)]">
              The tool also includes a name-based reading: using the mystical numerology of vowels and consonants in your name, it can determine your spirit animal &mdash; a fun alternative if you don't know your birth year or want to see which animal resonates with your name's energy.
            </p>
          </div>
          <div className="apple-card px-6 py-5">
            <p className="text-[14px] leading-[1.43] text-[var(--color-ink-muted-48)] text-center">
              Enter your birth year to discover your Chinese zodiac animal, element, lucky numbers, compatibility matches, and detailed personality traits. Or enter your name for a mystical spirit animal reading.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
