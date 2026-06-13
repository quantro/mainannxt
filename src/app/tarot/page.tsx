"use client";

import { useState, useCallback } from "react";
import ThemeToggle from "../theme-toggle";

interface TarotCard {
  name: string;
  arcana: "major" | "minor";
  suit?: "Wands" | "Cups" | "Swords" | "Pentacles";
  number?: string;
  upright: string;
  reversed: string;
  keywords: string[];
  advice: string;
}

const MAJOR_ARCANA: TarotCard[] = [
  { name: "The Fool", arcana: "major", upright: "New beginnings, innocence, spontaneity, free spirit", reversed: "Recklessness, risk-taking, holding back, foolishness", keywords: ["beginnings", "innocence", "adventure"], advice: "Take the leap of faith. The universe catches those who trust the journey." },
  { name: "The Magician", arcana: "major", upright: "Willpower, desire, resourcefulness, skill", reversed: "Trickery, manipulation, untapped talents, waste", keywords: ["power", "creation", "skill"], advice: "You have all the tools you need. Now use them with intention." },
  { name: "The High Priestess", arcana: "major", upright: "Intuition, sacred knowledge, divine feminine, mystery", reversed: "Secrets, withdrawal, silence, repressed intuition", keywords: ["intuition", "mystery", "inner knowledge"], advice: "The answers you seek are within. Silence the noise and listen." },
  { name: "The Empress", arcana: "major", upright: "Femininity, beauty, nature, nurturing, abundance", reversed: "Creative block, dependence, emptiness, neglect", keywords: ["abundance", "nurturing", "nature"], advice: "Allow yourself to be nourished. From fullness, you can give to others." },
  { name: "The Emperor", arcana: "major", upright: "Authority, structure, stability, protection, fatherhood", reversed: "Tyranny, rigidity, lack of discipline, domination", keywords: ["authority", "structure", "stability"], advice: "Build your foundation with discipline. True power serves order, not chaos." },
  { name: "The Hierophant", arcana: "major", upright: "Wisdom, tradition, spiritual guidance, conformity", reversed: "Rebellion, unconventionality, personal beliefs, restriction", keywords: ["tradition", "wisdom", "guidance"], advice: "Seek the teacher, but question the dogma. Wisdom lives between tradition and revelation." },
  { name: "The Lovers", arcana: "major", upright: "Love, harmony, relationships, values alignment, choices", reversed: "Imbalance, misalignment, broken trust, values conflict", keywords: ["love", "harmony", "choice"], advice: "Choose from love, not fear. The right path aligns your heart and your values." },
  { name: "The Chariot", arcana: "major", upright: "Willpower, determination, victory, control, confidence", reversed: "Lack of direction, aggression, obstacles, defeat", keywords: ["willpower", "victory", "determination"], advice: "Harness your opposing forces and drive them forward as one." },
  { name: "Strength", arcana: "major", upright: "Courage, inner strength, compassion, influence", reversed: "Self-doubt, weakness, insecurity, low confidence", keywords: ["courage", "inner strength", "compassion"], advice: "True strength is gentle. You do not need to roar to be powerful." },
  { name: "The Hermit", arcana: "major", upright: "Soul-searching, introspection, solitude, inner guidance", reversed: "Isolation, loneliness, withdrawal, lost purpose", keywords: ["introspection", "solitude", "wisdom"], advice: "Retreat is not defeat. The light you find in solitude will guide others too." },
  { name: "Wheel of Fortune", arcana: "major", upright: "Change, cycles, destiny, turning point, fortune", reversed: "Bad luck, resistance to change, disruption, setbacks", keywords: ["change", "cycles", "destiny"], advice: "The wheel turns for everyone. This too shall pass — the good and the bad." },
  { name: "Justice", arcana: "major", upright: "Fairness, truth, law, accountability, cause and effect", reversed: "Injustice, dishonesty, unaccountability, imbalance", keywords: ["justice", "truth", "fairness"], advice: "What you put into the world returns to you. Act with integrity." },
  { name: "The Hanged Man", arcana: "major", upright: "Surrender, new perspective, suspension, pause", reversed: "Delay, resistance, stalling, martyrdom", keywords: ["surrender", "perspective", "pause"], advice: "Stop struggling. The answer comes when you stop forcing and start seeing." },
  { name: "Death", arcana: "major", upright: "Transformation, endings, change, transition, release", reversed: "Resistance to change, stagnation, decay, fear of endings", keywords: ["transformation", "endings", "rebirth"], advice: "Something must end so something greater can begin. Do not fear the death of what no longer serves you." },
  { name: "Temperance", arcana: "major", upright: "Balance, moderation, patience, harmony, purpose", reversed: "Imbalance, excess, discord, lack of patience", keywords: ["balance", "moderation", "harmony"], advice: "Find the middle path. Extremes exhaust you; balance sustains you." },
  { name: "The Devil", arcana: "major", upright: "Bondage, materialism, shadow self, addiction, obsession", reversed: "Release, freedom, reclaiming power, detachment", keywords: ["shadow", "bondage", "materialism"], advice: "Recognize the chains you have accepted as yours. You can walk out of this prison anytime." },
  { name: "The Tower", arcana: "major", upright: "Sudden change, upheaval, revelation, awakening", reversed: "Avoidance of disaster, fear of change, delayed destruction", keywords: ["upheaval", "revelation", "awakening"], advice: "When the tower falls, the foundations were already cracked. Build again on truth." },
  { name: "The Star", arcana: "major", upright: "Hope, inspiration, serenity, renewal, purpose", reversed: "Hopelessness, discouragement, lack of faith, despair", keywords: ["hope", "inspiration", "renewal"], advice: "After destruction comes the star. Let hope guide you through the darkness." },
  { name: "The Moon", arcana: "major", upright: "Illusion, fear, anxiety, subconscious, intuition", reversed: "Fear released, repressed emotion, clarity awakening", keywords: ["illusion", "fear", "subconscious"], advice: "Not everything is as it seems. Trust your intuition to navigate the shadows." },
  { name: "The Sun", arcana: "major", upright: "Joy, success, celebration, vitality, positivity", reversed: "Temporary sadness, burnout, dimmed enthusiasm, blocked joy", keywords: ["joy", "success", "vitality"], advice: "You have made it through the darkness. Now bask in the light you deserve." },
  { name: "Judgement", arcana: "major", upright: "Reflection, reckoning, inner calling, absolution", reversed: "Self-doubt, refusal of self-evaluation, harsh judgment", keywords: ["judgment", "rebirth", "calling"], advice: "The call is coming from inside. Answer it honestly, without judgment of yourself." },
  { name: "The World", arcana: "major", upright: "Completion, fulfillment, accomplishment, wholeness", reversed: "Incompletion, delays, stagnation, lack of closure", keywords: ["completion", "fulfillment", "wholeness"], advice: "One cycle ends, another begins. Celebrate how far you have come." },
];

