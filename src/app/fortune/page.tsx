"use client";

import { useMemo, useState, useCallback } from "react";
import ThemeToggle from "../theme-toggle";

interface Reading {
  fortune: string;
  vibe: string;
  luckyNumber: number;
  luckyColor: string;
  advice: string;
  emoji: string;
  tone: string;
}

const FORTUNES: Reading[] = [
  { fortune: "An unexpected journey will bring you great wisdom.", vibe: "adventurous", luckyNumber: 7, luckyColor: "Crimson", advice: "Pack light and keep an open mind.", emoji: "\uD83C\uDFC3", tone: "mystical" },
  { fortune: "A creative breakthrough is just around the corner.", vibe: "inspired", luckyNumber: 3, luckyColor: "Violet", advice: "Trust your instincts and make the first mark.", emoji: "\uD83C\uDFA8", tone: "encouraging" },
  { fortune: "Someone from your past will reappear with an important message.", vibe: "nostalgic", luckyNumber: 9, luckyColor: "Gold", advice: "Listen more than you speak when they arrive.", emoji: "\uD83D\uDCEC", tone: "mysterious" },
  { fortune: "The stars align for a financial opportunity you didn't expect.", vibe: "prosperous", luckyNumber: 8, luckyColor: "Emerald", advice: "Say yes before your doubts catch up.", emoji: "\uD83C\uDFE6", tone: "optimistic" },
  { fortune: "A difficult decision will reveal itself to be your greatest blessing.", vibe: "reflective", luckyNumber: 4, luckyColor: "Indigo", advice: "Patience is not passive; it is concentrated strength.", emoji: "\uD83E\uDDD8", tone: "wise" },
  { fortune: "Love finds you when you least expect it \u2014 and in the most unlikely place.", vibe: "romantic", luckyNumber: 2, luckyColor: "Rose", advice: "Let your guard down; the right person will catch you.", emoji: "\uD83D\uDC9B", tone: "tender" },
  { fortune: "Your hidden talent will soon take center stage.", vibe: "confident", luckyNumber: 1, luckyColor: "Gold", advice: "Stop hiding your gift. The world is ready.", emoji: "\uD83C\uDF1F", tone: "bold" },
  { fortune: "A period of deep transformation is upon you. Embrace the change.", vibe: "transformative", luckyNumber: 11, luckyColor: "Silver", advice: "What feels like an ending is actually a beginning.", emoji: "\uD83E\uDEA8", tone: "prophetic" },
  { fortune: "Your kindness will return to you tenfold when you need it most.", vibe: "heartwarming", luckyNumber: 6, luckyColor: "Peach", advice: "Keep being the person you needed when you were younger.", emoji: "\uD83D\uDC9E", tone: "gentle" },
  { fortune: "An old fear will finally lose its power over you.", vibe: "liberating", luckyNumber: 5, luckyColor: "Orange", advice: "Look the fear in the eye and watch it shrink.", emoji: "\uD83D\uDD25", tone: "fiery" },
  { fortune: "The universe is preparing a pleasant surprise for you this season.", vibe: "surprising", luckyNumber: 12, luckyColor: "Turquoise", advice: "Stay open to signs \u2014 they're everywhere right now.", emoji: "\u2728", tone: "playful" },
  { fortune: "Your intuition is heightened. Pay attention to your dreams.", vibe: "psychic", luckyNumber: 7, luckyColor: "Lavender", advice: "Keep a dream journal by your bed tonight.", emoji: "\uD83C\uDF19", tone: "mystical" },
  { fortune: "A conversation you've been avoiding will bring unexpected clarity.", vibe: "cathartic", luckyNumber: 3, luckyColor: "Teal", advice: "Breathe before you speak. Honesty without tact is cruelty.", emoji: "\uD83D\uDCAC", tone: "wise" },
  { fortune: "Success comes from a direction you haven't considered yet.", vibe: "breakthrough", luckyNumber: 8, luckyColor: "Copper", advice: "Look sideways, not forward. The path less traveled awaits.", emoji: "\uD83D\uDD0D", tone: "encouraging" },
  { fortune: "A friendship will deepen into something you didn't know you needed.", vibe: "connected", luckyNumber: 6, luckyColor: "Coral", advice: "Be the one who reaches out first this time.", emoji: "\uD83E\uDD1D", tone: "warm" },
  { fortune: "The answer you've been searching for has been inside you all along.", vibe: "enlightened", luckyNumber: 9, luckyColor: "White", advice: "Silence is the language of the soul. Sit with yourself.", emoji: "\uD83E\uDDD8\u200D\u2642\uFE0F", tone: "spiritual" },
  { fortune: "Bold action on a small idea will yield surprisingly large results.", vibe: "ambitious", luckyNumber: 1, luckyColor: "Scarlet", advice: "Start before you're ready. Momentum is the real magic.", emoji: "\uD83D\uDE80", tone: "bold" },
  { fortune: "Healing is coming to a part of you that has been hurting for too long.", vibe: "healing", luckyNumber: 4, luckyColor: "Sage", advice: "You don't have to be fixed to be whole.", emoji: "\uD83C\uDF3F", tone: "tender" },
  { fortune: "A chance encounter will lead to an exciting new chapter.", vibe: "serendipitous", luckyNumber: 5, luckyColor: "Amber", advice: "Say yes to the invitation you're on the fence about.", emoji: "\uD83C\uDFB2", tone: "playful" },
  { fortune: "Your patience is about to be rewarded in a spectacular way.", vibe: "rewarding", luckyNumber: 7, luckyColor: "Platinum", advice: "The universe is testing your timing, not your worth.", emoji: "\uD83C\uDFC6", tone: "optimistic" },
];

