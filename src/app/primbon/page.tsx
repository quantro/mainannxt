"use client";

import { useMemo, useState } from "react";
import ThemeToggle from "../theme-toggle";
import { Disclaimer } from "../disclaimer";
import { PageTitle } from "../page-title";

const DAYS: Record<string, { en: string; jv: string; neptu: number }> = {
  "0": { en: "Sunday", jv: "Minggu/Ahad", neptu: 5 },
  "1": { en: "Monday", jv: "Senen/Senin", neptu: 4 },
  "2": { en: "Tuesday", jv: "Selasa", neptu: 3 },
  "3": { en: "Wednesday", jv: "Rebo", neptu: 7 },
  "4": { en: "Thursday", jv: "Kemis", neptu: 8 },
  "5": { en: "Friday", jv: "Jum'ah/Jumat", neptu: 6 },
  "6": { en: "Saturday", jv: "Setu/Sabtu", neptu: 9 },
};

const PASARAN: Record<string, { name: string; neptu: number }> = {
  "0": { name: "Legi/Manis", neptu: 5 },
  "1": { name: "Pahing/Pahit", neptu: 9 },
  "2": { name: "Pon", neptu: 7 },
  "3": { name: "Wage/Cemeng", neptu: 4 },
  "4": { name: "Kliwon/Asih", neptu: 8 },
};

function getWeton(dayIdx: number, pasaranIdx: number) {
  const day = DAYS[String(dayIdx)];
  const pasaran = PASARAN[String(pasaranIdx)];
  if (!day || !pasaran) return null;
  return { day, pasaran, neptu: day.neptu + pasaran.neptu };
}

const PANCASUDA: Record<number, { name: string; meaning: string }> = {
  1: { name: "Sumur Sinaba", meaning: "The Sought Well — people will always come to you for wisdom and guidance. You are a natural teacher and counselor." },
  2: { name: "Satriya Wirang", meaning: "The Knight in Distress — you may face public shame or difficulty, but overcoming these trials builds your character and resilience." },
  3: { name: "Sumur Sinaba", meaning: "The Sought Well — your wisdom is like a well that never runs dry. Others seek your counsel and find clarity in your presence." },
  4: { name: "Wasesa Segara", meaning: "Ocean Authority — vast in spirit, forgiving, slow to anger but impossible to contain. Your influence is as wide as the sea." },
  5: { name: "Satriya Wirang", meaning: "The Knight in Distress — challenges and public trials are part of your path, but they forge an unbreakable spirit." },
  6: { name: "Bumi Kapetak", meaning: "The Buried Earth — your wisdom is hidden beneath the surface. You are humble but possess deep knowledge and stability." },
  7: { name: "Lebu Katiup Angin", meaning: "Dust Blown by the Wind — you are a wanderer, easily moved and adaptable. Your path is one of constant change and discovery." },
  8: { name: "Wasesa Segara", meaning: "Ocean Authority — your presence commands the same respect as the ocean. You are deep, powerful, and capable of great calm or great storm." },
  9: { name: "Pandita Api", meaning: "The Fire Priest — you burn with spiritual intensity. Your passion and wisdom can illuminate or consume; balance is your path." },
  10: { name: "Bumi Kapetak", meaning: "The Buried Earth — beneath your modest exterior lies great strength and wisdom. You are the quiet foundation upon which others build." },
  11: { name: "Lebu Katiup Angin", meaning: "Dust Blown by the Wind — your spirit is restless and free. You are not meant to stay in one place; your journey is your purpose." },
  12: { name: "Pandita Api", meaning: "The Fire Priest — you carry the fire of transformation. Your presence ignites change in others. Use your flame wisely." },
  13: { name: "Satriya Wirang", meaning: "The Knight in Distress — your path includes hardship and public trials, but each challenge is a lesson that strengthens your spirit." },
  14: { name: "Sumur Sinaba", meaning: "The Sought Well — your wisdom flows abundantly. People are drawn to you for counsel, comfort, and clarity." },
  15: { name: "Wasesa Segara", meaning: "Ocean Authority — you possess the depth and majesty of the sea. Your influence is vast, your spirit uncontainable." },
  16: { name: "Bumi Kapetak", meaning: "The Buried Earth — your strength is hidden but immense. Like the earth, you hold firm and provide stability for all who stand on you." },
  17: { name: "Lebu Katiup Angin", meaning: "Dust Blown by the Wind — you are free-spirited and ever-changing. Your adaptability is your superpower, but grounding is your life lesson." },
  18: { name: "Pandita Api", meaning: "The Fire Priest — your spiritual fire burns bright. You are called to transform darkness into light, but must Tend your flame with care." },
};