const SUITS: Record<string, { name: string; element: string; meaning: string }> = {
  Wands: { name: "Wands", element: "Fire", meaning: "Creativity, action, ambition, inspiration" },
  Cups: { name: "Cups", element: "Water", meaning: "Emotions, relationships, intuition, love" },
  Swords: { name: "Swords", element: "Air", meaning: "Thought, conflict, truth, intellect" },
  Pentacles: { name: "Pentacles", element: "Earth", meaning: "Material world, work, health, prosperity" },
};

const MINOR_NUMBERS = ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Page", "Knight", "Queen", "King"];

const MINOR_MEANINGS: Record<string, Record<string, { upright: string; reversed: string; keywords: string[]; advice: string }>> = {
  Wands: {
    Ace: { upright: "New beginning, inspiration, creative spark, potential", reversed: "Delays, lack of motivation, blocked creativity", keywords: ["inspiration", "new beginning", "potential"], advice: "A spark of inspiration has arrived. Strike while the fire is hot." },
    Two: { upright: "Planning, decisions, future vision, discovery", reversed: "Indecision, fear of unknown, lack of planning", keywords: ["planning", "decisions", "vision"], advice: "The world is in your hands. Choose your direction with both courage and foresight." },
    Three: { upright: "Expansion, progress, growth, teamwork, foresight", reversed: "Obstacles, delays, frustration, lack of teamwork", keywords: ["expansion", "progress", "teamwork"], advice: "Your vision is taking shape. Trust the process and those who journey with you." },
    Four: { upright: "Celebration, stability, community, homecoming", reversed: "Lack of belonging, restlessness, cancelled plans", keywords: ["celebration", "stability", "community"], advice: "Celebrate what you have built. Joy shared is joy multiplied." },
    Five: { upright: "Competition, conflict, tension, rivalry", reversed: "Avoidance of conflict, reconciliation, peace restored", keywords: ["competition", "conflict", "tension"], advice: "Not every battle is worth fighting. Choose your battles with wisdom." },
    Six: { upright: "Victory, recognition, public acclaim, progress", reversed: "Ego, arrogance, fall from grace, lack of recognition", keywords: ["victory", "recognition", "acclaim"], advice: "Your success is well earned. Accept the recognition with humility." },
    Seven: { upright: "Challenge, competition, perseverance, resilience", reversed: "Giving up, overwhelmed, lack of focus", keywords: ["challenge", "perseverance", "resilience"], advice: "Stand your ground. The challenge before you is testing your commitment." },
    Eight: { upright: "Speed, action, progress, movement, swift change", reversed: "Delays, rush, impatience, scattered energy", keywords: ["speed", "action", "progress"], advice: "The winds of change are at your back. Move swiftly but not recklessly." },
    Nine: { upright: "Resilience, courage, persistence, boundaries", reversed: "Burnout, exhaustion, defensiveness, giving up", keywords: ["resilience", "courage", "persistence"], advice: "You have come so far. Rest if you must, but do not give up." },
    Ten: { upright: "Burden, overcommitment, responsibility, stress", reversed: "Release from burden, sharing load, lightening up", keywords: ["burden", "responsibility", "pressure"], advice: "The weight you carry is heavy, but it will not last forever. Delegate and breathe." },
    Page: { upright: "Enthusiasm, exploration, discovery, free spirit", reversed: "Lack of direction, setbacks, immaturity", keywords: ["enthusiasm", "exploration", "discovery"], advice: "Approach life with curiosity. The journey itself is the teacher." },
    Knight: { upright: "Action, adventure, impulsiveness, energy", reversed: "Recklessness, haste, burnout, delays", keywords: ["action", "adventure", "energy"], advice: "Charge forward with passion, but know when to slow down and plan." },
    Queen: { upright: "Warmth, determination, confidence, independence", reversed: "Jealousy, self-doubt, insecurity, imbalance", keywords: ["warmth", "determination", "independence"], advice: "Lead with both fire and grace. Your confidence inspires those around you." },
    King: { upright: "Leadership, vision, entrepreneur, honor", reversed: "Demanding, overbearing, ruthless, inflexible", keywords: ["leadership", "vision", "entrepreneur"], advice: "Lead with vision and integrity. True leadership is service, not domination." },
  },
  Cups: {
    Ace: { upright: "Love, new relationships, emotional overflow, compassion", reversed: "Blocked emotions, emptiness, loneliness, withheld love", keywords: ["love", "new beginnings", "emotion"], advice: "Your heart is opening. Let love flow freely without conditions." },
    Two: { upright: "Partnership, unity, connection, mutual attraction", reversed: "Separation, imbalance, broken connection, withdrawal", keywords: ["partnership", "unity", "connection"], advice: "When two hearts align, the whole becomes greater than the sum of its parts." },
    Three: { upright: "Celebration, friendship, community, gatherings", reversed: "Isolation, loneliness, canceled plans, overindulgence", keywords: ["celebration", "friendship", "community"], advice: "Rejoice with those you love. Shared joy deepens every bond." },
    Four: { upright: "Meditation, contemplation, apathy, reevaluation", reversed: "New perspective, readiness, action, awakening", keywords: ["meditation", "apathy", "reevaluation"], advice: "Sometimes you stare so long at what you want that you miss what you already have." },
    Five: { upright: "Loss, grief, regret, disappointment, sorrow", reversed: "Acceptance, moving on, release of grief, finding peace", keywords: ["loss", "grief", "sorrow"], advice: "Grief is the price of love. Honor your sorrow, then let it teach you." },
    Six: { upright: "Nostalgia, memories, childhood, innocence, reunion", reversed: "Stuck in past, unrealistic nostalgia, moving forward", keywords: ["nostalgia", "memories", "reunion"], advice: "The past holds treasures, but do not live in its reflection. The present is also a gift." },
    Seven: { upright: "Fantasy, choices, illusion, options, wishful thinking", reversed: "Clarity, focus, realistic goals, narrowing choices", keywords: ["fantasy", "choices", "illusions"], advice: "Not every glittering option is real. Ground your dreams in what is possible." },
    Eight: { upright: "Moving on, leaving behind, withdrawal, seeking truth", reversed: "Fear of moving on, clinging, aimless drifting", keywords: ["moving on", "withdrawal", "seeking truth"], advice: "Sometimes walking away is the bravest thing you can do." },
    Nine: { upright: "Contentment, satisfaction, abundance, wish fulfilled", reversed: "Dissatisfaction, envy, unfulfilled wishes, emptiness", keywords: ["contentment", "abundance", "gratitude"], advice: "You have everything you need. Gratitude turns what you have into enough." },
    Ten: { upright: "Divine love, fulfillment, harmony, lasting happiness", reversed: "Broken home, disharmony, family conflict, separation", keywords: ["fulfillment", "harmony", "divine love"], advice: "Love is the foundation of all lasting happiness. Nurture it above all else." },
    Page: { upright: "Creative opportunity, intuitive messages, curiosity", reversed: "Creative blocks, missed opportunities, immaturity", keywords: ["creativity", "intuition", "opportunity"], advice: "A message is coming. Stay open, especially to what arrives through feeling, not logic." },
    Knight: { upright: "Romance, charm, proposal, imagination, beauty", reversed: "Jealousy, moodiness, unrealistic expectations, fantasy", keywords: ["romance", "charm", "proposal"], advice: "Let yourself be swept away, but keep one foot on the ground." },
    Queen: { upright: "Emotional security, compassion, nurturing, intuition", reversed: "Codependency, insecurity, emotional volatility, smothering", keywords: ["compassion", "nurturing", "intuition"], advice: "Your emotional depth is your superpower. Nurture others, but not at your own expense." },
    King: { upright: "Emotional balance, compassion, wisdom, diplomacy", reversed: "Emotional manipulation, moodiness, volatility, coldness", keywords: ["compassion", "wisdom", "diplomacy"], advice: "Rule your emotional kingdom with wisdom. Feel deeply, but act with clarity." },
  },
  Swords: {
    Ace: { upright: "Clarity, mental breakthrough, truth, new idea", reversed: "Confusion, misunderstanding, noise, clouded judgment", keywords: ["clarity", "truth", "breakthrough"], advice: "The truth cuts through illusion. Speak it, even if your voice shakes." },
    Two: { upright: "Difficult decisions, stalemate, choices, weighing options", reversed: "Lack of clarity, indecision, information overload", keywords: ["decisions", "stalemate", "choices"], advice: "You cannot see all sides at once. Choose a direction and trust your sight to adjust." },
    Three: { upright: "Heartbreak, grief, sorrow, betrayal, pain", reversed: "Healing, recovery, forgiveness, releasing pain", keywords: ["heartbreak", "grief", "betrayal"], advice: "The wound is real. Allow yourself to grieve before you try to heal." },
    Four: { upright: "Rest, restoration, meditation, contemplation, retreat", reversed: "Restlessness, burnout, exhaustion, lack of renewal", keywords: ["rest", "restoration", "contemplation"], advice: "Your mind needs stillness. Rest is not laziness; it is preparation." },
    Five: { upright: "Conflict, defeat, loss, bitterness, humiliation", reversed: "Reconciliation, moving on, forgiveness, past conflicts", keywords: ["conflict", "defeat", "loss"], advice: "Not every battle is yours to win. Sometimes letting go is the true victory." },
    Six: { upright: "Transition, moving forward, leaving behind, travel", reversed: "Resistance to change, baggage, unfinished business", keywords: ["transition", "moving forward", "travel"], advice: "You are crossing into calmer waters. Leave what does not serve you on the shore." },
    Seven: { upright: "Strategy, deception, cunning, stealth, planning", reversed: "Honesty, openness, acknowledging deception, coming clean", keywords: ["strategy", "deception", "cunning"], advice: "Not everyone plays fair. Use your mind wisely, but keep your integrity intact." },
    Eight: { upright: "Restriction, bondage, helplessness, negative thoughts", reversed: "Liberation, empowerment, new perspective, release", keywords: ["restriction", "bondage", "powerlessness"], advice: "The prison is in your mind. The key is in your perception." },
    Nine: { upright: "Anxiety, worry, fear, nightmares, overwhelm", reversed: "Facing fears, hope, overcoming anxiety, peace returning", keywords: ["anxiety", "worry", "fear"], advice: "Fear is a liar wearing a convincing mask. Look beneath fear and find the truth." },
    Ten: { upright: "Rock bottom, crisis, betrayal, painful ending", reversed: "Recovery, healing, lessons learned, survival", keywords: ["rock bottom", "crisis", "ending"], advice: "When you hit bottom, the only direction is up. This too shall pass." },
    Page: { upright: "New ideas, curiosity, communication, intellectual pursuit", reversed: "Gossip, hasty words, miscommunication, cynicism", keywords: ["ideas", "curiosity", "communication"], advice: "Your voice carries power. Speak your truth, but choose your words with care." },
    Knight: { upright: "Ambition, action, determination, charge forward", reversed: "Recklessness, aggression, burnout, impulsiveness", keywords: ["ambition", "action", "determination"], advice: "Charge forward with purpose, but remember that not every battle needs a soldier." },
    Queen: { upright: "Perception, clarity, independent thought, truth", reversed: "Coldness, bitterness, loneliness, harsh judgment", keywords: ["clarity", "perception", "truth"], advice: "Seek the truth with compassion. Clarity without kindness is just cruelty." },
    King: { upright: "Authority, truth, justice, intellect, moral clarity", reversed: "Misuse of power, manipulation, coldness, tyranny", keywords: ["authority", "truth", "intellect"], advice: "Lead with your mind and your conscience. True authority serves justice." },
  },
  Pentacles: {
    Ace: { upright: "New opportunity, prosperity, abundance, growth", reversed: "Missed opportunity, lack of planning, scarcity mindset", keywords: ["opportunity", "prosperity", "abundance"], advice: "A seed of prosperity is offered. Plant it with care and patience." },
    Two: { upright: "Balance, adaptation, resource management, juggling", reversed: "Overextension, imbalance, disorganization, chaos", keywords: ["balance", "adaptation", "resources"], advice: "Life is a balancing act. Prioritize what matters most and release the rest." },
    Three: { upright: "Teamwork, collaboration, skill building, mastery", reversed: "Lack of teamwork, poor quality, mediocre standards", keywords: ["teamwork", "collaboration", "mastery"], advice: "No masterpiece was ever built alone. Collaborate and learn from others." },
    Four: { upright: "Security, conservation, stability, saving, guarding", reversed: "Greed, materialism, possessiveness, hoarding", keywords: ["security", "stability", "saving"], advice: "Security is good; hoarding is fear. Save wisely, but do not let fear lock your abundance." },
    Five: { upright: "Financial loss, poverty, isolation, insecurity", reversed: "Recovery, spiritual wealth, finding help, hope", keywords: ["loss", "poverty", "insecurity"], advice: "When material wealth fails, you discover what you are truly made of." },
    Six: { upright: "Charity, generosity, giving, receiving, sharing", reversed: "Strings attached charity, inequality, debt, dependence", keywords: ["generosity", "charity", "sharing"], advice: "Give freely without strings. True generosity expects nothing in return." },
    Seven: { upright: "Patience, investment, planning, long-term vision", reversed: "Impatience, poor planning, short-term thinking", keywords: ["patience", "investment", "planning"], advice: "What you plant today will not bear fruit tomorrow. Be patient with the process." },
    Eight: { upright: "Apprenticeship, skill development, dedication, excellence", reversed: "Perfectionism, lack of skill, poor quality, shortcuts", keywords: ["skill", "dedication", "craftsmanship"], advice: "Mastery is the accumulation of small, consistent efforts. Keep working." },
    Nine: { upright: "Luxury, self-sufficiency, financial independence, comfort", reversed: "Overspending, dependence, financial insecurity, loneliness", keywords: ["luxury", "self-sufficiency", "abundance"], advice: "You have built something to be proud of. Enjoy it, but do not forget those who helped." },
    Ten: { upright: "Wealth, legacy, inheritance, family prosperity", reversed: "Financial loss, family disputes, bankruptcy, instability", keywords: ["wealth", "legacy", "prosperity"], advice: "True wealth is not what you leave for people, but what you leave in people." },
    Page: { upright: "Ambition, diligence, learning, new skills, practicality", reversed: "Lack of progress, laziness, missed deadlines, immaturity", keywords: ["ambition", "diligence", "learning"], advice: "Every master was once a beginner. Stay curious and committed to learning." },
    Knight: { upright: "Hard work, responsibility, diligence, reliability", reversed: "Laziness, irresponsibility, burnout, workaholism", keywords: ["hard work", "responsibility", "reliability"], advice: "Slow and steady wins the race. Your reliability is your greatest asset." },
    Queen: { upright: "Nurturing, practicality, abundance, security, grounding", reversed: "Neglect, financial insecurity, smothering, dependence", keywords: ["nurturing", "practicality", "abundance"], advice: "Create a sanctuary of stability and warmth. Generosity flows from security." },
    King: { upright: "Abundance, leadership, success, financial mastery", reversed: "Greed, materialism, stubbornness, financial mismanagement", keywords: ["abundance", "success", "leadership"], advice: "Use your success to create more than money. Leave a legacy of wisdom." },
  },
};