const TAROT_CARDS = [
  { name: "The Fool", meaning: "New beginnings, innocence, spontaneity. A leap of faith awaits you." },
  { name: "The Magician", meaning: "Manifestation, resourcefulness, inspired action. You have all the tools you need." },
  { name: "The High Priestess", meaning: "Intuition, mystery, the subconscious. Trust the wisdom within." },
  { name: "The Empress", meaning: "Abundance, nurturing, nature. Creativity and beauty surround you." },
  { name: "The Emperor", meaning: "Authority, structure, stability. Take charge of your domain." },
  { name: "The Hierophant", meaning: "Tradition, spiritual wisdom, conformity. Seek guidance from a mentor." },
  { name: "The Lovers", meaning: "Love, harmony, relationships. A meaningful choice is before you." },
  { name: "The Chariot", meaning: "Willpower, determination, victory. Push forward with confidence." },
  { name: "Strength", meaning: "Bravery, compassion, inner power. You are stronger than you know." },
  { name: "The Hermit", meaning: "Soul-searching, introspection, solitude. Wisdom comes from within." },
  { name: "Wheel of Fortune", meaning: "Change, cycles, fate. Your luck is about to turn." },
  { name: "Justice", meaning: "Fairness, truth, cause and effect. The scales are balancing." },
  { name: "The Hanged Man", meaning: "Surrender, new perspective, pause. Let go to move forward." },
  { name: "Death", meaning: "Transformation, endings, new beginnings. Embrace the rebirth." },
  { name: "Temperance", meaning: "Balance, moderation, patience. Find the middle path." },
  { name: "The Devil", meaning: "Shadow self, attachment, materialism. Face what holds you back." },
  { name: "The Tower", meaning: "Sudden change, upheaval, revelation. The fall clears the way." },
  { name: "The Star", meaning: "Hope, inspiration, serenity. The universe is guiding you." },
  { name: "The Moon", meaning: "Illusion, fear, the unconscious. Trust your intuition." },
  { name: "The Sun", meaning: "Success, vitality, joy. You are entering a radiant period." },
  { name: "Judgement", meaning: "Reflection, reckoning, awakening. Answer the call." },
  { name: "The World", meaning: "Completion, accomplishment, wholeness. A cycle is complete." },
];

