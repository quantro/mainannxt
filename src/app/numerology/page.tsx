"use client";

import { useMemo, useState } from "react";
import ThemeToggle from "../theme-toggle";

interface NumberMeaning {
  number: string;
  title: string;
  keywords: string[];
  positive: string;
  negative: string;
  description: string;
  reading: string;
  career: string[];
  love: string;
}

const NUMBERS: NumberMeaning[] = [
  {
    number: "1", title: "The Pioneer",
    keywords: ["independent", "ambitious", "original", "determined"],
    positive: "Natural-born leader with a pioneering spirit. Driven to forge your own path and inspire others.",
    negative: "Can be arrogant, bossy, and overly competitive. Tendency to isolate when challenged.",
    description: "The number of creation and beginnings. Ones are innovators who refuse to follow the crowd. You have the drive and determination to achieve anything you set your mind to. Your independent spirit is your greatest asset, but learning to collaborate with others is your life lesson.",
    reading: "Your Life Path is 1, the number of the pioneer, the origin, the spark that ignites all creation. You came into this world with an independent spirit that cannot be contained. Your path is one of leadership, innovation, and self-discovery. You are not meant to follow anyone else's blueprint; you are here to draw your own.\n\nThe core lesson of the 1 path is learning to stand in your own power without isolating yourself. Your independence is your greatest strength, but it can also be a shield that keeps connection at a distance. The most fulfilled ones learn that true leadership is not about doing everything alone, but about inspiring others to join your vision. Your challenge is to develop the confidence to lead without the arrogance that can push people away.\n\nIn love, you need a partner who respects your autonomy and doesn't try to dim your light. You thrive in relationships where both individuals maintain their independence while choosing to come together. Your career path rewards initiative, originality, and the courage to take risks. You are the entrepreneur, the innovator, the one who says 'what if' when everyone else says 'it can't be done.' Your life's work is to forge paths that others will follow, and to learn that the truest form of leadership is service.",
    career: ["Entrepreneur", "Executive", "Inventor", "Athlete", "Director"],
    love: "You need a partner who respects your independence while providing a warm, supportive home base."
  },
  {
    number: "2", title: "The Diplomat",
    keywords: ["cooperative", "intuitive", "sensitive", "diplomatic"],
    positive: "Natural peacemaker with extraordinary intuition. Eerily good at reading a room and mediating conflict.",
    negative: "Chronic people-pleasing and passive-aggression. Tendency to suppress your own needs.",
    description: "The number of balance and harmony. Twos are the mediators of the world, gifted with empathy and the ability to see all sides of any situation. Your diplomatic nature makes you a cherished friend and partner, but don't lose yourself in the service of others.",
    reading: "Your Life Path is 2, the number of the diplomat, the peacemaker, the one who holds the space for others to connect. You came here to build bridges, to harmonize opposing forces, and to teach the world the power of gentle strength. Your sensitivity is not a weakness; it is your superpower.\n\nThe 2 path is about partnership and connection. You are naturally attuned to the needs and feelings of others, often sensing what people need before they even know it themselves. This gift makes you an extraordinary friend, partner, and mediator. But the shadow of the 2 is losing yourself in others. Your challenge is to maintain your own center while being present for those around you.\n\nIn love, you are the ultimate partner &mdash; loyal, supportive, and deeply committed to creating harmony. You need a relationship where your contributions are reciprocated and your sensitivity is cherished, not exploited. Your career path draws you toward roles that require collaboration, intuition, and diplomacy: counseling, mediation, design, human resources, and any field where your ability to read people and situations creates value. Your life's work is to show the world that true strength lies not in domination, but in connection.",
    career: ["Counselor", "Mediator", "Diplomat", "Designer", "Psychologist"],
    love: "You thrive in harmonious, balanced relationships. Partnership is essential to your happiness."
  },
  {
    number: "3", title: "The Creative",
    keywords: ["expressive", "optimistic", "creative", "charismatic"],
    positive: "Blessed with creative talents and natural charisma. Your gift for self-expression brings joy to everyone around you.",
    negative: "Can be scattered, superficial, and emotionally avoidant. Tendency to leave projects unfinished.",
    description: "The number of self-expression and joy. Threes are the artists and entertainers of the numerology chart. Your optimistic outlook and creative talents make life feel like an adventure. Your challenge is to channel your abundant energy into focused, meaningful creation.",
    reading: "Your Life Path is 3, the number of the creator, the communicator, the one who brings joy and expression into the world. You are here to create, to inspire, and to remind people that life is meant to be enjoyed. Your optimism is infectious, and your creative energy can light up any room.\n\nThe 3 path is about self-expression in all its forms. You have a natural gift for words, art, music, or performance &mdash; any medium that allows you to channel the creative fire within you. Your challenge is focus. With so many ideas and inspirations flowing through you, it can be hard to commit to one path and see it through. The most fulfilled threes learn to discipline their creativity without losing their spark.\n\nIn love, you are charming, fun, and naturally magnetic. But your partner may need patience with your scattered energy and social nature. You need someone who gives you freedom to express yourself while providing the grounding that helps you channel your gifts. Your career thrives in creative fields: writing, performing, design, marketing, education, or any role that lets you communicate and inspire. Your life's work is to create beauty and meaning in a world that desperately needs both.",
    career: ["Writer", "Artist", "Performer", "Designer", "Public Speaker"],
    love: "You're drawn to someone who appreciates your creative spirit and gives you the freedom to shine."
  },
  {
    number: "4", title: "The Builder",
    keywords: ["practical", "disciplined", "organized", "reliable"],
    positive: "The foundation-builder of the world. Your practical approach, strong work ethic, and organizational skills create lasting structures.",
    negative: "Can be rigid, stubborn, and overly serious. Tendency to resist change and new ideas.",
    description: "The number of stability and order. Fours are the bedrock of society — dependable, hardworking, and methodical. You find security in routine and take pride in building systems that last. Your life lesson is learning to embrace flexibility without losing your grounding.",
    reading: "Your Life Path is 4, the number of the builder, the foundation, the one who turns dreams into structures that last. You are here to create order out of chaos, to build systems that serve humanity, and to teach the value of discipline and persistence. Your reliability is legendary, and your work ethic is unmatched.\n\nThe 4 path is about creating stability in a world that often feels unstable. You have a gift for organization, planning, and methodical execution. While others dream, you build. Your challenge is rigidity. Your love of structure can become a prison, and your resistance to change can hold you back from growth. The most fulfilled fours learn that true stability comes not from controlling everything, but from being adaptable enough to weather any storm.\n\nIn love, you are loyal, devoted, and unwavering. You express love through acts of service and by creating a secure foundation. You need a partner who appreciates your dependability and helps you loosen up when you're too tightly wound. Your career thrives in fields that reward precision and structure: architecture, engineering, accounting, project management, law, and any craft that requires mastery of detail. Your life's work is to build the scaffolding upon which civilization rests.",
    career: ["Architect", "Engineer", "Accountant", "Project Manager", "Surgeon"],
    love: "You value loyalty and stability above all. Once committed, you're a devoted and faithful partner for life."
  },
  {
    number: "5", title: "The Freedom Seeker",
    keywords: ["adventurous", "versatile", "curious", "dynamic"],
    positive: "Dynamic and freedom-loving, you thrive on change and new experiences. Your versatility and curiosity lead to exciting discoveries.",
    negative: "Can be restless, impulsive, and commitment-phobic. Tendency to avoid responsibility.",
    description: "The number of freedom and change. Fives sit at the center of the single-digit sequence — the pivot point of the entire system. You are adaptable, resourceful, and born for adventure. Your purpose is to experience life in all its diversity and share those lessons with others.",
    reading: "Your Life Path is 5, the number of the adventurer, the freedom-seeker, the one who lives by their own rules. You sit at the center of the numerological wheel, and your energy is the fulcrum upon which everything balances. You are here to experience life in all its richness, to break free from limitations, and to teach others the value of freedom.\n\nThe 5 path is about embracing change and variety. You are naturally curious, adaptable, and drawn to new experiences like a moth to flame. Your restlessness is not a flaw; it is the engine of your evolution. Your challenge is commitment. Your love of freedom can make it difficult to stay in one place, one relationship, or one career long enough to see it through. The most fulfilled fives learn that true freedom is not the absence of commitment, but the choice to commit consciously.\n\nIn love, you need a partner who understands that your need for space is not a rejection. You thrive in relationships that have breathing room &mdash; partnerships based on trust rather than control. Your career path is as varied as your interests: travel, sales, journalism, entrepreneurship, entertainment, or any field that offers variety and stimulation. Your life's work is to experience the world fully and to bring the wisdom of your adventures back to share with others.",
    career: ["Travel Writer", "Journalist", "Sales", "Adventurer", "Entrepreneur"],
    love: "You need a partner who understands your need for freedom and is ready for an exciting, unpredictable journey."
  },
  {
    number: "6", title: "The Nurturer",
    keywords: ["caring", "responsible", "protective", "loving"],
    positive: "Natural caregiver with a deep sense of responsibility. Your nurturing nature and desire for harmony create loving environments.",
    negative: "Can be a martyr, overly critical of others, and prone to worry. Tendency to take on everyone's problems.",
    description: "The number of love and service. Sixes are the heart of the numerology chart — compassionate, family-oriented, and devoted to creating harmony. You are a natural healer and counselor, drawn to service. Your challenge is to care for others without neglecting yourself.",
    reading: "Your Life Path is 6, the number of the nurturer, the healer, the one who holds the space for love to grow. You are here to serve, to heal, and to create beauty and harmony in your home and community. Your love is a force of nature, and your devotion to those you care for knows no bounds.\n\nThe 6 path is about responsibility and care. You are a natural parent, teacher, and counselor, drawn to roles where you can nurture and support others. You have an eye for beauty and a gift for creating warm, welcoming environments. Your challenge is learning that you cannot pour from an empty cup. Your tendency to prioritize everyone else's needs before your own can lead to burnout and resentment. The most fulfilled sixes learn that self-care is not selfish; it is the foundation of sustainable service.\n\nIn love, you are the ultimate caregiver &mdash; devoted, romantic, and deeply committed to creating a harmonious home. You need a partner who reciprocates your devotion and who doesn't take your generosity for granted. Your career path calls you toward service: teaching, healthcare, counseling, social work, interior design, or any field where you can care for others and create beauty. Your life's work is to love without losing yourself, and to heal others while remaining whole yourself.",
    career: ["Teacher", "Counselor", "Healthcare", "Social Worker", "Interior Designer"],
    love: "You're a devoted partner who puts family first. Your love is expressed through acts of service and care."
  },
  {
    number: "7", title: "The Seeker",
    keywords: ["analytical", "introspective", "spiritual", "wise"],
    positive: "Deep thinker and spiritual seeker. Your analytical mind and intuition lead you to profound truths and understanding.",
    negative: "Can be isolated, overly skeptical, and emotionally distant. Tendency to withdraw from the world.",
    description: "The number of wisdom and contemplation. Sevens are the philosophers and mystics of numerology — gifted with a penetrating mind that seeks to understand the deeper meaning of existence. Your journey is one of inner discovery. Trust your intuition; it rarely steers you wrong.",
    reading: "Your Life Path is 7, the number of the seeker, the philosopher, the one who questions everything. You are here to dive beneath the surface of life and discover the hidden truths that others miss. Your mind is your greatest gift &mdash; analytical, intuitive, and capable of penetrating insight.\n\nThe 7 path is about the search for meaning. You are naturally drawn to philosophy, science, spirituality, or any field that asks the big questions. You need time alone to process and reflect, and your introversion is not weakness; it is the wellspring of your wisdom. Your challenge is isolation. Your comfort with solitude can become a wall that keeps connection out. The most fulfilled sevens learn that wisdom is not meant to be hoarded, but shared.\n\nIn love, you need a partner who respects your need for space and can engage with you on an intellectual and spiritual level. Small talk won't satisfy you; you crave deep conversation and meaningful connection. Your career path leads you toward research, science, academia, technology, philosophy, or any field that rewards deep thinking and analysis. Your life's work is to seek truth and, having found it, to share it in a way that illuminates the path for others.",
    career: ["Scientist", "Philosopher", "Researcher", "Data Analyst", "Spiritual Teacher"],
    love: "You need a partner who respects your need for solitude and can engage with you on an intellectual level."
  },
  {
    number: "8", title: "The Powerhouse",
    keywords: ["ambitious", "authoritative", "successful", "executive"],
    positive: "Natural-born achiever with executive abilities. Your ambition, business acumen, and determination lead to material success.",
    negative: "Can be workaholic, overly materialistic, and domineering. Tendency to measure worth by achievement.",
    description: "The number of power and abundance. Eights are the CEOs of numerology — born to lead, organize, and build wealth. You have the vision to see the big picture and the discipline to execute. Your purpose is to achieve mastery in the material world while maintaining your integrity.",
    reading: "Your Life Path is 8, the number of the powerhouse, the executive, the one who builds empires. You are here to master the material world, to create abundance, and to use your power for the greater good. Your drive and ambition are unmatched, and your ability to execute on a grand scale sets you apart.\n\nThe 8 path is about achievement and authority. You have a natural understanding of power dynamics, business, and systems. You see the big picture and have the discipline to make it real. Your challenge is the shadow side of power: the temptation to measure your worth by your wealth or status, and the tendency to prioritize work over relationships. The most fulfilled eights learn that true abundance is not just financial; it includes love, health, and spiritual fulfillment.\n\nIn love, you need a partner who is your equal &mdash; someone ambitious enough to understand your drive, but grounded enough to remind you what truly matters. Your career is your natural arena: business, finance, law, politics, real estate, or any leadership role where your strategic mind and executive ability can shine. Your life's work is to build something that outlasts you, and to learn that the truest measure of success is not what you accumulate, but what you contribute.",
    career: ["CEO", "Financier", "Real Estate", "Judge", "Politician"],
    love: "You seek a partner who is equally ambitious and understands the demands of your drive for success."
  },
  {
    number: "9", title: "The Humanitarian",
    keywords: ["compassionate", "idealistic", "wise", "generous"],
    positive: "Old soul with a humanitarian spirit. Your compassion, wisdom, and desire to serve make the world a better place.",
    negative: "Can be self-sacrificing to a fault, prone to letting go too easily, and struggle with boundaries.",
    description: "The number of completion and universal love. Nines are the old souls of numerology — carrying the wisdom of all the numbers that came before. You are here to serve humanity, to heal, and to let go of what no longer serves you. Your compassion is your superpower.",
    reading: "Your Life Path is 9, the number of the humanitarian, the old soul, the one who carries the wisdom of the ages. You are the completion of the numerical cycle, and your path encompasses the lessons of all the numbers that came before you. You are here to serve humanity, to heal collective wounds, and to teach the power of forgiveness and release.\n\nThe 9 path is about universal love and compassion. You have a depth of wisdom that feels ancient, and your empathy extends beyond your immediate circle to embrace all of humanity. You are a natural philanthropist, artist, or healer. Your challenge is learning to let go. Nines carry the weight of the world, and your tendency to hold onto past hurts, resentments, and attachments can weigh you down. The most fulfilled nines learn that forgiveness is not for the other person; it is the gift you give yourself.\n\nIn love, you need a partner who shares your ideals and understands your need to make a difference. You are not here for superficial relationships; you seek soul-deep connection. Your career path calls you toward nonprofit work, the arts, healing professions, humanitarian efforts, or any field where you can serve the greater good. Your life's work is to love unconditionally, to serve without expectation, and to leave the world a little more whole than you found it.",
    career: ["Nonprofit Leader", "Artist", "Healer", "Humanitarian", "Philosopher"],
    love: "You need a partner who shares your ideals and understands your need to make a difference in the world."
  },
  {
    number: "11", title: "The Intuitive Illuminator",
    keywords: ["visionary", "inspirational", "intuitive", "enlightened"],
    positive: "Heightened intuition and deep insight. You're a channel for creative inspiration and spiritual guidance.",
    negative: "Can be anxious, overwhelmed by sensitivity, and prone to nervous tension and self-doubt.",
    description: "The first master number, and the most intense. Eleven is 2 on overdrive — psychically tuned in to a degree that can be destabilizing. Visionaries, artists, and spiritual teachers who also tend to be anxious wrecks. Your gift is inspiration; your challenge is grounding that energy.",
    reading: "Your Life Path is 11, the first master number, the Intuitive Illuminator. You carry the energy of 2 amplified to its highest octave, and your sensitivity is both your greatest gift and your greatest challenge. You are here to inspire, to illuminate, and to serve as a channel for higher wisdom. Your intuition is not just strong; it is your primary navigational system.\n\nWalking the 11 path means living with open channels. You pick up energies, insights, and inspirations that others simply cannot perceive. You are the visionary, the artist, the spiritual teacher whose ideas seem to come from somewhere beyond. Your challenge is managing the intensity. The same heightened perception that produces genius can produce anxiety, self-doubt, and overwhelm. The most fulfilled 11s learn the discipline of grounding: meditation, nature, physical exercise, and the courage to set energetic boundaries.\n\nIn love, you need a partner who can handle your intensity and who believes in your visions even when you doubt them yourself. You need someone patient and grounded who can be your anchor when your energy spirals. Your career path demands that you follow your inspiration, whether that leads to art, teaching, healing, innovation, or spiritual leadership. Your life's work is to channel the divine inspiration that flows through you into forms that uplift humanity, and to learn that your sensitivity is not a curse to be managed, but a gift to be offered.",
    career: ["Spiritual Teacher", "Artist", "Innovator", "Healer", "Writer"],
    love: "You need a patient, grounding partner who can handle your intensity and believe in your visions."
  },
  {
    number: "22", title: "The Master Builder",
    keywords: ["visionary", "practical", "powerful", "architect"],
    positive: "Combines the sensitivity of 2 with the structural ability of 4, amplified. You can build things that outlast you.",
    negative: "The gap between vision and execution can feel crushing. Tendency to feel the weight of unrealized potential.",
    description: "The Master Builder. Where 4 builds a house, 22 builds a city. Your potential is enormous, and so is the pressure. You have the rare ability to turn the most ambitious dreams into tangible, lasting reality. Your purpose is to create structures — institutions, movements, systems — that benefit humanity.",
    reading: "Your Life Path is 22, the Master Builder, one of the most powerful numbers in numerology. You carry the sensitivity and intuition of 2 combined with the structural genius of 4, both amplified to their highest potential. You are here to build things that outlast you: institutions, movements, systems, and structures that serve humanity for generations.\n\nThe 22 path is about turning vision into reality on a grand scale. You possess not just the ability to dream big, but the practical discipline to make those dreams manifest. Where others see obstacles, you see blueprints. Your challenge is the burden of your own potential. The gap between what you can envision and what you can execute in a single lifetime can feel crushing. The most fulfilled 22s learn to pace themselves, to delegate, and to trust that the work unfolds in divine timing.\n\nIn love, you need a partner who sees your vision and helps you stay grounded. Your grand ambitions can overwhelm those who don't share your scale of thinking. You need someone who holds the human dimension while you build the monumental. Your career path is inevitably one of leadership and creation at scale: architecture, engineering, politics, philanthropy, entrepreneurship, or any field where you can build systems that change lives. Your life's work is to build the structures that elevate humanity, while never losing sight of the individual hearts those structures are meant to serve.",
    career: ["Architect", "CEO", "Philanthropist", "Inventor", "Developer"],
    love: "You need a partner who sees your vision and helps you stay grounded when the scale of your dreams feels overwhelming."
  },
  {
    number: "33", title: "The Master Teacher",
    keywords: ["compassionate", "healing", "selfless", "wise"],
    positive: "The rarest master number. A born healer and teacher whose impact reaches far beyond their immediate circle.",
    negative: "Can feel crushed by the weight of responsibility. Tendency toward martyrdom at a scale that's genuinely exhausting.",
    description: "The Master Teacher. Thirty-three is 6 amplified to a level that feels almost otherworldly. You are here to uplift humanity through unconditional love and service. Your compassion knows no bounds, and your wisdom is ancient. Your purpose is to teach, heal, and inspire — while learning the sacred art of self-care.",
    reading: "Your Life Path is 33, the Master Teacher, the rarest of all master numbers. You carry the nurturing energy of 6 amplified to a level that feels almost otherworldly. You are here to serve as a channel of unconditional love and healing. Your impact is meant to reach far beyond your immediate circle, touching lives you may never meet.\n\nThe 33 path is one of supreme compassion and spiritual responsibility. You have a natural gift for teaching, healing, and uplifting others, and your presence alone can bring a sense of peace and understanding to those around you. Your wisdom feels ancient, as if you have been here before. Your challenge is the weight of this calling. The martyrdom tendency of the 33 is real &mdash; you can feel that you must save everyone, and that belief can crush you. The most fulfilled 33s learn the sacred art of boundaries: that you are here to serve, not to sacrifice; to teach, not to carry.\n\nIn love, you need a partner who supports your mission without letting you sacrifice your own well-being. Your path is not an easy one for relationships, because your attention is pulled in so many directions. But your capacity for love is boundless, and the right partner will see your light without trying to possess it. Your career path leads inexorably toward service: spiritual leadership, healing arts, teaching on a grand scale, humanitarian work, or creative expression that uplifts consciousness. Your life's work is to love without condition, to serve without depletion, and to teach without attachment to the outcome.",
    career: ["Spiritual Leader", "Healer", "Teacher", "Humanitarian", "Artist"],
    love: "You need a partner who supports your mission without letting you sacrifice your own well-being."
  }
];

