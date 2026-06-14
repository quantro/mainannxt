"use client";

import { useMemo, useState } from "react";
import ThemeToggle from "../theme-toggle";
import { Disclaimer } from "../disclaimer";
import { PageTitle } from "../page-title";

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
  reading: string;
}

const ZODIAC_SIGNS: ZodiacSign[] = [
  {
    name: "Aries", symbol: "\u2648", emoji: "\uD83D\uDC0F",
    dateRange: "Mar 21 – Apr 19", element: "Fire", quality: "Cardinal",
    rulingPlanet: "Mars",
    traits: ["assertive", "courageous", "impulsive", "confident", "passionate"],
    strengths: ["natural leader", "fearless", "optimistic", "energetic"],
    weaknesses: ["impatient", "short-tempered", "aggressive", "moody"],
    compatibility: ["Gemini", "Leo", "Sagittarius", "Aquarius"],
    description: "Aries is the first sign of the zodiac, and those born under this sign are known for their bold, competitive spirit. Ruled by Mars, the planet of war and energy, Aries individuals are natural pioneers who charge headfirst into every situation.",
    reading: "As an Aries, you are a cosmic pioneer, born under the influence of Mars, the planet of action and desire. Your entire existence is oriented toward initiation &mdash; you don't wait for doors to open; you build your own door and walk through it. This makes you extraordinarily effective in environments that reward boldness and immediate action. In your career, you thrive in roles that let you take the lead, break new ground, or compete directly. You are not built for bureaucracy or waiting your turn.\n\nIn relationships, your directness is both your greatest gift and your sharpest edge. You love passionately and without reservation, but you can also be impatient when your partner doesn't match your intensity. Your challenge is learning that intimacy requires slowing down, listening, and allowing others to move at their own pace. The partner who earns your loyalty is the one who respects your independence while being strong enough to hold their ground.\n\nYour growth edge is patience &mdash; not the passive waiting kind, but the active endurance that allows you to see things through after the initial rush of excitement fades. The most fulfilled Aries learns to channel their fire not just into starting things, but into finishing them with the same vigor. Your life lesson: true courage includes the courage to be gentle."
  },
  {
    name: "Taurus", symbol: "\u2649", emoji: "\uD83D\uDC02",
    dateRange: "Apr 20 – May 20", element: "Earth", quality: "Fixed",
    rulingPlanet: "Venus",
    traits: ["determined", "practical", "reliable", "stubborn", "sensual"],
    strengths: ["dependable", "patient", "devoted", "grounded"],
    weaknesses: ["possessive", "stubborn", "resistant to change", "materialistic"],
    compatibility: ["Cancer", "Virgo", "Capricorn", "Pisces"],
    description: "Taurus is an earth sign represented by the Bull. Like their celestial spirit animal, Taureans enjoy a relaxed pace and appreciate the finer things in life. Ruled by Venus, they have a deep appreciation for beauty, art, and sensual pleasures.",
    reading: "Taurus, you are the anchor of the zodiac, ruled by Venus and grounded in the element of Earth. Your purpose is to build, stabilize, and savor. Unlike the restless signs, you understand that true wealth is not about accumulation but about experiencing life through your senses &mdash; the taste of good food, the feel of quality fabric, the sound of music that moves you. You are here to remind everyone that slowness is not weakness; it is the foundation of lasting value.\n\nIn love, you are unwavering once committed. You don't fall in love easily, but when you do, you build a fortress around that bond. Your loyalty is legendary, but your stubbornness can be equally monumental. You need a partner who respects your need for stability and who doesn't mistake your quiet steadiness for lack of passion. Beneath your calm exterior burns a deeply sensual and devoted heart.\n\nYour career thrives in domains that reward persistence, craftsmanship, and methodical progress. You excel in finance, architecture, culinary arts, design, and any field where tangible results matter more than flashy ideas. Your challenge is adapting to change &mdash; the world moves fast, and your resistance to pivoting can leave you behind. The fulfilled Taurus learns that stability and growth are not opposites, but partners. Your lesson: security is found not in holding tight, but in knowing what to release."
  },
  {
    name: "Gemini", symbol: "\u264A", emoji: "\uD83D\uDC65",
    dateRange: "May 21 – Jun 20", element: "Air", quality: "Mutable",
    rulingPlanet: "Mercury",
    traits: ["intellectual", "adaptable", "curious", "witty", "restless"],
    strengths: ["versatile", "communicative", "quick-witted", "charming"],
    weaknesses: ["indecisive", "inconsistent", "superficial", "anxious"],
    compatibility: ["Leo", "Libra", "Aquarius", "Aries"],
    description: "Gemini is represented by the Twins, reflecting their dual nature. Ruled by Mercury, the planet of communication, Geminis are masters of language, constantly seeking new information and experiences. Their adaptability is unmatched.",
    reading: "Gemini, you are the mind of the zodiac. Ruled by Mercury, you process information faster than almost anyone, and your thirst for knowledge is unquenchable. You are not one thing &mdash; you are many, and that multiplicity is your superpower. You can walk into any room, talk to anyone about anything, and leave them charmed and curious. Your adaptability is unmatched because you don't have a fixed self; you are fluid, responsive, and endlessly curious.\n\nRelationships with a Gemini are never boring. You bring intellectual stimulation, playful banter, and a sense of adventure that keeps the connection fresh. But your dual nature can frustrate partners who crave consistency. You might be deeply engaged one day and distant the next, not because you don't care, but because your attention has been captured by something new. Your growth edge is learning to commit &mdash; not just to people, but to your own choices and projects.\n\nCareer paths that leverage your verbal and intellectual gifts are ideal: writing, teaching, journalism, sales, public relations, and technology. The shadow side is a tendency to stay on the surface of things, collecting facts without integrating them into wisdom. Your life lesson is depth &mdash; learning that true understanding requires staying with one thing long enough to see it through. Your versatility is a gift, but your depth is your destination."
  },
  {
    name: "Cancer", symbol: "\u264B", emoji: "\uD83E\uDD88",
    dateRange: "Jun 21 – Jul 22", element: "Water", quality: "Cardinal",
    rulingPlanet: "The Moon",
    traits: ["sensitive", "intuitive", "nurturing", "emotional", "protective"],
    strengths: ["compassionate", "loyal", "imaginative", "tenacious"],
    weaknesses: ["moody", "clingy", "pessimistic", "manipulative"],
    compatibility: ["Virgo", "Scorpio", "Pisces", "Taurus"],
    description: "Cancer is a water sign ruled by the Moon, making Cancers deeply intuitive and emotional. Like the crab that represents them, Cancers have a hard exterior but are soft on the inside. Family and home are paramount to their happiness.",
    reading: "Cancer, you are the heart of the zodiac &mdash; a water sign ruled by the Moon, which governs your ever-changing emotional tides. Your gift is your profound capacity to feel, to nurture, and to create safe havens for the people you love. You are the friend who remembers birthdays, the parent who stays up worrying, the partner who builds a home out of four walls. Your intuition is almost psychic; you can walk into a room and immediately sense the emotional temperature.\n\nYour deepest need is security, and you seek it through connection. In relationships, you are fiercely protective and deeply loyal. But your protective shell can also be a prison &mdash; you retreat when hurt, and your moodiness can push people away before they have the chance to disappoint you. Your challenge is learning that vulnerability is not weakness; it is the door to the intimacy you crave.\n\nCareer paths that let you care for others or create beauty are your calling: healthcare, education, social work, interior design, culinary arts, and real estate. You build empires of comfort and security. Your life lesson is emotional mastery &mdash; not suppressing your feelings, but learning that you are not your moods. You are the sky, not the weather. The fulfilled Cancer learns to extend the same nurturing they give others to themselves."
  },
  {
    name: "Leo", symbol: "\u264C", emoji: "\uD83E\uDD81",
    dateRange: "Jul 23 – Aug 22", element: "Fire", quality: "Fixed",
    rulingPlanet: "The Sun",
    traits: ["dramatic", "generous", "proud", "charismatic", "warm"],
    strengths: ["confident", "creative", "passionate", "entertaining"],
    weaknesses: ["arrogant", "stubborn", "self-centered", "lazy"],
    compatibility: ["Libra", "Sagittarius", "Gemini", "Aries"],
    description: "Leo is ruled by the Sun, and Leos shine like the celestial body that governs them. Bold, theatrical, and fiercely loyal, Leos are natural-born leaders who thrive in the spotlight. Their warmth and generosity draw people to them.",
    reading: "Leo, you are the radiant heart of the zodiac, ruled by the Sun itself. You were born to shine, and your warmth, generosity, and charisma draw people to you like flowers turning toward daylight. You have an innate sense of drama &mdash; not in the negative sense, but in the understanding that life is meant to be lived fully, colorfully, and with passion. You are a natural performer, leader, and creator.\n\nYour challenge is the flip side of this radiant confidence: pride. You can be so attached to your self-image that criticism wounds you deeply, and your stubbornness can make you resist feedback that could help you grow. In relationships, you are incredibly generous and loyal, but you also need admiration and attention. The right partner for you is someone who celebrates your light without being eclipsed by it &mdash; someone strong enough to stand in their own radiance.\n\nCareer paths that put you on a stage &mdash; literally or figuratively &mdash; are where you thrive: entertainment, leadership, management, design, education, and any role where your creativity and warmth can inspire others. Your life lesson is that the sun does not need to prove it is the sun. True confidence is quiet. The most fulfilled Leo learns to shine without needing everyone to look. Your greatness is inherent; you don't need applause to be worthy."
  },
  {
    name: "Virgo", symbol: "\u264D", emoji: "\uD83D\uDC69\u200D\uD83D\uDCBB",
    dateRange: "Aug 23 – Sep 22", element: "Earth", quality: "Mutable",
    rulingPlanet: "Mercury",
    traits: ["analytical", "detail-oriented", "modest", "practical", "perfectionist"],
    strengths: ["meticulous", "reliable", "intelligent", "helpful"],
    weaknesses: ["critical", "overthinking", "picky", "shy"],
    compatibility: ["Scorpio", "Capricorn", "Taurus", "Cancer"],
    description: "Virgo is an earth sign historically associated with wheat and grain, representing agriculture and abundance. Ruled by Mercury, Virgos have sharp minds and a meticulous nature. They are the perfectionists of the zodiac, always striving to improve.",
    reading: "Virgo, you are the craftsman of the zodiac, ruled by Mercury and anchored in the element of Earth. Your mind is your greatest asset &mdash; analytical, precise, and endlessly capable of breaking down complex problems into manageable parts. You see what everyone else misses: the typo, the loose thread, the detail that makes the difference between good and excellent. You are not here for grand gestures; you are here to make things work.\n\nYour gift of discernment is also your cross to bear. Your inner critic never rests, and you can be as harsh with yourself as you are with the world. In relationships, you express love through acts of service &mdash; you remember the appointment, fix the broken shelf, and organize the chaos. But your partner may wish you would put down the to-do list and simply be present. Your challenge is learning that good enough is often truly good enough.\n\nCareer paths that reward precision and analysis are your natural habitat: healthcare, data analysis, editing, research, accounting, software development, and any craft that requires mastery of detail. Your life lesson is integration &mdash; learning that you are not your productivity, and your worth is not measured by how much you accomplish. The fulfilled Virgo learns to apply their meticulous eye for improvement to their own capacity for joy and rest."
  },
  {
    name: "Libra", symbol: "\u264E", emoji: "\u2696\uFE0F",
    dateRange: "Sep 23 – Oct 22", element: "Air", quality: "Cardinal",
    rulingPlanet: "Venus",
    traits: ["diplomatic", "charming", "social", "idealistic", "fair"],
    strengths: ["balanced", "gracious", "cooperative", "peaceful"],
    weaknesses: ["indecisive", "avoidant", "people-pleaser", "self-pitying"],
    compatibility: ["Sagittarius", "Aquarius", "Gemini", "Leo"],
    description: "Libra is represented by the Scales, symbolizing balance and harmony. Ruled by Venus, Libras have an innate sense of beauty, justice, and fairness. They are the diplomats of the zodiac, always seeking to create equilibrium in all areas of life.",
    reading: "Libra, you are the diplomat of the zodiac, ruled by Venus and symbolized by the Scales. Your entire life is oriented toward balance &mdash; between people, between ideas, between what is and what should be. You have an innate sense of aesthetics, justice, and harmony that makes you a natural curator of beauty and a fierce advocate for fairness. You can see every side of an argument, which makes you an invaluable mediator.\n\nBut your gift of perspective can become a trap. Your indecisiveness stems from seeing too many valid options, and your desire to keep everyone happy can leave you exhausted and unfulfilled. In relationships, you are charming, romantic, and deeply committed to partnership &mdash; you are most alive when in a loving bond. But you must learn that true partnership requires honesty, even when it disrupts the peace.\n\nYour career thrives in environments that require negotiation, collaboration, and creative taste: law, diplomacy, design, counseling, human resources, the arts, and any role that brings beauty or balance into the world. Your life lesson is that you cannot pour from an empty cup &mdash; balance begins within. The most fulfilled Libra learns that sometimes the most harmonious choice is the one that honors their own needs first, not everyone else's."
  },
  {
    name: "Scorpio", symbol: "\u264F", emoji: "\uD83E\uDD82",
    dateRange: "Oct 23 – Nov 21", element: "Water", quality: "Fixed",
    rulingPlanet: "Pluto",
    traits: ["passionate", "resourceful", "determined", "mysterious", "intense"],
    strengths: ["brave", "loyal", "perceptive", "focused"],
    weaknesses: ["jealous", "secretive", "vengeful", "possessive"],
    compatibility: ["Capricorn", "Pisces", "Cancer", "Virgo"],
    description: "Scorpio is one of the most misunderstood signs of the zodiac. Ruled by Pluto, the planet of transformation, Scorpios are intense, passionate, and unafraid to delve into life's mysteries. Their emotional depth knows no bounds.",
    reading: "Scorpio, you are the phoenix of the zodiac, ruled by Pluto, the planet of death and rebirth. You are not here for a comfortable life &mdash; you are here to transform, to descend into the depths, and to emerge stronger. Your intensity frightens those who prefer the surface of things, but for those willing to meet you in the deep water, you offer a loyalty and passion that is unparalleled. You see through lies, pretenses, and shallow interactions.\n\nYour shadow is your intensity turned inward. You can be jealous, possessive, and vengeful because you feel everything so deeply. Trust is not given lightly, but once earned, your loyalty is absolute. In relationships, you seek a soul merger &mdash; surface-level connection is meaningless to you. You need a partner who is brave enough to face their own shadows, because you will inevitably expose them.\n\nCareer paths that require depth and investigation suit you: psychology, research, detective work, finance, surgery, and any field that involves uncovering hidden truths. Your life lesson is the sacred art of release &mdash; learning that transformation requires letting go, not just holding on tighter. The most fulfilled Scorpio learns to apply their remarkable powers of regeneration not just to surviving trauma, but to thriving in the light."
  },
  {
    name: "Sagittarius", symbol: "\u2650", emoji: "\uD83C\uDFF9",
    dateRange: "Nov 22 – Dec 21", element: "Fire", quality: "Mutable",
    rulingPlanet: "Jupiter",
    traits: ["adventurous", "optimistic", "honest", "restless", "philosophical"],
    strengths: ["generous", "fun-loving", "independent", "intellectual"],
    weaknesses: ["tactless", "impatient", "irresponsible", "flighty"],
    compatibility: ["Aquarius", "Aries", "Leo", "Libra"],
    description: "Sagittarius, represented by the Archer, is always aiming for new horizons. Ruled by Jupiter, the planet of expansion and luck, Sagittarians are optimistic, freedom-loving, and constantly seeking truth and meaning through travel and philosophy.",
    reading: "Sagittarius, you are the explorer of the zodiac, ruled by Jupiter, the planet of expansion, luck, and meaning. You are here to seek truth &mdash; not the comfortable, domesticated truth, but the wild, untamed truth that lies over the next horizon. Your optimism is infectious, and your love of freedom is your defining characteristic. You are the friend who convinces everyone to take the road trip, the philosopher who asks uncomfortable questions, the student who never stops learning.\n\nYour restlessness is both your gift and your challenge. You can find commitment &mdash; to a place, a person, a career &mdash; claustrophobic. In relationships, you need a partner who understands that your need for freedom is not a rejection of them. You love deeply, but you need space to roam. Your blunt honesty can sometimes wound, but it comes from a place of authenticity, not cruelty.\n\nCareer paths that involve travel, teaching, publishing, philosophy, or any field that expands horizons are ideal: academia, journalism, travel industry, entrepreneurship, coaching, and spiritual guidance. Your life lesson is wisdom &mdash; learning that the truth you seek is not just out there, but also within. The most fulfilled Sagittarius learns that commitment is not a cage; it is the container that gives meaning to the journey."
  },
  {
    name: "Capricorn", symbol: "\u2651", emoji: "\uD83D\uDC10",
    dateRange: "Dec 22 – Jan 19", element: "Earth", quality: "Cardinal",
    rulingPlanet: "Saturn",
    traits: ["ambitious", "disciplined", "patient", "responsible", "practical"],
    strengths: ["reliable", "determined", "organized", "wise"],
    weaknesses: ["pessimistic", "rigid", "cold", "workaholic"],
    compatibility: ["Pisces", "Taurus", "Virgo", "Scorpio"],
    description: "Capricorn is represented by the Sea-Goat, a mythological creature that embodies ambition and resilience. Ruled by Saturn, the planet of discipline and structure, Capricorns are the CEOs of the zodiac — practical, responsible, and tirelessly determined.",
    reading: "Capricorn, you are the architect of the zodiac, ruled by Saturn, the planet of discipline, responsibility, and time. You understand something that most signs take decades to learn: that lasting achievement is the product of consistent, patient effort over time. You are here to build &mdash; structures, institutions, careers, legacies. Your work ethic is unmatched, and your ability to delay gratification for a greater future goal is your superpower.\n\nYour shadow is the tendency to measure your worth by your achievements. You can be so focused on the summit that you forget to enjoy the climb. In relationships, you can appear cold or distant because you express love through provision and protection rather than words or gestures. But beneath your stoic exterior beats a deeply loyal and caring heart. You need a partner who sees through your walls and appreciates the depth of your commitment.\n\nCareer paths that reward ambition and structure are your domain: business, finance, law, engineering, politics, and any leadership role that requires building something lasting. Your life lesson is that rest is not laziness, and pleasure is not a reward to be earned but a birthright to be enjoyed. The most fulfilled Capricorn learns to climb not for the view from the top, but for the strength found in the climb itself."
  },
  {
    name: "Aquarius", symbol: "\u2652", emoji: "\uD83C\uDF0A",
    dateRange: "Jan 20 – Feb 18", element: "Air", quality: "Fixed",
    rulingPlanet: "Uranus",
    traits: ["innovative", "independent", "humanitarian", "eccentric", "intellectual"],
    strengths: ["progressive", "original", "loyal", "visionary"],
    weaknesses: ["detached", "unpredictable", "rebellious", "stubborn"],
    compatibility: ["Aries", "Gemini", "Libra", "Sagittarius"],
    description: "Aquarius is the water-bearer of the zodiac, pouring out knowledge and wisdom. Ruled by Uranus, the planet of innovation and change, Aquarians are visionaries who think outside the box. They are deeply humanitarian and value freedom above all.",
    reading: "Aquarius, you are the visionary of the zodiac, ruled by Uranus, the planet of innovation, rebellion, and sudden insight. You are not here to fit in &mdash; you are here to see what no one else can see and to pour that knowledge out for the benefit of humanity. Your mind operates on a different frequency, one that is tuned to the future, to patterns others miss, and to ideas that seem impossible until you make them real.\n\nYour independence is your defining trait. You value freedom above almost everything, and you can be deeply uncomfortable with conventional expectations. In relationships, you need a partner who respects your need for autonomy and who can engage with you as an intellectual equal. You love humanity, but sometimes struggle to love one person intimately. Your challenge is bridging the gap between your visionary ideals and the messy, emotional reality of close relationships.\n\nCareer paths that allow you to innovate and serve the greater good are where you thrive: technology, science, social activism, community organizing, education, and any field that pushes boundaries. Your life lesson is that the future you envision must include yourself &mdash; you cannot pour from an empty well. The most fulfilled Aquarius learns that intimacy is not a constraint on freedom, but the ultimate expression of it."
  },
  {
    name: "Pisces", symbol: "\u2653", emoji: "\uD83D\uDC1F",
    dateRange: "Feb 19 – Mar 20", element: "Water", quality: "Mutable",
    rulingPlanet: "Neptune",
    traits: ["empathic", "artistic", "intuitive", "dreamy", "selfless"],
    strengths: ["compassionate", "creative", "adaptable", "spiritual"],
    weaknesses: ["escapist", "overly trusting", "victim mentality", "vague"],
    compatibility: ["Taurus", "Cancer", "Scorpio", "Capricorn"],
    description: "Pisces, represented by two Fish swimming in opposite directions, symbolizes the constant division of attention between fantasy and reality. Ruled by Neptune, the planet of dreams and illusions, Pisceans are the most intuitive, artistic, and empathic of the zodiac.",
    reading: "Pisces, you are the mystic of the zodiac, ruled by Neptune, the planet of dreams, illusions, and transcendence. You are the last sign, carrying the wisdom and the wounds of all the signs that came before you. Your empathy is not a choice; it is a condition &mdash; you absorb the emotions of those around you like a sponge, feeling joy and pain that isn't even yours. This makes you extraordinarily creative, compassionate, and spiritually attuned.\n\nYour gift of deep feeling is also your greatest vulnerability. Without strong boundaries, you can drown in the emotional waters you navigate so fluidly. Escapism is your shadow &mdash; you might retreat into fantasy, substances, or helping others to avoid facing your own pain. In relationships, you are the most romantic and selfless partner, but you must learn that love does not require self-sacrifice. You need a partner who offers the same depth of compassion they receive from you.\n\nCareer paths that channel your creativity and compassion are your calling: art, music, healing, social work, spiritual guidance, film, poetry, and any field that gives form to the invisible. Your life lesson is boundaries &mdash; learning that you can be deeply empathic without drowning in others' pain. The most fulfilled Pisces learns that the two fish swimming in opposite directions are not a symbol of conflict, but of the beautiful tension between dreams and reality. Your challenge is to build a bridge between them and live in both worlds."
  }
];

function getZodiac(month: number, day: number): ZodiacSign | null {
  const idx = ZODIAC_SIGNS.findIndex((z) => {
    const parts = z.dateRange.split(" – ");
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
      <PageTitle title="Star Sign Reader" />
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
            <h3 className="text-[12px] font-semibold uppercase text-[var(--color-ink-muted-48)] mb-3">Your Reading</h3>
            {result.sign.reading.split("\n\n").map((p, i) => (
              <p key={i} className="text-[14px] leading-[1.7] text-[var(--color-ink)] mb-2 last:mb-0">
                {p}
              </p>
            ))}
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
          <Disclaimer type="divination" />
    </div>
  );
}