function buildDeck(): TarotCard[] {
  const deck = [...MAJOR_ARCANA];
  for (const suit of ["Wands", "Cups", "Swords", "Pentacles"] as const) {
    for (const num of MINOR_NUMBERS) {
      const m = MINOR_MEANINGS[suit][num];
      if (!m) continue;
      deck.push({
        name: `${num} of ${suit}`,
        arcana: "minor",
        suit,
        number: num,
        upright: m.upright,
        reversed: m.reversed,
        keywords: m.keywords,
        advice: m.advice,
      });
    }
  }
  return deck;
}

const DECK = buildDeck();

type Spread = "single" | "three" | "celtic";

const SPREADS: Record<Spread, { label: string; positions: string[] }> = {
  single: { label: "Single Card", positions: ["Your Energy"] },
  three: { label: "Three Card", positions: ["Past", "Present", "Future"] },
  celtic: { label: "Celtic Cross", positions: ["Present", "Challenge", "Past", "Future", "Above (Goal)", "Below (Foundation)", "Advice", "External Influences", "Hopes & Fears", "Outcome"] },
};

export default function TarotPage() {
  const [spread, setSpread] = useState<Spread>("single");
  const [cards, setCards] = useState<{ card: TarotCard; reversed: boolean }[]>([]);
  const [flipped, setFlipped] = useState<Set<number>>(new Set());
  const [dealPhase, setDealPhase] = useState(false);
  const [phaseComplete, setPhaseComplete] = useState(false);

  const deal = useCallback(() => {
    if (dealPhase) return;
    setDealPhase(true);
    setPhaseComplete(false);
    setFlipped(new Set());

    const count = SPREADS[spread].positions.length;
    const shuffled = [...DECK].sort(() => Math.random() - 0.5).slice(0, count);
    const dealt = shuffled.map((c) => ({ card: c, reversed: Math.random() < 0.3 }));
    setCards(dealt);
    setDealPhase(false);
    setPhaseComplete(true);
  }, [spread, dealPhase]);

  function flipCard(i: number) {
    if (phaseComplete) {
      setFlipped((prev) => {
        const next = new Set(prev);
        next.add(i);
        return next;
      });
    }
  }

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-12">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <h1 className="apple-headline text-[34px] leading-[1.47] tracking-[-0.374px] mb-2">
        Tarot Reading
      </h1>
      <p className="text-[13px] text-[var(--color-ink-muted-48)] mb-8 text-center max-w-lg">
        A full 78-card tarot deck. Choose your spread and shuffle the cards.
      </p>

      <div className="w-full max-w-2xl apple-card px-6 py-5 mb-5">
        <div className="flex gap-2">
          {(Object.entries(SPREADS) as [Spread, typeof SPREADS[Spread]][]).map(([key, s]) => (
            <button
              key={key}
              onClick={() => { setSpread(key); setCards([]); setFlipped(new Set()); setPhaseComplete(false); }}
              className={`flex-1 px-3 py-2.5 rounded-[11px] text-[13px] font-semibold transition-all ${
                spread === key
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-[var(--color-surface-pearl)] text-[var(--color-ink-muted-48)] hover:brightness-95"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {!phaseComplete && (
        <button
          onClick={deal}
          disabled={dealPhase}
          className="apple-btn-primary h-12 px-10 text-[15px] font-semibold disabled:opacity-40"
        >
          {dealPhase ? "Shuffling..." : "Shuffle & Deal"}
        </button>
      )}

      {cards.length > 0 && (
        <div className="w-full max-w-4xl space-y-4 mt-6">
          <div className={`grid gap-4 ${
            spread === "celtic" ? "grid-cols-1 sm:grid-cols-2" : spread === "three" ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-1"
          }`}>
            {cards.map(({ card, reversed }, i) => {
              const isFlipped = flipped.has(i);
              return (
                <div key={i} className="flex flex-col items-center">
                  <div
                    className="w-[160px] h-[240px] rounded-[12px] cursor-pointer select-none"
                    style={{ perspective: "600px" }}
                    onClick={() => flipCard(i)}
                  >
                    <div
                      className="w-full h-full relative transition-transform duration-600"
                      style={{
                        transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                        transformStyle: "preserve-3d",
                        transition: "transform 0.6s ease",
                      }}
                    >
                      {/* Back */}
                      <div
                        className="absolute inset-0 rounded-[12px] flex items-center justify-center"
                        style={{
                          backfaceVisibility: "hidden",
                          background: "linear-gradient(135deg, #2a1a4e, #1a0a3e)",
                          border: "2px solid #6b4fa0",
                        }}
                      >
                        <span className="text-[28px] opacity-60">✦</span>
                      </div>
                      {/* Front */}
                      <div
                        className="absolute inset-0 rounded-[12px] p-3 flex flex-col justify-center"
                        style={{
                          backfaceVisibility: "hidden",
                          transform: "rotateY(180deg)",
                          background: "#faf5eb",
                          border: "2px solid #d4c5a9",
                          color: "#1a1a1a",
                        }}
                      >
                        <div className="text-[11px] font-semibold text-center leading-tight">
                          {card.name}
                        </div>
                        <div className="text-[9px] text-center text-[#8b7355] mt-1">
                          {card.arcana === "major" ? "Major Arcana" : `${card.suit} (${SUITS[card.suit!]?.element ?? ""})`}
                        </div>
                        {reversed && isFlipped && (
                          <div className="text-[8px] text-center text-red-500 font-semibold mt-1 uppercase">Reversed</div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-[11px] text-[var(--color-ink-muted-48)] mt-1.5 font-semibold">
                    {SPREADS[spread].positions[i]}
                  </div>
                </div>
              );
            })}
          </div>

          {Array.from(flipped).sort().map((i) => {
            const { card, reversed } = cards[i];
            const meaning = reversed ? card.reversed : card.upright;
            return (
              <div key={i} className="apple-card px-6 py-5">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <h3 className="text-[17px] font-bold text-[var(--color-ink)]">{card.name}</h3>
                    <div className="text-[11px] text-[var(--color-ink-muted-48)]">
                      {SPREADS[spread].positions[i]}
                      {reversed && <span className="text-red-500 ml-2">Reversed</span>}
                    </div>
                  </div>
                  <div className="text-[11px] text-[var(--color-ink-muted-48)] text-right">
                    <div>{card.arcana === "major" ? "Major Arcana" : card.suit}</div>
                  </div>
                </div>
                <p className="text-[13px] leading-[1.6] text-[var(--color-ink)] mt-2"><strong>Meaning:</strong> {meaning}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {card.keywords.map((kw) => (
                    <span key={kw} className="px-2 py-0.5 rounded-[6px] text-[10px] bg-[var(--color-surface-pearl)] text-[var(--color-ink-muted-48)]">{kw}</span>
                  ))}
                </div>
                <p className="text-[13px] leading-[1.6] text-[var(--color-ink)] mt-2 italic">&ldquo;{card.advice}&rdquo;</p>
              </div>
            );
          })}
        </div>
      )}

      {cards.length === 0 && !dealPhase && (
        <div className="w-full max-w-2xl apple-card px-6 py-5 mt-4">
          <h2 className="text-[12px] font-semibold uppercase text-[var(--color-ink-muted-48)] mb-2">About Tarot</h2>
          <p className="text-[13px] leading-[1.6] text-[var(--color-ink-muted-48)]">
            The tarot deck contains 78 cards: 22 Major Arcana representing life's major archetypal lessons, and 56 Minor Arcana divided into four suits — Wands (fire, creativity), Cups (water, emotions), Swords (air, intellect), and Pentacles (earth, material). Choose a spread above and shuffle to begin.
          </p>
        </div>
      )}
    </div>
  );
}