const WATON_CHARACTER: Record<number, { archetype: string; character: string; strength: string; weakness: string; advice: string }> = {
  7: { archetype: "Lakuning Srengenge (Walk of the Sun)", character: "You radiate warmth and authority. People naturally look up to you for direction. You are confident, proud, and have an inner light that draws others to you.", strength: "Natural leadership, generosity, radiant charisma", weakness: "Pride, need for admiration, stubbornness", advice: "The sun does not need to prove it is the sun. Your light is enough. Lead with humility and your radiance will only grow stronger." },
  8: { archetype: "Lakuning Bulan (Walk of the Moon)", character: "You are a light in others' darkness. Gentle, intuitive, and deeply emotional, you move through life with quiet grace. Your beauty is not loud, but enduring.", strength: "Intuition, emotional depth, nurturing presence", weakness: "Moodiness, sensitivity to criticism, tendency to withdraw", advice: "Like the moon, you have phases. Honor your cycles and trust that even in darkness, you are still whole." },
  9: { archetype: "Lakuning Lintang (Walk of the Stars)", character: "You shine brightest in the dark. Independent and visionary, you see possibilities others miss. Your path is unique, guided by an inner compass that few can follow.", strength: "Vision, creativity, independence, originality", weakness: "Detachment, aloofness, difficulty with intimacy", advice: "Your star burns brightly, but even stars are part of constellations. Let others share your sky." },
  10: { archetype: "Lakuning Bumi (Walk of the Earth)", character: "You are the foundation upon which others build. Grounded, patient, and generous, you bear all burdens without complaint. Your strength is quiet but absolute.", strength: "Stability, reliability, generosity, patience", weakness: "Stubbornness, resistance to change, self-neglect", advice: "Even the earth rests. Your stability is a gift, but do not let it become a cage. Allow yourself to be nurtured too." },
  11: { archetype: "Lakuning Geni (Walk of Fire)", character: "You are a force of transformation. Passionate and intense, you burn through obstacles and ignite change wherever you go. Your fire can warm or consume.", strength: "Passion, courage, transformative power, determination", weakness: "Impulsiveness, destructiveness, impatience", advice: "Fire is a servant or a master. Channel your intensity with wisdom, and let your flames illuminate rather than destroy." },
  12: { archetype: "Lakuning Angin (Walk of the Wind)", character: "You are free, untouchable, and ever-changing. Your thoughts move faster than most, and your spirit cannot be contained by convention.", strength: "Adaptability, intellect, freedom, communication", weakness: "Restlessness, inconsistency, emotional detachment", advice: "The wind moves the world, but it also knows when to settle. Find your anchor without losing your wings." },
  13: { archetype: "Lakuning Srengenge (Walk of the Sun)", character: "Like the sun at dawn, you bring new light and new hope. Your presence warms those around you, and your optimism is infectious.", strength: "Leadership, optimism, warmth, courage", weakness: "Overconfidence, impatience, domineering", advice: "True leadership is not about being above others, but about lifting them to stand beside you in the light." },
  14: { archetype: "Lakuning Bulan (Walk of the Moon)", character: "You possess the quiet power of the full moon. Your intuition is strong, and you see what others hide in the shadows of their hearts.", strength: "Deep intuition, empathy, mystery, loyalty", weakness: "Secretiveness, jealousy, emotional intensity", advice: "Your depth is your gift, but not everyone can swim in your waters. Be selective with whom you share your depths." },
  15: { archetype: "Lakuning Lintang (Walk of the Stars)", character: "You are a rare soul, guided by destiny. Your path was written in the stars, and you feel a pull toward something greater than yourself.", strength: "Vision, idealism, spirituality, uniqueness", weakness: "Elitism, impracticality, isolation", advice: "The stars guide, but they do not walk the path for you. Ground your visions in action." },
  16: { archetype: "Lakuning Bumi (Walk of the Earth)", character: "You are the mountain that cannot be moved. Steadfast, patient, and deeply wise, you have weathered storms that would break others.", strength: "Unshakeable stability, wisdom, endurance, humility", weakness: "Rigidity, stubbornness, resistance to growth", advice: "The mountain stands firm, but even it is shaped by wind and rain over time. Allow yourself to be shaped without being broken." },
  17: { archetype: "Lakuning Geni (Walk of Fire)", character: "You carry a spark that can start a revolution. Your passion is contagious, and your courage inspires others to rise.", strength: "Inspiration, passion, bravery, dynamism", weakness: "Volatility, burnout, conflict-seeking", advice: "A spark can start a fire, but a fire needs fuel and space. Choose your battles wisely, and tend your energy with care." },
  18: { archetype: "Lakuning Angin (Walk of the Wind)", character: "You are everywhere and nowhere, touching all things but held by none. Your mind is a whirlwind of ideas and possibilities.", strength: "Versatility, intellect, curiosity, adaptability", weakness: "Flightiness, superficiality, commitment issues", advice: "The wind carries seeds across the world, but roots grow in stillness. Find the balance between exploration and depth." },
};

