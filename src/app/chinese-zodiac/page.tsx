"use client";

import { useMemo, useState } from "react";
import ThemeToggle from "../theme-toggle";
import { Disclaimer } from "../disclaimer";
import { PageTitle } from "../page-title";

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
  reading: string;
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
    reading: "As a Rat, you are the first sign of the Chinese zodiac, and you carry the clever, resourceful energy of the survivor. You earned your place at the front of the procession through wit rather than strength, and that defines your approach to life. You are quick-thinking, charming, and endlessly adaptable &mdash; you can talk your way into any room and find your way out of any problem.\n\nYour greatest gift is your ability to read situations and people with remarkable accuracy. You know when to push and when to wait, when to speak and when to listen. This social intelligence makes you a natural networker and a formidable negotiator. In your career, you thrive in environments that reward quick thinking and versatility: business, entrepreneurship, sales, media, and any field where your charm and intelligence can shine.\n\nIn relationships, you are loyal to those who earn your trust, but you can be cautious about letting people in. You need a partner who appreciates your ambition and your need for variety. The Rat's shadow is a tendency toward opportunism &mdash; your survival instinct can sometimes prioritize your own interests over others'. Your life lesson is learning that true success comes not from getting ahead at others' expense, but from building alliances that lift everyone. Your quick mind and adaptability are gifts meant to create value, not just to survive.",
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
    reading: "As an Ox, you are the steady, dependable force of the Chinese zodiac. You are not here for shortcuts or flashy displays &mdash; you are here to work, to build, and to honor your commitments. Your strength is not the explosive power of the Tiger, but the patient endurance that outlasts every storm. You are the one who shows up early, stays late, and gets the job done right.\n\nYour methodical nature makes you invaluable in any endeavor that requires sustained effort. You excel in careers that reward patience and precision: agriculture, engineering, medicine, finance, and any craft that requires mastery through repetition. Your colleagues and superiors know they can count on you, and your reputation for reliability is your most valuable asset.\n\nIn relationships, you are loyal to a fault. You don't fall in love easily, but when you commit, you commit completely. Your love language is acts of service &mdash; you show you care by providing, protecting, and showing up consistently. Your challenge is rigidity. Your attachment to routine and your resistance to change can create friction in relationships and career alike. The Ox's life lesson is learning to bend without breaking. Your steady determination is a gift, but the most fulfilled Ox learns when to push forward and when to adapt. Like the ox that plows the field, your work creates the conditions for growth &mdash; but even the ox needs rest.",
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
    description: "The Tiger is the king of the jungle in Chinese astrology — bold, competitive, and fearless. Tigers are natural leaders who command attention wherever they go. They thrive on challenge and adventure, and their magnetic personality draws people to them like moths to a flame.",
    reading: "As a Tiger, you are one of the most powerful and magnetic signs of the Chinese zodiac. You are brave, competitive, and unapologetically bold. You were not born to follow; you were born to lead, to challenge, and to blaze trails that others will follow. Your charisma is undeniable, and your presence fills any room you enter.\n\nYour courage is your defining trait. You will take risks that make others hesitate, and your willingness to act decisively often leads to extraordinary achievements. In your career, you thrive in competitive environments that reward bold action: entrepreneurship, leadership, entertainment, athletics, and any field where confidence and charisma are assets. You are a natural pioneer, unafraid to venture where others fear to tread.\n\nIn relationships, you are passionate, generous, and fiercely protective of those you love. But your intensity can be overwhelming, and your need for control can create conflict. You need a partner who is strong enough to stand their ground, adventurous enough to keep up with you, and wise enough to know when to give you space. The Tiger's shadow is impulsiveness and a hot temper. Your life lesson is developing patience and learning that true strength includes the ability to listen, to pause, and to consider before you act. The most fulfilled Tiger learns to channel their fire constructively, using their courage not just to fight, but to protect and to build.",
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
    reading: "As a Rabbit, you are the most gracious and refined sign of the Chinese zodiac. You move through life with elegance, and your gentle nature makes you beloved by those who know you. You are a natural diplomat &mdash; you sense tension before it escalates and have a gift for smoothing over conflicts with tact and charm.\n\nYour aesthetic sensibility is highly developed. You appreciate beauty in all its forms, and you have a talent for creating harmonious environments. In your career, you excel in fields that require diplomacy, taste, and attention to harmony: diplomacy, design, human resources, counseling, the arts, and any role where your ability to create peace and beauty is valued.\n\nIn relationships, you are gentle, devoted, and deeply loving. You prioritize harmony and will go to great lengths to avoid conflict. This can be both a gift and a challenge &mdash; your desire for peace can lead you to avoid necessary confrontations or to suppress your own needs. You need a partner who appreciates your gentle nature but who also encourages you to speak your truth. The Rabbit's shadow is a tendency toward detachment and indecisiveness. When overwhelmed, you may withdraw rather than engage. Your life lesson is learning that true peace is not the absence of conflict, but the ability to navigate conflict with grace and honesty. Your kindness is your superpower, but the most fulfilled Rabbit learns that being kind to others begins with being honest with yourself.",
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
    description: "The Dragon is the most powerful and auspicious sign in the Chinese zodiac. Dragons are born leaders — confident, charismatic, and driven. They have a larger-than-life presence and the vision to achieve great things. In Chinese culture, Dragons are symbols of power, honor, and success.",
    reading: "As a Dragon, you are the most powerful and auspicious sign in the Chinese zodiac. You are born under a sign of mythic power, and your life is marked by a larger-than-life presence that commands attention and respect. You are confident, charismatic, and driven to achieve greatness. In Chinese culture, the Dragon is a symbol of imperial power, and those born under this sign carry an air of natural authority.\n\nYour vision is one of your greatest gifts. You see possibilities where others see obstacles, and you have the courage to pursue your dreams with relentless determination. In your career, you are drawn to leadership roles where you can make a significant impact: business, politics, entertainment, technology, and any field where your visionary drive can create transformative results.\n\nIn relationships, you are passionate, generous, and fiercely loyal. But your strong personality can be intimidating, and your need for admiration can create challenges. You need a partner who appreciates your grand vision without being eclipsed by it &mdash; someone strong enough to stand beside you as an equal. The Dragon's shadow is arrogance and impatience. Your confidence can tip into hubris, and your drive for results can make you dismissive of others' contributions. Your life lesson is learning that true leadership is not about being above others, but about lifting them up. The most fulfilled Dragon learns to channel their fire not just to achieve personal greatness, but to create conditions where everyone around them can rise.",
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
    reading: "As a Snake, you are the wisest and most enigmatic sign of the Chinese zodiac. You possess a penetrating intellect and an intuitive depth that allows you to see through surface appearances and perceive the hidden truths beneath. You are often called a 'little dragon,' and like the Dragon, you possess remarkable gifts &mdash; but you prefer quiet contemplation over the limelight.\n\nYour mind is your greatest weapon. You are strategic, calculating, and rarely make a move without first understanding all the angles. In your career, you excel in fields that reward wisdom, intuition, and strategic thinking: philosophy, research, finance, law, psychology, and any domain where your ability to perceive hidden patterns gives you an edge.\n\nIn relationships, you are mysterious, elegant, and deeply intuitive. You are not easily known, and you reveal yourself slowly to those who earn your trust. Once committed, you are fiercely loyal and deeply caring. But your secretive nature and tendency toward jealousy can create challenges. You need a partner who respects your need for privacy and who is patient enough to earn your trust over time. The Snake's shadow is possessiveness and a tendency toward manipulation. Your insight into human nature can be used for good or ill. Your life lesson is learning to use your wisdom not to control others, but to understand and uplift them. The most fulfilled Snake learns that the deepest truths are not found in hiding, but in the courage to be truly seen.",
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
    reading: "As a Horse, you are the free spirit of the Chinese zodiac. You are energetic, independent, and driven by an unquenchable thirst for freedom and adventure. Your enthusiasm is infectious, and your restless spirit inspires those around you to live more fully. You were not born to be confined &mdash; you were born to run.\n\nYour energy and passion are your greatest gifts. You throw yourself wholeheartedly into everything you do, and your optimism and warmth draw people to you. In your career, you thrive in dynamic environments that offer variety, movement, and the freedom to explore: travel, entertainment, sports, sales, entrepreneurship, and any field where your energy and enthusiasm can shine.\n\nIn relationships, you are passionate, warm-hearted, and exciting. But your love of freedom can make commitment feel like a cage. You need a partner who understands that your independence is not a rejection &mdash; it is an essential part of who you are. The right partner for you is someone who gives you space to roam while providing a loving home to return to. The Horse's shadow is impatience and impulsiveness. Your desire for freedom can lead you to bolt when things get difficult, and your blunt honesty can sometimes wound. Your life lesson is learning that true freedom is not the absence of commitment, but the choice to commit consciously and wholeheartedly. The most fulfilled Horse learns to channel their incredible energy into pursuits that matter, and to find freedom not in escape, but in the full embrace of a life fully lived.",
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
    reading: "As a Goat, you are the gentle artist of the Chinese zodiac. You are creative, compassionate, and deeply connected to beauty in all its forms. Your nature is peaceful, and you thrive in environments where harmony, kindness, and aesthetic refinement are valued. You possess a quiet strength that is easy to underestimate.\n\nYour creative gift is profound. You have a natural eye for beauty and a talent for bringing aesthetic harmony into the world. In your career, you excel in fields that allow you to express your creativity and compassion: the arts, design, music, counseling, social work, education, and any role where you can create beauty or care for others.\n\nIn relationships, you are gentle, loving, and deeply devoted. You create warm, nurturing homes and are at your best when surrounded by loved ones. But your sensitivity can be a double-edged sword &mdash; you absorb the emotions of those around you, and you can become anxious or pessimistic in stressful environments. You need a partner who provides stability and reassurance, someone who appreciates your gentle nature without taking advantage of it. The Goat's shadow is a tendency toward dependence and indecisiveness. Your desire for peace can lead you to avoid necessary decisions or to rely too heavily on others. Your life lesson is learning that your gentleness is not weakness. True peace comes not from avoiding life's challenges, but from navigating them with grace and resilience. The most fulfilled Goat learns to trust their own strength and to create the beauty they want to see in the world.",
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
    reading: "As a Monkey, you are the brilliant trickster of the Chinese zodiac. Your archetype is Sun Wukong, the Monkey King &mdash; clever, mischievous, and capable of extraordinary feats through wit and ingenuity. You are quick-witted, inventive, and endlessly curious. Your mind is your playground, and you approach life as a puzzle to be solved, a game to be won, or a joke to be appreciated.\n\nYour intelligence and adaptability are your greatest assets. You can learn any skill, talk your way into or out of any situation, and find creative solutions to problems that stump others. In your career, you excel in fields that reward intellect, creativity, and versatility: technology, science, entertainment, entrepreneurship, sales, and any role where your quick mind and charm can give you an edge.\n\nIn relationships, you are charming, playful, and endlessly entertaining. But your restlessness and love of novelty can make it hard for you to settle down. You need a partner who stimulates you intellectually, appreciates your humor, and gives you the freedom to be yourself. The Monkey's shadow is a tendency toward mischief, deceit, and arrogance. Your cleverness can be used to manipulate, and your confidence can tip into condescension. Your life lesson is learning to use your remarkable gifts for creation rather than manipulation. The most fulfilled Monkey learns that the greatest trick is not getting ahead of others, but using your ingenuity to make the world a better, more interesting place for everyone. Your brilliance is a gift &mdash; the question is what you choose to build with it.",
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
    reading: "As a Rooster, you are the most precise and dependable sign of the Chinese zodiac. You are hardworking, observant, and gifted with an eye for detail that others lack. You take pride in doing things right, showing up on time, and meeting your commitments. Your confidence and competence make you a natural leader in any field you choose.\n\nYour attention to detail is legendary. You notice what everyone else misses, and your standards of excellence are high &mdash; sometimes impossibly high. In your career, you excel in fields that reward precision, organization, and reliability: project management, editing, accounting, law, medicine, engineering, and any craft that requires meticulous attention to quality.\n\nIn relationships, you are loyal, honest, and deeply committed. You express love through acts of service and by creating order and stability for those you care about. But your perfectionism and critical nature can create friction. You can be harsh with yourself and with others, and your blunt honesty can sometimes wound. You need a partner who appreciates your strengths without being intimidated by your high standards. The Rooster's shadow is vanity and a tendency toward criticism. Your desire for excellence can tip into rigidity, and your critical eye can make others feel judged. Your life lesson is learning that excellence is a worthy goal, but perfection is a illusion. The most fulfilled Rooster learns to apply their remarkable attention to detail not just to external tasks, but to the cultivation of patience, compassion, and grace. Your precision is a gift &mdash; use it to build, not to tear down.",
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
    reading: "As a Dog, you are the most loyal and principled sign of the Chinese zodiac. Your word is your bond, and your sense of justice is unshakeable. You are honest, dependable, and always ready to stand up for what is right. Your loyalty to those you love is legendary, and you will go to great lengths to protect and defend your pack.\n\nYour integrity is your defining trait. You have a built-in moral compass that guides your decisions, and you cannot stand by when you see injustice. In your career, you excel in fields that require honesty, dedication, and a sense of service: law enforcement, social work, education, healthcare, advocacy, and any role where your commitment to doing the right thing makes a difference.\n\nIn relationships, you are loyal, protective, and deeply devoted. You are the friend who shows up in a crisis, the partner who stands by you through thick and thin. But your anxiety and pessimism can be challenging &mdash; you worry about the worst-case scenario and can be overly critical of yourself and others. You need a partner who appreciates your loyalty and provides reassurance when your anxiety spikes. The Dog's shadow is a tendency toward stubbornness, worry, and judgment. Your strong sense of right and wrong can make you rigid, and your protective instincts can become controlling. Your life lesson is learning that loyalty is not about control, but about trust. The most fulfilled Dog learns to balance their fierce loyalty with acceptance, to temper their judgment with compassion, and to trust that the people they love are capable of making their own choices. Your devotion is a gift &mdash; the world needs more people who care as deeply as you do.",
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
    reading: "As a Pig, you are the most generous and warm-hearted sign of the Chinese zodiac. You approach life with an open heart, a genuine desire to make others happy, and a simple, authentic approach to relationships that is refreshingly free of pretense. You enjoy life's pleasures and believe that happiness is meant to be shared.\n\nYour generosity is legendary. You give freely of your time, resources, and affection, often putting others' needs ahead of your own. In your career, you excel in fields that allow you to help others and create beauty: hospitality, the arts, philanthropy, education, healthcare, and any role where your warmth and generosity can make a positive impact.\n\nIn relationships, you are loving, devoted, and deeply sincere. You love wholeheartedly and without reservation, creating warm and nurturing bonds with those you care about. But your trust in others can be naive, and your desire to please can make you vulnerable to those who would take advantage of your generosity. You need a partner who appreciates your kind heart and who protects it without exploiting it. The Pig's shadow is a tendency toward indulgence and materialism. Your love of life's pleasures can tip into excess, and your desire for comfort can lead to complacency. Your life lesson is learning that true abundance is not about accumulation, but about appreciation. The most fulfilled Pig learns to balance their generous heart with healthy boundaries, to enjoy life's pleasures without being controlled by them, and to trust their own worth independent of what they can give to others. Your warmth is a gift to the world &mdash; share it freely, but never at the expense of your own well-being.",
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
      <PageTitle title="Chinese Zodiac" />
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <h1 className="cosmic-headline text-[34px] leading-[1.47] tracking-[-0.374px] mb-8">
        Chinese Zodiac
      </h1>

      <div className="w-full max-w-2xl cosmic-card px-6 py-5 mb-5">
        <h2 className="text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-[var(--color-ink-muted-48)] mb-3 uppercase">
          Birth Year
        </h2>
        <input
          value={year}
          onChange={(e) => setYear(e.target.value.replace(/\D/g, "").slice(0, 4))}
          placeholder="Enter your birth year (e.g. 1990)"
          className="cosmic-input w-full h-10 text-[14px]"
        />
      </div>

      <div className="w-full max-w-2xl cosmic-card px-6 py-5 mb-5">
        <h2 className="text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-[var(--color-ink-muted-48)] mb-3 uppercase">
          Or Your Name
        </h2>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          className="cosmic-input w-full h-10 text-[14px]"
        />
        <p className="text-[11px] text-[var(--color-ink-muted-48)] mt-1.5">
            Based on the mystical numerology of vowel and consonant harmony.
        </p>
      </div>

      {result && (
        <div className="w-full max-w-2xl space-y-4">
          <div className="cosmic-card px-6 py-5 text-center">
            <div className="text-[48px] mb-1">{result.animal.emoji}</div>
            <div className="text-[28px] font-bold text-[var(--color-ink)]">
              {result.animal.animal}
            </div>
            <div className="text-[13px] text-[var(--color-ink-muted-48)] mt-1">
              Born in {result.year} &middot; Element: {result.element} &middot; {result.animal.yinyang}
            </div>
          </div>

          <div className="cosmic-card px-6 py-5">
            <p className="text-[14px] leading-[1.6] text-[var(--color-ink)]">
              {result.animal.description}
            </p>
          </div>

          <div className="cosmic-card px-6 py-5">
            <h3 className="text-[12px] font-semibold uppercase text-[var(--color-ink-muted-48)] mb-3">Your Reading</h3>
            {result.animal.reading.split("\n\n").map((p, i) => (
              <p key={i} className="text-[14px] leading-[1.7] text-[var(--color-ink)] mb-2 last:mb-0">
                {p}
              </p>
            ))}
          </div>

          <div className="cosmic-card px-6 py-5">
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
            <div className="cosmic-card px-6 py-5">
              <h3 className="text-[12px] font-semibold uppercase text-[var(--color-ink-muted-48)] mb-2">Best Matches</h3>
              <div className="flex flex-wrap gap-1.5">
                {result.animal.compatibility.map((c) => (
                  <span key={c} className="px-2.5 py-1 rounded-[9999px] text-[12px] bg-[var(--color-surface-pearl)] text-[var(--color-ink)]">
                    {c}
                  </span>
                ))}
              </div>
            </div>
            <div className="cosmic-card px-6 py-5">
              <h3 className="text-[12px] font-semibold uppercase text-[var(--color-ink-muted-48)] mb-2">Lucky Numbers</h3>
              <div className="text-[28px] font-bold text-[var(--color-ink)]">{result.animal.luckyNumbers}</div>
              <div className="text-[10px] uppercase text-[var(--color-ink-muted-48)] mt-1">Colors</div>
              <div className="text-[14px] text-[var(--color-ink)]">{result.animal.luckyColors}</div>
            </div>
          </div>

          <div className="cosmic-card px-6 py-5">
            <h3 className="text-[12px] font-semibold uppercase text-[var(--color-ink-muted-48)] mb-2">Also born in</h3>
            <p className="text-[13px] text-[var(--color-ink)]">{result.animal.years}</p>
          </div>
        </div>
      )}

      {nameResult && !result && (
        <div className="w-full max-w-2xl cosmic-card px-6 py-5">
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
          <div className="cosmic-card px-6 py-5">
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
          <div className="cosmic-card px-6 py-5">
            <p className="text-[14px] leading-[1.43] text-[var(--color-ink-muted-48)] text-center">
              Enter your birth year to discover your Chinese zodiac animal, element, lucky numbers, compatibility matches, and detailed personality traits. Or enter your name for a mystical spirit animal reading.
            </p>
          </div>
        </div>
      )}
          <Disclaimer type="divination" />
    </div>
  );
}