function computeLifePath(year: number, month: number, day: number): { number: string; root: string } {
  const reduce = (n: number): number => {
    if (n === 11 || n === 22 || n === 33) return n;
    if (n < 10) return n;
    return reduce(n.toString().split("").reduce((a, b) => a + parseInt(b), 0));
  };

  const m = reduce(month);
  const d = reduce(day);
  const yStr = year.toString();
  const y = reduce(yStr.split("").reduce((a, b) => a + parseInt(b), 0));
  const total = m + d + y;

  const lifePath = reduce(total);
  return {
    number: lifePath.toString(),
    root: lifePath === 11 || lifePath === 22 || lifePath === 33 ? "Master Number" : "Single Digit"
  };
}

const ELEMENTS: Record<string, string> = {
  "1": "\uD83D\uDD25", "2": "\uD83E\uDE78", "3": "\uD83C\uDFA8", "4": "\uD83C\uDFD7\uFE0F",
  "5": "\u2708\uFE0F", "6": "\uD83D\uDC96", "7": "\uD83D\uDD2E", "8": "\uD83D\uDCB0",
  "9": "\uD83C\uDF0D", "11": "\uD83C\uDF1F", "22": "\uD83C\uDFD8\uFE0F", "33": "\uD83D\uDCAB"
};