function getPancasuda(neptu: number): string {
  const idx = neptu % 18;
  const p = PANCASUDA[idx];
  return p ? `${p.name}: ${p.meaning}` : PANCASUDA[1].meaning;
}

function getCharacter(neptu: number) {
  const chars = Object.entries(WATON_CHARACTER).map(([k, v]) => [parseInt(k), v] as const);
  let closest = chars[0][1];
  let minDiff = Infinity;
  for (const [key, val] of chars) {
    const diff = Math.abs(neptu - key);
    if (diff < minDiff) { minDiff = diff; closest = val; }
  }
  return closest;
}

const LOVE_MATCHES = [
  { total: "1, 13, 25, 37", result: "Jodoh", meaning: "Excellent match. This union is naturally harmonious and blessed. You are destined to be together." },
  { total: "2, 14, 26, 38", result: "Topo", meaning: "A challenging start requiring patience and sacrifice. Like a couple building a life from nothing, the early years will test you, but perseverance brings lasting reward." },
  { total: "3, 15, 27, 39", result: "Tinari", meaning: "A blessed match that will find happiness and fortune. Financial and emotional abundance flow to this union." },
  { total: "4, 16, 28, 40", result: "Padu", meaning: "A fiery match prone to arguments and conflict. Your passion is intense, but you must learn to fight constructively or the flames will consume you." },
  { total: "5, 17, 29, 41", result: "Pegat", meaning: "A fragile match at risk of separation. Significant differences may pull you apart. Extraordinary effort and compromise are needed." },
  { total: "6, 18, 30, 42", result: "Ratu", meaning: "The highest compatibility. You are like queen and king — a partnership of mutual respect, admiration, and enduring love. The envy of all who see you." },
  { total: "7, 19, 31, 43", result: "Jodoh", meaning: "Excellent match. Your souls recognize each other across lifetimes. This is a relationship blessed by the ancestors." },
  { total: "8, 20, 32, 44", result: "Pesthi", meaning: "A fated union. Your paths were meant to cross, and your bond will grow stronger through every challenge. Destiny has written your story." },
  { total: "9, 21, 33, 45", result: "Pegat", meaning: "A relationship that may not last. Fundamental incompatibilities create a fragile bond that requires tremendous effort to sustain." },
  { total: "10, 22, 34, 46", result: "Topo", meaning: "A patient, enduring match. Like a tree growing from rocky soil, your love will deepen as you overcome obstacles together." },
  { total: "11, 23, 35, 47", result: "Tinari", meaning: "A fortunate union blessed with happiness and prosperity. Your combined energy attracts abundance in all forms." },
  { total: "12, 24, 36, 48", result: "Padu", meaning: "A passionate but volatile match. Your love burns hot, but so do your arguments. Learn to channel your fire into shared purpose rather than conflict." },
];

