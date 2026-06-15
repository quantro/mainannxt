"use client";

import { useMemo, useState, useCallback } from "react";
import ThemeToggle from "../theme-toggle";
import { Disclaimer } from "../disclaimer";
import { PageTitle } from "../page-title";

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
  { fortune: "Love finds you when you least expect it — and in the most unlikely place.", vibe: "romantic", luckyNumber: 2, luckyColor: "Rose", advice: "Let your guard down; the right person will catch you.", emoji: "\uD83D\uDC9B", tone: "tender" },
  { fortune: "Your hidden talent will soon take center stage.", vibe: "confident", luckyNumber: 1, luckyColor: "Gold", advice: "Stop hiding your gift. The world is ready.", emoji: "\uD83C\uDF1F", tone: "bold" },
  { fortune: "A period of deep transformation is upon you. Embrace the change.", vibe: "transformative", luckyNumber: 11, luckyColor: "Silver", advice: "What feels like an ending is actually a beginning.", emoji: "\uD83E\uDEA8", tone: "prophetic" },
  { fortune: "Your kindness will return to you tenfold when you need it most.", vibe: "heartwarming", luckyNumber: 6, luckyColor: "Peach", advice: "Keep being the person you needed when you were younger.", emoji: "\uD83D\uDC9E", tone: "gentle" },
  { fortune: "An old fear will finally lose its power over you.", vibe: "liberating", luckyNumber: 5, luckyColor: "Orange", advice: "Look the fear in the eye and watch it shrink.", emoji: "\uD83D\uDD25", tone: "fiery" },
  { fortune: "The universe is preparing a pleasant surprise for you this season.", vibe: "surprising", luckyNumber: 12, luckyColor: "Turquoise", advice: "Stay open to signs — they're everywhere right now.", emoji: "\u2728", tone: "playful" },
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
  { name: "The Fool", meaning: "New beginnings, innocence, spontaneity. A leap of faith awaits you.", reading: "The Fool is the zero card of the Major Arcana &mdash; the beginning of the journey, the infinite potential before the path unfolds. When this card appears, it signals that you are standing at the threshold of a new cycle. The universe is asking you to take a leap of faith, to trust in the unknown, and to approach life with the open-hearted wonder of a child. The Fool's energy is pure, unburdened by past failures or future anxieties. Your reading carries the invitation to start something new without needing to know exactly how it will end. Trust that the universe will catch you." },
  { name: "The Magician", meaning: "Manifestation, resourcefulness, inspired action. You have all the tools you need.", reading: "The Magician is the alchemist of the tarot, holding the four suits &mdash; wands, cups, swords, and pentacles &mdash; representing all the tools you need to manifest your desires. This card signals a time of tremendous creative power and resourcefulness. Everything you need to succeed is already within your reach. The Magician's energy is focused, intentional, and capable of turning vision into reality. Your reading calls you to recognize your own power, to trust your skills, and to take inspired action. The universe has given you the ingredients; now it's time to create your masterpiece." },
  { name: "The High Priestess", meaning: "Intuition, mystery, the subconscious. Trust the wisdom within.", reading: "The High Priestess sits at the veil between the conscious and subconscious worlds, guarding the mysteries that lie beneath the surface of ordinary awareness. When she appears, she calls you to turn inward, to listen to your intuition, and to trust the wisdom that arises from your deepest self. This is not a time for logical analysis or external validation. The answers you seek are already within you, waiting to be discovered in the silence. Your reading asks you to create space for stillness, to pay attention to your dreams, and to honor the subtle whispers of your inner knowing." },
  { name: "The Empress", meaning: "Abundance, nurturing, nature. Creativity and beauty surround you.", reading: "The Empress is the archetype of the Great Mother &mdash; abundance, fertility, and the creative force of nature herself. When this card appears, it signals a period of growth, prosperity, and sensual pleasure. The universe is showering you with abundance, and your task is to receive it with gratitude. This is a time for nurturing yourself and others, for connecting with nature, and for allowing your creative gifts to flourish. Your reading invites you to embrace your sensuality, to surround yourself with beauty, and to trust that the universe is a generous and supportive place." },
  { name: "The Emperor", meaning: "Authority, structure, stability. Take charge of your domain.", reading: "The Emperor represents sovereign authority, structure, and the masculine principle of leadership. When he appears, he calls you to step into your power, to establish order in your domain, and to take responsibility for your life with confidence and clarity. This is a time for setting boundaries, creating structures, and leading with wisdom rather than force. The Emperor's energy is protective, stabilizing, and grounded. Your reading asks you to examine where you need to assert your authority and to trust in your ability to create order out of chaos through disciplined, consistent action." },
  { name: "The Hierophant", meaning: "Tradition, spiritual wisdom, conformity. Seek guidance from a mentor.", reading: "The Hierophant is the bridge between the divine and the human, the keeper of sacred traditions and spiritual wisdom. When he appears, he signals a time for learning from established wisdom, seeking guidance from a mentor or teacher, and connecting with the rituals and traditions that ground your spiritual path. This is not a time for reinventing the wheel; the wisdom you need already exists in established teachings. Your reading asks you to humble yourself before the accumulated knowledge of those who have walked before you, and to find comfort in the shared structures of spiritual community." },
  { name: "The Lovers", meaning: "Love, harmony, relationships. A meaningful choice is before you.", reading: "The Lovers is one of the most powerful cards in the tarot, representing not just romantic love, but the fundamental choice that shapes your destiny. When this card appears, you stand at a crossroads where a meaningful decision must be made &mdash; a choice that aligns your values with your actions. In love, this card signals deep connection, soulmate energy, and relationships that reflect your highest self. Your reading calls you to make choices from the heart, to align your decisions with your deepest values, and to trust that love &mdash; in all its forms &mdash; is the highest guide." },
  { name: "The Chariot", meaning: "Willpower, determination, victory. Push forward with confidence.", reading: "The Chariot represents the triumph of will over circumstance, the power of focused determination to overcome any obstacle. When this card appears, you are being called to harness your inner strength, to discipline your conflicting impulses, and to charge forward with unwavering confidence. Victory is not just possible; it is assured if you maintain your focus and refuse to be diverted. The Chariot's energy is about integration &mdash; bringing together opposing forces within yourself to create an unstoppable momentum. Your reading tells you that now is the time for decisive, confident action." },
  { name: "Strength", meaning: "Bravery, compassion, inner power. You are stronger than you know.", reading: "Strength is not about physical might; it is about the quiet, patient power of the heart. This card depicts a woman gently closing the jaws of a lion, symbolizing the power of compassion, patience, and inner fortitude over brute force. When Strength appears, it signals that you have the resilience and courage to face any challenge, not through domination, but through gentle persistence. This is a time for taming your inner fears and doubts with love rather than force. Your reading reminds you that true strength is the courage to be gentle, the patience to endure, and the faith to keep going." },
  { name: "The Hermit", meaning: "Soul-searching, introspection, solitude. Wisdom comes from within.", reading: "The Hermit carries the lantern of wisdom through the darkness, seeking truth in solitude. When this card appears, it calls you to withdraw from the noise of the world and to turn your attention inward. This is a sacred time of introspection, soul-searching, and inner guidance. The answers you seek will not be found in external validation or busy distraction. Your reading asks you to embrace solitude not as loneliness, but as a necessary condition for deep wisdom. The light you seek is already within you; the darkness is simply the space in which that light can be seen." },
  { name: "Wheel of Fortune", meaning: "Change, cycles, fate. Your luck is about to turn.", reading: "The Wheel of Fortune is the cosmic cycle of change, the turning of fate that reminds us that all things rise and fall in their season. When this card appears, it signals that a turning point is upon you. What has been down will rise; what has been up may fall. This is the natural order of existence, and your task is not to resist the turning, but to ride it with grace and awareness. Your reading tells you that change is not only inevitable; it is necessary for growth. The wheel is turning in your favor. Stay open to the possibilities that arise." },
  { name: "Justice", meaning: "Fairness, truth, cause and effect. The scales are balancing.", reading: "Justice holds the scales of truth and the sword of discernment, representing the universal law of cause and effect. When this card appears, it signals that a reckoning is at hand &mdash; a moment when the truth will be revealed and balance will be restored. This is a time for honesty, fairness, and accountability. Your reading calls you to examine your actions and their consequences, to take responsibility for your choices, and to trust that the universe operates with perfect justice. What you have put into motion is now returning to you." },
  { name: "The Hanged Man", meaning: "Surrender, new perspective, pause. Let go to move forward.", reading: "The Hanged Man hangs suspended from the tree of life, not in punishment, but in voluntary surrender. When this card appears, it signals that the time for action has passed, and the time for surrender has arrived. You have been pushing, striving, and forcing outcomes, and the universe is asking you to stop. This is a sacred pause, an opportunity to see your situation from an entirely new perspective. Your reading asks you to release your attachment to how things should be, to surrender to what is, and to trust that by letting go, you will find a wisdom that action alone could never reveal." },
  { name: "Death", meaning: "Transformation, endings, new beginnings. Embrace the rebirth.", reading: "Death is the most misunderstood card in the tarot. It does not signify physical death, but rather profound transformation &mdash; the end of one chapter so that another can begin. When Death appears, it signals that a major transformation is underway. Something in your life is ending: a relationship, a career, a belief system, a phase of your identity. This ending is not a punishment; it is a necessary death that makes way for new life. Your reading asks you to stop clinging to what is dying. Honor what was, release it with gratitude, and trust that whatever rises from the ashes will be more aligned with your true self." },
  { name: "Temperance", meaning: "Balance, moderation, patience. Find the middle path.", reading: "Temperance is the angel of balance, blending opposites with patience and grace. When this card appears, it signals a time for moderation, patience, and the integration of opposing forces in your life. You are being called to find the middle path between extremes &mdash; not through compromise, but through the alchemical blending of opposites into something greater. This is a time for healing, for finding equilibrium, and for trusting the process of slow, steady transformation. Your reading reminds you that the fastest path is not always the best; sometimes the most direct route is the one that honors the sacred pace of your own becoming." },
  { name: "The Devil", meaning: "Shadow self, attachment, materialism. Face what holds you back.", reading: "The Devil represents the shadow side of the human experience &mdash; the attachments, addictions, and limiting beliefs that keep you in chains. When this card appears, it brings your attention to the patterns that hold you captive. These chains are not imposed from outside; they are self-created and self-maintained. Your reading is an invitation to look honestly at what binds you: unhealthy relationships, material fixation, fear-based thinking, or addiction to comfort. The Devil's energy is intense, but its message is liberating. By naming what holds you back, you take the first step toward freedom." },
  { name: "The Tower", meaning: "Sudden change, upheaval, revelation. The fall clears the way.", reading: "The Tower is the card of sudden, dramatic upheaval &mdash; the lightning strike that destroys the old structure to make way for something new. When this card appears, it can feel frightening, but its message is ultimately liberating. The structures that are falling were built on shaky foundations. Their destruction is not a tragedy; it is a necessary clearing. The Tower's energy strips away illusions, exposes hidden truths, and creates the conditions for authentic rebuilding. Your reading asks you to surrender to the upheaval, to trust that what is falling needed to fall, and to have faith that from the rubble, you will build something stronger and more true." },
  { name: "The Star", meaning: "Hope, inspiration, serenity. The universe is guiding you.", reading: "The Star is the card of hope, inspiration, and divine guidance. After the upheaval of The Tower, The Star brings the calm of renewed faith and the serenity of cosmic connection. When this card appears, it signals a time of healing, inspiration, and spiritual renewal. The universe is guiding you, and you are being called to trust in the flow of life. This is a time for hope, for allowing your inner light to shine, and for opening yourself to the guidance that is always available. Your reading tells you that even in darkness, you are held by a benevolent universe. Trust, and let your light guide others." },
  { name: "The Moon", meaning: "Illusion, fear, the unconscious. Trust your intuition.", reading: "The Moon illuminates the shadowy realm of the unconscious, the place where fears, illusions, and hidden truths reside. When this card appears, it signals a time of uncertainty, when things are not as they seem. The path forward is not clearly lit, and your fears may rise to the surface. This is not a time for rash decisions, but for patient navigation guided by intuition rather than logic. Your reading asks you to trust your inner knowing, to face your fears with courage, and to understand that the confusion you feel is a necessary part of the journey. The light will return; for now, let your intuition be your guide." },
  { name: "The Sun", meaning: "Success, vitality, joy. You are entering a radiant period.", reading: "The Sun is the most joyful card in the tarot, representing success, vitality, and radiant happiness. When this card appears, it signals a time of clarity, achievement, and pure joy. The clouds have parted, and you are basking in the light of your own success and fulfillment. This is a time for celebration, for expressing your authentic self without fear, and for sharing your light with the world. Your reading tells you that you have overcome the challenges that stood in your way. You are entering a period of abundance, vitality, and radiant well-being. Bask in the warmth of your own brilliant light." },
  { name: "Judgement", meaning: "Reflection, reckoning, awakening. Answer the call.", reading: "Judgement is the card of awakening, reckoning, and the final call to rise to your highest potential. When this card appears, it signals a moment of profound realization &mdash; a time when you are called to account for your life, to reflect on your choices, and to answer the summons of your soul's purpose. This is not about judgment from an external source; it is about your own inner reckoning. Your reading asks you to hear the call that has been sounding in your heart, to rise from the slumber of unconscious living, and to step fully into the life you were meant to live. The time for hiding is over. Answer the call." },
  { name: "The World", meaning: "Completion, accomplishment, wholeness. A cycle is complete.", reading: "The World is the final card of the Major Arcana, representing completion, fulfillment, and the joyful culmination of a major life cycle. When this card appears, it signals that a significant chapter of your life is reaching its natural conclusion. You have learned the lessons, integrated the wisdom, and arrived at a place of wholeness. This is a moment of profound accomplishment and deep satisfaction. Your reading asks you to celebrate how far you have come, to honor the journey that has brought you to this point, and to prepare for the new cycle that awaits. One journey ends so that another can begin. You are complete, and you are ready for what comes next." },
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
      <PageTitle title="Fortune Teller" />
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <h1 className="cosmic-headline text-[34px] leading-[1.47] tracking-[-0.374px] mb-2">
        Fortune Teller
      </h1>
      <p className="text-[13px] text-[var(--color-ink-muted-48)] mb-8">
        The spirits speak through names. Enter yours to hear their message.
      </p>

      <div className="w-full max-w-2xl cosmic-card px-6 py-5 mb-5">
        <h2 className="text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-[var(--color-ink-muted-48)] mb-3 uppercase">
          Nama Anda (Your Name)
        </h2>
        <div className="flex gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleReveal()}
            placeholder="Masukkan nama Anda... (Enter your name...)"
            className="cosmic-input w-full h-10 text-[14px]"
          />
          <button
            onClick={handleReveal}
            className="cosmic-btn-primary text-[13px] whitespace-nowrap"
            disabled={!name.trim()}
          >
            Buka (Reveal)
          </button>
        </div>
      </div>

      {hasContent && reading && tarot && (
        <div className={`w-full max-w-2xl space-y-4 transition-all duration-500 ${animate ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}>
          <div className="cosmic-card px-6 py-5 text-center">
            <div className="text-[56px] mb-2">{reading.emoji}</div>
            <div className="text-[20px] font-semibold text-[var(--color-ink)] leading-[1.4]">
              &ldquo;{reading.fortune}&rdquo;
            </div>
            <div className="text-[12px] text-[var(--color-ink-muted-48)] mt-2 italic">
              a {reading.tone} reading with {reading.vibe} energy
            </div>
          </div>

          <div className="cosmic-card px-6 py-5">
            <h3 className="text-[12px] font-semibold uppercase text-[var(--color-ink-muted-48)] mb-3">Kartu Tarot (Tarot Card)</h3>
            <div className="flex items-start gap-3">
              <div className="w-12 h-16 rounded-[8px] bg-gradient-to-br from-[var(--color-primary)] to-purple-600 flex items-center justify-center text-white text-[20px] font-bold shadow-sm shrink-0">
                ?
              </div>
              <div>
                <div className="text-[17px] font-semibold text-[var(--color-ink)]">{tarot.name}</div>
                <div className="text-[13px] text-[var(--color-ink-muted-48)]">{tarot.meaning}</div>
              </div>
            </div>
          </div>

          <div className="cosmic-card px-6 py-5">
            <h3 className="text-[12px] font-semibold uppercase text-[var(--color-ink-muted-48)] mb-3">Interpretasi Tarot (Tarot Interpretation)</h3>
            {tarot.reading.split("\n\n").map((p, i) => (
              <p key={i} className="text-[14px] leading-[1.7] text-[var(--color-ink)] mb-2 last:mb-0">
                {p}
              </p>
            ))}
          </div>

          <div className="cosmic-card px-6 py-5">
            <h3 className="text-[12px] font-semibold uppercase text-[var(--color-ink-muted-48)] mb-3">Nasihat (Advice)</h3>
            <p className="text-[15px] text-[var(--color-ink)] leading-[1.5]">
              {reading.advice}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="cosmic-card px-6 py-5">
              <div className="text-[10px] uppercase text-[var(--color-ink-muted-48)] tracking-wider">Angka Keberuntungan (Lucky Number)</div>
              <div className="text-[28px] font-bold text-[var(--color-ink)] tabular-nums">{reading.luckyNumber}</div>
            </div>
            <div className="cosmic-card px-6 py-5">
              <div className="text-[10px] uppercase text-[var(--color-ink-muted-48)] tracking-wider">Warna Keberuntungan (Lucky Color)</div>
              <div className="text-[28px] font-bold text-[var(--color-ink)]">{reading.luckyColor}</div>
            </div>
          </div>

          <div className="cosmic-card px-6 py-5 text-center">
            <p className="text-[13px] text-[var(--color-ink-muted-48)] italic">
              Roh telah berbicara melalui nama (The spirits have spoken through the name) <strong className="text-[var(--color-ink)]">{name.trim()}</strong>. Kembali besok untuk ramalan baru. (Come back tomorrow for a new reading.)
            </p>
          </div>
        </div>
      )}

      {!hasContent && (
        <div className="w-full max-w-2xl space-y-4">
          <div className="cosmic-card px-6 py-5">
            <h2 className="text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-[var(--color-ink-muted-48)] mb-3 uppercase">
              Tentang Ramalan (About Fortune Telling)
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
          <div className="cosmic-card px-6 py-5">
            <p className="text-[14px] leading-[1.43] text-[var(--color-ink-muted-48)] text-center">
              Masukkan nama Anda untuk menerima ramalan yang dipersonalisasi, kartu tarot dari Arcana Mayor, angka keberuntungan, warna keberuntungan, dan nasihat spiritual untuk jalan ke depan. (Enter your name to receive a personalized fortune, a tarot card drawn from the Major Arcana, your lucky number, your lucky color, and spiritual advice for the path ahead.)
            </p>
          </div>
        </div>
      )}
          <Disclaimer type="divination" />
    </div>
  );
}