export default function NumerologyPage() {
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [year, setYear] = useState("");
  const [name, setName] = useState("");

  const result = useMemo(() => {
    const m = parseInt(month);
    const d = parseInt(day);
    const y = parseInt(year);
    if (!m || !d || !y || m < 1 || m > 12 || d < 1 || d > 31 || y < 1900 || y > 2100) return null;
    const { number, root } = computeLifePath(y, m, d);
    const meaning = NUMBERS.find((n) => n.number === number);
    if (!meaning) return null;
    const date = new Date(y, m - 1, d);
    return { number, root, meaning, dateStr: date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) };
  }, [month, day, year]);

  const nameDestiny = useMemo(() => {
    const n = name.trim();
    if (!n) return null;
    const letters = n.replace(/[^a-zA-Z]/g, "").toUpperCase();
    if (!letters) return null;
    const values = letters.split("").map((ch) => {
      const code = ch.charCodeAt(0) - 64;
      if (code <= 9) return code;
      const digits = code.toString();
      return digits.split("").reduce((a, b) => a + parseInt(b), 0);
    });
    const total = values.reduce((a, b) => a + b, 0);
    const reduce = (n: number): number => {
      if (n === 11 || n === 22 || n === 33) return n;
      if (n < 10) return n;
      return reduce(n.toString().split("").reduce((a, b) => a + parseInt(b), 0));
    };
    const destiny = reduce(total);
    const meaning = NUMBERS.find((n) => n.number === destiny.toString());
    return meaning ? { number: destiny.toString(), meaning } : null;
  }, [name]);

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-12">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <h1 className="apple-headline text-[34px] leading-[1.47] tracking-[-0.374px] mb-8">
        Numerology
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
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1}</option>
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

      <div className="w-full max-w-2xl apple-card px-6 py-5 mb-5">
        <h2 className="text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-[var(--color-ink-muted-48)] mb-3 uppercase">
          Or Full Name
        </h2>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your full name (e.g. John Doe)"
          className="apple-input w-full h-10 text-[14px]"
        />
      </div>

      {result && (
        <div className="w-full max-w-2xl space-y-4">
          <div className="apple-card px-6 py-5 text-center">
            <div className="text-[48px] mb-1">{ELEMENTS[result.number] || "\uD83D\uDD22"}</div>
            <div className="text-[32px] font-bold text-[var(--color-ink)]">{result.number}</div>
            <div className="text-[15px] font-semibold text-[var(--color-ink-muted-48)]">{result.meaning.title}</div>
            <div className="text-[11px] text-[var(--color-ink-muted-48)] mt-1">{result.root}</div>
            <div className="text-[11px] text-[var(--color-ink-muted-48)]">{result.dateStr}</div>
          </div>

          <div className="apple-card px-6 py-5">
            <h3 className="text-[12px] font-semibold uppercase text-[var(--color-ink-muted-48)] mb-3">Life Path Number</h3>
            <p className="text-[14px] leading-[1.6] text-[var(--color-ink)]">
              {result.meaning.description}
            </p>
          </div>

          <div className="apple-card px-6 py-5">
            <h3 className="text-[12px] font-semibold uppercase text-[var(--color-ink-muted-48)] mb-3">Your Reading</h3>
            {result.meaning.reading.split("\n\n").map((p, i) => (
              <p key={i} className="text-[14px] leading-[1.7] text-[var(--color-ink)] mb-2 last:mb-0">
                {p}
              </p>
            ))}
          </div>

          <div className="apple-card px-6 py-5">
            <h3 className="text-[12px] font-semibold uppercase text-[var(--color-ink-muted-48)] mb-3">Keywords</h3>
            <div className="flex flex-wrap gap-1.5">
              {result.meaning.keywords.map((k) => (
                <span key={k} className="px-2.5 py-1 rounded-[9999px] text-[12px] bg-[var(--color-surface-pearl)] text-[var(--color-ink)]">
                  {k}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="apple-card px-6 py-5">
              <h3 className="text-[12px] font-semibold uppercase text-[var(--color-ink-muted-48)] mb-2">Positive</h3>
              <p className="text-[13px] leading-[1.5] text-[var(--color-ink)]">{result.meaning.positive}</p>
            </div>
            <div className="apple-card px-6 py-5">
              <h3 className="text-[12px] font-semibold uppercase text-[var(--color-ink-muted-48)] mb-2">Challenge</h3>
              <p className="text-[13px] leading-[1.5] text-[var(--color-ink)]">{result.meaning.negative}</p>
            </div>
          </div>

          <div className="apple-card px-6 py-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-[12px] font-semibold uppercase text-[var(--color-ink-muted-48)] mb-2">Ideal Careers</h3>
                <div className="flex flex-wrap gap-1.5">
                  {result.meaning.career.map((c) => (
                    <span key={c} className="px-2.5 py-1 rounded-[9999px] text-[12px] bg-[var(--color-surface-pearl)] text-[var(--color-ink)]">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-[12px] font-semibold uppercase text-[var(--color-ink-muted-48)] mb-2">Love</h3>
                <p className="text-[13px] leading-[1.5] text-[var(--color-ink)]">{result.meaning.love}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {nameDestiny && (
        <div className="w-full max-w-2xl apple-card px-6 py-5 mt-4">
          <h3 className="text-[12px] font-semibold uppercase text-[var(--color-ink-muted-48)] mb-3">Destiny Number</h3>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-[36px]">{ELEMENTS[nameDestiny.number]}</span>
            <div>
              <div className="text-[28px] font-bold text-[var(--color-ink)]">{nameDestiny.number}</div>
              <div className="text-[13px] text-[var(--color-ink-muted-48)]">{nameDestiny.meaning.title}</div>
            </div>
          </div>
          <p className="text-[13px] leading-[1.5] text-[var(--color-ink)]">
            Derived from the letters in <strong>{name.trim()}</strong>, your Destiny Number reveals the talents and abilities you're meant to develop.
          </p>
          <p className="text-[13px] leading-[1.5] text-[var(--color-ink)] mt-2">
            {nameDestiny.meaning.description.split(".")[0]}.
          </p>
        </div>
      )}

      {!result && !nameDestiny && (!month || !day || !year) && !name.trim() && (
        <div className="w-full max-w-2xl space-y-4">
          <div className="apple-card px-6 py-5">
            <h2 className="text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-[var(--color-ink-muted-48)] mb-3 uppercase">
              About Numerology
            </h2>
            <p className="text-[14px] leading-[1.6] text-[var(--color-ink)] mb-3">
              Numerology is the ancient study of the divine or mystical relationship between numbers and events in the physical world. Its origins span multiple cultures &mdash; the Greek philosopher Pythagoras (c. 570&ndash;495 BCE) is considered the father of Western numerology, believing that numbers were the ultimate building blocks of reality. The Hebrew system of Gematria, the Chinese tradition of lucky and unlucky numbers, and the Chaldean system of Mesopotamia each developed their own numerological frameworks independently.
            </p>
            <p className="text-[14px] leading-[1.6] text-[var(--color-ink)] mb-3">
              In Pythagorean numerology (the system used here), every number from 1 to 9 carries a distinct vibrational frequency and archetypal meaning. Your <strong>Life Path Number</strong> is the most important number in your chart &mdash; it's derived from your birth date and reveals your core personality, natural talents, challenges, and the overarching purpose of your life. It is your cosmic blueprint, the path you were born to walk.
            </p>
            <p className="text-[14px] leading-[1.6] text-[var(--color-ink)] mb-3">
              Your <strong>Destiny Number</strong> (also called the Expression Number) is calculated from the letters in your full birth name. Each letter corresponds to a number (A=1, B=2, etc.), and their sum reveals the talents, abilities, and shortcomings you brought into this life. While your Life Path is the road you travel, your Destiny Number is the tools you carry in your backpack.
            </p>
            <p className="text-[14px] leading-[1.6] text-[var(--color-ink)]">
              Master Numbers (11, 22, 33) are the exceptions &mdash; they are never reduced to a single digit because they carry amplified energy and heightened spiritual significance. Those with Master Numbers often feel a greater sense of purpose and intensity in their lives.
            </p>
          </div>
          <div className="apple-card px-6 py-5">
            <p className="text-[14px] leading-[1.43] text-[var(--color-ink-muted-48)] text-center">
              Enter your birth date to calculate your Life Path Number, or type your name to discover your Destiny Number. Both reveal different dimensions of your numerological profile.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