function getLoveMatch(neptuA: number, neptuB: number) {
  const total = neptuA + neptuB;
  for (const match of LOVE_MATCHES) {
    const parts = match.total.split(", ").map(Number);
    if (parts.includes(total)) return match;
  }
  return LOVE_MATCHES[0];
}

export default function PrimbonPage() {
  const [dayIdx, setDayIdx] = useState("");
  const [pasaranIdx, setPasaranIdx] = useState("");
  const [dayIdxB, setDayIdxB] = useState("");
  const [pasaranIdxB, setPasaranIdxB] = useState("");

  const weton = useMemo(() => {
    if (dayIdx === "" || pasaranIdx === "") return null;
    return getWeton(parseInt(dayIdx), parseInt(pasaranIdx));
  }, [dayIdx, pasaranIdx]);

  const character = useMemo(() => {
    if (!weton) return null;
    return getCharacter(weton.neptu);
  }, [weton]);

  const pancasuda = useMemo(() => {
    if (!weton) return null;
    return getPancasuda(weton.neptu);
  }, [weton]);

  const loveMatch = useMemo(() => {
    if (dayIdx === "" || pasaranIdx === "" || dayIdxB === "" || pasaranIdxB === "") return null;
    const a = getWeton(parseInt(dayIdx), parseInt(pasaranIdx));
    const b = getWeton(parseInt(dayIdxB), parseInt(pasaranIdxB));
    if (!a || !b) return null;
    return { a, b, match: getLoveMatch(a.neptu, b.neptu) };
  }, [dayIdx, pasaranIdx, dayIdxB, pasaranIdxB]);

  const WEEKDAYS = Object.entries(DAYS).map(([k, v]) => ({ id: parseInt(k), ...v }));
  const PASARAN_LIST = Object.entries(PASARAN).map(([k, v]) => ({ id: parseInt(k), ...v }));

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-12">
      <PageTitle title="Primbon Jawa" />
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <h1 className="cosmic-headline text-[34px] leading-[1.47] tracking-[-0.374px] mb-2">
        Primbon Jawa
      </h1>
      <p className="text-[13px] text-[var(--color-ink-muted-48)] mb-8 text-center max-w-lg">
        The ancient Javanese art of divination through weton &mdash; the sacred combination of your birth day and pasaran cycle.
      </p>

      <div className="w-full max-w-2xl cosmic-card px-6 py-5 mb-5">
        <h2 className="text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-[var(--color-ink-muted-48)] mb-3 uppercase">
          Weton Anda (Your Weton)
        </h2>
        <div className="grid grid-cols-2 gap-2">
          <select value={dayIdx} onChange={(e) => setDayIdx(e.target.value)} className="cosmic-input w-full h-10 text-[14px]">
            <option value="">Hari (Day)</option>
            {WEEKDAYS.map((d) => (
              <option key={d.id} value={d.id}>{d.en} ({d.jv})</option>
            ))}
          </select>
          <select value={pasaranIdx} onChange={(e) => setPasaranIdx(e.target.value)} className="cosmic-input w-full h-10 text-[14px]">
            <option value="">Pasaran</option>
            {PASARAN_LIST.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="w-full max-w-2xl cosmic-card px-6 py-5 mb-5">
        <h2 className="text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-[var(--color-ink-muted-48)] mb-3 uppercase">
          Kecocokan Cinta (Love Compatibility)
        </h2>
        <p className="text-[11px] text-[var(--color-ink-muted-48)] mb-2">Masukkan weton pasangan untuk melihat kecocokan: (Enter your partner's weton to see your match:)</p>
        <div className="grid grid-cols-2 gap-2">
          <select value={dayIdxB} onChange={(e) => setDayIdxB(e.target.value)} className="cosmic-input w-full h-10 text-[14px]">
            <option value="">Hari (Day)</option>
            {WEEKDAYS.map((d) => (
              <option key={d.id} value={d.id}>{d.en}</option>
            ))}
          </select>
          <select value={pasaranIdxB} onChange={(e) => setPasaranIdxB(e.target.value)} className="cosmic-input w-full h-10 text-[14px]">
            <option value="">Pasaran</option>
            {PASARAN_LIST.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {weton && character && (
        <div className="w-full max-w-2xl space-y-4">
          <div className="cosmic-card px-6 py-5 text-center">
            <div className="text-[36px] mb-1">☀️</div>
            <div className="text-[22px] font-bold text-[var(--color-ink)]">{weton.day.en} {weton.pasaran.name}</div>
            <div className="text-[15px] text-[var(--color-ink-muted-48)]">Neptu: {weton.neptu}</div>
          </div>

          <div className="cosmic-card px-6 py-5">
            <h3 className="text-[12px] font-semibold uppercase text-[var(--color-ink-muted-48)] mb-3">Arketipe Anda (Your Archetype)</h3>
            <div className="text-[17px] font-semibold text-[var(--color-ink)] mb-2">{character.archetype}</div>
            <p className="text-[14px] leading-[1.7] text-[var(--color-ink)]">{character.character}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="cosmic-card px-6 py-5">
              <h3 className="text-[12px] font-semibold uppercase text-[var(--color-ink-muted-48)] mb-2">Kekuatan (Strength)</h3>
              <p className="text-[14px] text-[var(--color-ink)]">{character.strength}</p>
            </div>
            <div className="cosmic-card px-6 py-5">
              <h3 className="text-[12px] font-semibold uppercase text-[var(--color-ink-muted-48)] mb-2">Kelemahan (Weakness)</h3>
              <p className="text-[14px] text-[var(--color-ink)]">{character.weakness}</p>
            </div>
          </div>

          <div className="cosmic-card px-6 py-5">
            <h3 className="text-[12px] font-semibold uppercase text-[var(--color-ink-muted-48)] mb-3">Kebijaksanaan (Wisdom)</h3>
            <p className="text-[14px] leading-[1.7] italic text-[var(--color-ink)]">&ldquo;{character.advice}&rdquo;</p>
          </div>

          <div className="cosmic-card px-6 py-5">
            <h3 className="text-[12px] font-semibold uppercase text-[var(--color-ink-muted-48)] mb-3">Pancasuda Anda (Your Pancasuda)</h3>
            <p className="text-[14px] leading-[1.7] text-[var(--color-ink)]">{pancasuda}</p>
          </div>

          <div className="cosmic-card px-6 py-5">
            <h3 className="text-[12px] font-semibold uppercase text-[var(--color-ink-muted-48)] mb-3">Referensi Neptu (Neptu Reference)</h3>
            <div className="grid grid-cols-2 gap-2 text-[13px]">
              <div className="px-3 py-2 rounded-[11px] bg-[var(--color-surface-pearl)]">
                <span className="text-[var(--color-ink-muted-48)]">{weton.day.en}</span>
                <span className="float-right font-semibold text-[var(--color-ink)]">{weton.day.neptu}</span>
              </div>
              <div className="px-3 py-2 rounded-[11px] bg-[var(--color-surface-pearl)]">
                <span className="text-[var(--color-ink-muted-48)]">{weton.pasaran.name}</span>
                <span className="float-right font-semibold text-[var(--color-ink)]">{weton.pasaran.neptu}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {loveMatch && (
        <div className="w-full max-w-2xl space-y-4 mt-4">
          <div className="cosmic-card px-6 py-5 text-center">
            <div className="text-[36px] mb-1">💞</div>
            <div className="text-[20px] font-bold text-[var(--color-ink)]">
              {loveMatch.a.day.en} {loveMatch.a.pasaran.name} &times; {loveMatch.b.day.en} {loveMatch.b.pasaran.name}
            </div>
            <div className="text-[14px] text-[var(--color-ink-muted-48)]">
              Neptu {loveMatch.a.neptu} + {loveMatch.b.neptu} = {loveMatch.a.neptu + loveMatch.b.neptu}
            </div>
          </div>

          <div className="cosmic-card px-6 py-5 text-center">
            <div className={`text-[28px] font-bold mb-1 ${loveMatch.match.result === "Ratu" || loveMatch.match.result === "Jodoh" ? "text-[var(--color-primary)]" : loveMatch.match.result === "Pegat" || loveMatch.match.result === "Padu" ? "text-red-500" : "text-[var(--color-ink)]"}`}>
              {loveMatch.match.result}
            </div>
            <p className="text-[14px] leading-[1.6] text-[var(--color-ink)]">
              {loveMatch.match.meaning}
            </p>
          </div>
        </div>
      )}

      {!weton && !loveMatch && (dayIdx === "" || pasaranIdx === "") && (
        <div className="w-full max-w-2xl space-y-4">
          <div className="cosmic-card px-6 py-5">
            <h2 className="text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-[var(--color-ink-muted-48)] mb-3 uppercase">
              Tentang Primbon (About Primbon)
            </h2>
            <p className="text-[14px] leading-[1.6] text-[var(--color-ink)] mb-3">
              <strong>Primbon</strong> is the ancient Javanese system of divination, cosmology, and traditional wisdom — a body of knowledge recorded over centuries in handwritten manuscripts (<em>naskah kuna</em>) passed between palace scholars of the Mataram, Kartasura, and Surakarta courts and the village mystics (<em>dukun</em> or <em>sesepuh</em>) who preserved the oral traditions. The word <em>primbon</em> derives from the Old Javanese root <em>imbu</em> or <em>ngimbu</em>, meaning to store, collect, compile, or combine — making it literally "a collected compendium" of traditional Javanese knowledge spanning astronomy, agriculture, architecture, dream interpretation, character analysis, medicine, and spiritual philosophy.
            </p>
            <p className="text-[14px] leading-[1.6] text-[var(--color-ink)] mb-3">
              The most famous primbon text is the <em>Primbon Betaljemur Adammakna</em>, compiled by the palace scholar and mystic Kangjeng Pangeran Harya Tjakraningrat and later expanded by R. Soedibjo. These manuscripts were written on <em>dluwang</em> (handmade paper from the bark of the saeh tree), in Javanese script (<em>Hanacaraka</em>), and organized into chapters covering everything from the sacred days of the week to the interpretation of bird calls, dreams, and bodily twitches. The knowledge in these texts represents the culmination of generations of observation, encoded in a system that blends Hindu-Buddhist cosmology with Islamic Sufi mysticism and native Javanese animism — a syncretic worldview called <em>Kejawen</em>.
            </p>
            <p className="text-[14px] leading-[1.6] text-[var(--color-ink)] mb-3">
              At the heart of Primbon is the concept of <strong>weton</strong> — the sacred combination of your birth day in the seven-day week (<em>Saptawara</em>) and your birth day in the five-day market cycle (<em>Pancawara</em> or <em>Pasaran</em>). The Saptawara follows the familiar international week: Sunday (<em>Minggu/Ahad</em>, neptu 5), Monday (<em>Senen</em>, 4), Tuesday (<em>Selasa</em>, 3), Wednesday (<em>Rebo</em>, 7), Thursday (<em>Kemis</em>, 8), Friday (<em>Jumat</em>, 6), and Saturday (<em>Sabtu</em>, 9). The Pancawara is a uniquely Javanese five-day cycle used for traditional markets (<em>pasar</em>): Legi/Manis (neptu 5), Pahing/Pahit (9), Pon (7), Wage/Cemeng (4), and Kliwon/Asih (8). These two cycles run concurrently, completing a full cycle of 35 unique combinations (7 &times; 5) before repeating — each combination carrying its own distinct spiritual energy.
            </p>
            <p className="text-[14px] leading-[1.6] text-[var(--color-ink)] mb-3">
              Each day of both cycles carries a numerical value called <strong>neptu</strong>, derived from the Javanese cosmological belief that numbers are not abstract quantities but expressions of spiritual vibration. To find your weton's total neptu, you simply add your birth day's neptu to your pasaran's neptu. The result — ranging from 7 to 18 — becomes the key that unlocks your <strong>Pangarasan</strong> (life archetype) and <strong>Pancasuda</strong> (spiritual destiny). For example, someone born on Thursday (<em>Kemis</em>, neptu 8) with the pasaran Kliwon (neptu 8) has a total neptu of 16, placing them under the archetype <em>Lakuning Bumi</em> (Walk of the Earth) — the mountain that cannot be moved.
            </p>
            <p className="text-[14px] leading-[1.6] text-[var(--color-ink)] mb-3">
              The six Pangarasan archetypes — <em>Lakuning Srengenge</em> (Walk of the Sun), <em>Lakuning Bulan</em> (Walk of the Moon), <em>Lakuning Lintang</em> (Walk of the Stars), <em>Lakuning Bumi</em> (Walk of the Earth), <em>Lakuning Geni</em> (Walk of Fire), and <em>Lakuning Angin</em> (Walk of the Wind) — represent the fundamental forces that shape your character, just as the classical elements shaped the medieval European temperament. The Sun archetype radiates leadership and authority. The Moon archetype moves with intuition and emotional depth. The Stars archetype shines with vision and independence. The Earth archetype provides stability and endurance. The Fire archetype burns with passion and transformation. The Wind archetype flows with adaptability and intellect. Together, these six paths cover the full spectrum of human temperament in Javanese philosophy.
            </p>
            <p className="text-[14px] leading-[1.6] text-[var(--color-ink)] mb-3">
              Your Pancasuda — calculated from your neptu modulo 18 — reveals your spiritual destiny across nine possible archetypes: <em>Sumur Sinaba</em> (The Sought Well — people seek your wisdom), <em>Satriya Wirang</em> (The Knight in Distress — trials build your character), <em>Wasesa Segara</em> (Ocean Authority — vast and commanding presence), <em>Bumi Kapetak</em> (The Buried Earth — hidden strength), <em>Lebu Katiup Angin</em> (Dust Blown by the Wind — a wandering, adaptable spirit), and <em>Pandita Api</em> (The Fire Priest — spiritual intensity that can illuminate or consume). Unlike the Pangarasan, which describes your inherent nature, the Pancasuda describes the karmic pattern of your life journey — the spiritual lesson you are here to learn and teach.
            </p>
            <p className="text-[14px] leading-[1.6] text-[var(--color-ink)] mb-3">
              Beyond personal character analysis, Primbon is perhaps most famous in modern Javanese culture for its system of love compatibility (<em>cocok-cocokan weton</em>). Before marriage, traditional Javanese families still consult a <em>pawang</em> or elder to check whether the couple's wetons are compatible. The total neptu of both partners is added together, and the result determines the type of match: <strong>Ratu</strong> (the highest — a royal and blessed union), <strong>Jodoh</strong> (destined — naturally harmonious), <strong>Topo</strong> (patient — challenges early, lasting reward), <strong>Tinari</strong> (blessed — happiness and fortune), <strong>Padu</strong> (fiery — intense and argumentative), <strong>Pesthi</strong> (fated — unbreakable bond), and <strong>Pegat</strong> (fragile — at risk of separation). This system remains deeply influential in Javanese society, where a marriage proposal still begins with the question: "<em>Napa wetonipun cocok?</em>" — "Are their wetons compatible?"
            </p>
            <p className="text-[14px] leading-[1.6] text-[var(--color-ink)]">
              Select your birth day and pasaran above to discover your Javanese archetype, and enter a partner's weton to check your love compatibility according to the ancient traditions passed down through generations of Javanese wisdom keepers.
            </p>
          </div>
          <div className="cosmic-card px-6 py-5">
            <h3 className="text-[12px] font-semibold uppercase text-[var(--color-ink-muted-48)] mb-3">Referensi Siklus Pasaran (Pasaran Cycle Reference)</h3>
            <div className="grid grid-cols-5 gap-2 text-center">
              {PASARAN_LIST.map((p) => (
                <div key={p.id} className="px-2 py-2 rounded-[11px] bg-[var(--color-surface-pearl)]">
                  <div className="text-[11px] font-semibold text-[var(--color-ink)]">{p.name.split("/")[0]}</div>
                  <div className="text-[10px] text-[var(--color-ink-muted-48)]">Neptu {p.neptu}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
          <Disclaimer type="divination" />
    </div>
  );
}