function hashName(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    const char = name.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function getFortune(name: string): Reading {
  const hash = hashName(name.trim().toLowerCase());
  const idx = hash % FORTUNES.length;
  return FORTUNES[idx];
}

function getTarot(name: string) {
  const hash = hashName(name.trim().toLowerCase());
  const idx = hash % TAROT_CARDS.length;
  return TAROT_CARDS[idx];
}

export default function FortunePage() {
  const [name, setName] = useState("");
  const [animate, setAnimate] = useState(false);

  const reading = useMemo(() => {
    if (!name.trim()) return null;
    return getFortune(name);
  }, [name]);

  const tarot = useMemo(() => {
    if (!name.trim()) return null;
    return getTarot(name);
  }, [name]);

  const handleReveal = useCallback(() => {
    setAnimate(true);
    setTimeout(() => setAnimate(false), 1000);
  }, []);

  const hasContent = name.trim().length > 0;

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-12">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <h1 className="apple-headline text-[34px] leading-[1.47] tracking-[-0.374px] mb-2">
        Fortune Teller
      </h1>
      <p className="text-[13px] text-[var(--color-ink-muted-48)] mb-8">
        The spirits speak through names. Enter yours to hear their message.
      </p>

      <div className="w-full max-w-2xl apple-card px-6 py-5 mb-5">
        <h2 className="text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-[var(--color-ink-muted-48)] mb-3 uppercase">
          Your Name
        </h2>
        <div className="flex gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleReveal()}
            placeholder="Enter your name..."
            className="apple-input w-full h-10 text-[14px]"
          />
          <button
            onClick={handleReveal}
            className="apple-btn-primary text-[13px] whitespace-nowrap"
            disabled={!name.trim()}
          >
            Reveal
          </button>
        </div>
      </div>

      {hasContent && reading && tarot && (
        <div className={`w-full max-w-2xl space-y-4 transition-all duration-500 ${animate ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}>
          <div className="apple-card px-6 py-5 text-center">
            <div className="text-[56px] mb-2">{reading.emoji}</div>
            <div className="text-[20px] font-semibold text-[var(--color-ink)] leading-[1.4]">
              &ldquo;{reading.fortune}&rdquo;
            </div>
            <div className="text-[12px] text-[var(--color-ink-muted-48)] mt-2 italic">
              a {reading.tone} reading with {reading.vibe} energy
            </div>
          </div>

          <div className="apple-card px-6 py-5">
            <h3 className="text-[12px] font-semibold uppercase text-[var(--color-ink-muted-48)] mb-3">Tarot Card</h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-16 rounded-[8px] bg-gradient-to-br from-[var(--color-primary)] to-purple-600 flex items-center justify-center text-white text-[20px] font-bold shadow-sm">
                ?
              </div>
              <div>
                <div className="text-[17px] font-semibold text-[var(--color-ink)]">{tarot.name}</div>
                <div className="text-[13px] text-[var(--color-ink-muted-48)]">{tarot.meaning}</div>
              </div>
            </div>
          </div>

          <div className="apple-card px-6 py-5">
            <h3 className="text-[12px] font-semibold uppercase text-[var(--color-ink-muted-48)] mb-3">Advice</h3>
            <p className="text-[15px] text-[var(--color-ink)] leading-[1.5]">
              {reading.advice}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="apple-card px-6 py-5">
              <div className="text-[10px] uppercase text-[var(--color-ink-muted-48)] tracking-wider">Lucky Number</div>
              <div className="text-[28px] font-bold text-[var(--color-ink)] tabular-nums">{reading.luckyNumber}</div>
            </div>
            <div className="apple-card px-6 py-5">
              <div className="text-[10px] uppercase text-[var(--color-ink-muted-48)] tracking-wider">Lucky Color</div>
              <div className="text-[28px] font-bold text-[var(--color-ink)]">{reading.luckyColor}</div>
            </div>
          </div>

          <div className="apple-card px-6 py-5 text-center">
            <p className="text-[13px] text-[var(--color-ink-muted-48)] italic">
              The spirits have spoken through the name <strong className="text-[var(--color-ink)]">{name.trim()}</strong>. Come back tomorrow for a new reading.
            </p>
          </div>
        </div>
      )}

      {!hasContent && (
        <div className="w-full max-w-2xl space-y-4">
          <div className="apple-card px-6 py-5">
            <h2 className="text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-[var(--color-ink-muted-48)] mb-3 uppercase">
              About Fortune Telling
            </h2>
            <p className="text-[14px] leading-[1.6] text-[var(--color-ink)] mb-3">
              Fortune telling is one of humanity's oldest spiritual practices, spanning every culture and era. From the oracle bones of ancient China (c. 1600 BCE) to the Pythia of Delphi in ancient Greece, from the I Ching of Taoist philosophy to the tarot decks of medieval Europe, humans have always sought to peer beyond the veil of the present moment and glimpse what lies ahead. The common thread across all traditions is the belief that patterns &mdash; in nature, in symbols, in names, in numbers &mdash; can reveal truths about our past, present, and future.
            </p>
            <p className="text-[14px] leading-[1.6] text-[var(--color-ink)] mb-3">
              This Fortune Teller uses two complementary divination methods. The first is <strong>onomantic fortune telling</strong> &mdash; the ancient practice of deriving meaning from names. Your name carries a unique vibrational signature that, when processed through a symbolic hash, connects you to specific archetypal messages from a curated collection of 20 mystical fortunes. Each fortune is paired with a tone (mystical, wise, bold, tender, etc.) and an energy vibe that reflects the quality of the reading.
            </p>
            <p className="text-[14px] leading-[1.6] text-[var(--color-ink)] mb-3">
              The second method is <strong>tarot</strong>. The tarot deck consists of 78 cards divided into the Major Arcana (22 cards representing life-defining archetypal forces) and the Minor Arcana (56 cards representing daily events and challenges). This reading draws from the Major Arcana &mdash; cards like The Fool, The Magician, Death, and The Star. Each Major Arcana card represents a powerful life theme or spiritual lesson. Your name determines which card is drawn, and its meaning offers guidance for your current path.
            </p>
            <p className="text-[14px] leading-[1.6] text-[var(--color-ink)]">
              Together, the fortune, the tarot card, and the advice form a three-part reading: insight into what's coming, the archetypal energy surrounding you, and practical guidance for navigating the days ahead. The reading is deterministic based on your name &mdash; enter the same name and you'll receive the same message, making it a personal touchstone you can return to.
            </p>
          </div>
          <div className="apple-card px-6 py-5">
            <p className="text-[14px] leading-[1.43] text-[var(--color-ink-muted-48)] text-center">
              Enter your name to receive a personalized fortune, a tarot card drawn from the Major Arcana, your lucky number, your lucky color, and spiritual advice for the path ahead.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
