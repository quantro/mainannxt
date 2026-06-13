"use client";

import { useMemo, useState } from "react";
import ThemeToggle from "../theme-toggle";
import { Disclaimer } from "../disclaimer";

const CHINESE_ZODIAC = [
  "Rat", "Ox", "Tiger", "Rabbit",
  "Dragon", "Snake", "Horse", "Goat",
  "Monkey", "Rooster", "Dog", "Pig",
];

const HEAVENLY_STEMS = ["Jia", "Yi", "Bing", "Ding", "Wu", "Ji", "Geng", "Xin", "Ren", "Gui"];
const EARTHLY_BRANCHES = ["Zi", "Chou", "Yin", "Mao", "Chen", "Si", "Wu", "Wei", "Shen", "You", "Xu", "Hai"];
const STEM_ELEMENTS = ["Wood (Yang)", "Wood (Yin)", "Fire (Yang)", "Fire (Yin)", "Earth (Yang)", "Earth (Yin)", "Metal (Yang)", "Metal (Yin)", "Water (Yang)", "Water (Yin)"];

const CHINESE_ZODIAC_READINGS: Record<string, string> = {
  Rat: "The Rat is the first animal of the Chinese zodiac, earned by its wit and cunning in the Great Race legend. Those born in the Year of the Rat are intelligent, resourceful, and highly adaptable. You possess a sharp mind and an instinct for survival that few can match. Your charm and social intelligence open doors wherever you go. However, your ambition can sometimes be mistaken for opportunism, and your practicality for stinginess. In relationships, you are loyal but guarded, showing your deepest affections only to those who have earned your trust. Your element influences your nature: Metal Rats are determined and ambitious, Water Rats are intuitive and persuasive, Wood Rats are creative and cooperative, Fire Rats are energetic and assertive, and Earth Rats are stable and grounded. The Rat's lesson is to balance your cleverness with generosity, and your ambition with contentment.",
  Ox: "The Ox is the second animal of the Chinese zodiac, known for its strength, diligence, and reliability. Those born in the Year of the Ox are the bedrock of society — hardworking, patient, and steadfast. You believe in the power of persistence and are willing to do the work that others avoid. Your quiet strength earns you deep respect, even if you rarely seek attention. Your determination is legendary, but it can also become stubbornness. Your reserve can be mistaken for coldness. Your loyalty, once given, is unshakeable. Metal Oxen are especially determined, Water Oxen are practical and capable, Wood Oxen are reliable and grounded, Fire Oxen are hardworking but volatile, and Earth Oxen are methodical and dependable. The Ox's lesson is to remember that rest is not laziness, and that flexibility is not weakness.",
  Tiger: "The Tiger is the third animal of the Chinese zodiac, the king of the jungle in Chinese astrology. Those born in the Year of the Tiger are bold, competitive, and magnetic. You have a natural authority that commands attention, and a courage that inspires others to follow you into the unknown. You thrive on challenge and adventure, and your passionate nature attracts people to you like moths to a flame. Your impulsiveness can lead to recklessness, and your independence can make you resistant to guidance. Metal Tigers are especially bold, Water Tigers are persuasive and charming, Wood Tigers are adventurous and idealistic, Fire Tigers are passionate and dynamic, and Earth Tigers are balanced and responsible. The Tiger's lesson is to channel your immense energy with wisdom, and to let others share the spotlight you naturally command.",
  Rabbit: "The Rabbit is the fourth animal of the Chinese zodiac, the symbol of longevity, grace, and good fortune. Those born in the Year of the Rabbit are gentle, elegant, and sensitive. You move through life with a quiet poise that disarms even your enemies. Your intuition is finely tuned, and you can read people and situations with remarkable accuracy. You value peace above all and will go to great lengths to avoid conflict. Your sensitivity can make you vulnerable to hurt, and your aversion to confrontation can lead to avoidance of necessary difficulties. Metal Rabbits are cautious and reserved, Water Rabbits are intuitive and diplomatic, Wood Rabbits are artistic and compassionate, Fire Rabbits are passionate and perceptive, and Earth Rabbits are practical and family-oriented. The Rabbit's lesson is to develop the courage to face conflict when peace is achieved at too high a price.",
  Dragon: "The Dragon is the fifth animal of the Chinese zodiac, the most powerful and auspicious sign. Those born in the Year of the Dragon are born leaders — confident, charismatic, and driven. You have a larger-than-life presence and the vision to achieve great things. In Chinese culture, Dragons are symbols of power, honor, and success. You are naturally ambitious and inspire others with your enthusiasm and optimism. Your confidence can border on arrogance, and your high standards can make you demanding of yourself and others. Metal Dragons are especially powerful, Water Dragons are wise and persuasive, Wood Dragons are creative and idealistic, Fire Dragons are passionate and commanding, and Earth Dragons are balanced and practical. The Dragon's lesson is to temper your fire with humility, and to recognize that true power serves others, not just yourself.",
  Snake: "The Snake is the sixth animal of the Chinese zodiac, the symbol of wisdom, intuition, and mystery. Those born in the Year of the Snake are deep thinkers and natural philosophers. You possess a penetrating intelligence that sees through surface appearances to the truth beneath. Your intuition is uncanny, and people often find you enigmatic. You are elegant, private, and magnetic in a quiet way. Your reserved nature can be mistaken for secrecy, and your self-reliance can become isolation. Metal Snakes are determined and focused, Water Snakes are wise and intuitive, Wood Snakes are intellectual and creative, Fire Snakes are passionate and transformative, and Earth Snakes are practical and strategic. The Snake's lesson is to share your wisdom generously and to trust that vulnerability is not the same as weakness.",
  Horse: "The Horse is the seventh animal of the Chinese zodiac, the symbol of freedom, energy, and adventure. Those born in the Year of the Horse are independent spirits who refuse to be confined. You are energetic, enthusiastic, and naturally drawn to travel and new experiences. Your charm is effortless, and your social nature makes you the center of any gathering. You have a gift for inspiring others with your optimism and zest for life. Your love of freedom can make you resistant to commitment, and your impulsive nature can lead to inconsistency. Metal Horses are determined and ambitious, Water Horses are charming and adaptable, Wood Horses are adventurous and idealistic, Fire Horses are passionate and volatile (a particularly powerful and challenging year), and Earth Horses are balanced and reliable. The Horse's lesson is to find the freedom in commitment and the adventure in depth.",
  Goat: "The Goat is the eighth animal of the Chinese zodiac, the symbol of gentleness, creativity, and peace. Those born in the Year of the Goat are artists, dreamers, and gentle souls. You possess a refined aesthetic sense and a deep appreciation for beauty in all its forms. Your compassion is genuine, and you care deeply about the well-being of others. You prefer harmony and will often sacrifice your own comfort to maintain peace. Your sensitivity can lead to worry and insecurity, and your desire for peace can make you passive in the face of conflict. Metal Goats are determined and principled, Water Goats are intuitive and artistic, Wood Goats are creative and cooperative, Fire Goats are passionate and expressive, and Earth Goats are practical and nurturing. The Goat's lesson is to develop your inner strength so that your gentleness becomes a choice, not a necessity.",
  Monkey: "The Monkey is the ninth animal of the Chinese zodiac, the symbol of intelligence, wit, and versatility. Those born in the Year of the Monkey are brilliant, curious, and endlessly inventive. You have a quick mind and a sharper tongue, and you can talk your way into or out of almost anything. Your creativity knows no bounds, and you approach life as an endless puzzle to be solved. Your resourcefulness makes you successful in almost any endeavor you choose. Your cleverness can become manipulative, and your restlessness can prevent you from finishing what you start. Metal Monkeys are especially sharp, Water Monkeys are persuasive and adaptable, Wood Monkeys are creative and idealistic, Fire Monkeys are energetic and charismatic, and Earth Monkeys are practical and strategic. The Monkey's lesson is to use your intelligence in service of others, not just your own amusement, and to honor commitment over cleverness.",
  Rooster: "The Rooster is the tenth animal of the Chinese zodiac, the symbol of punctuality, confidence, and honesty. Those born in the Year of the Rooster are observant, hardworking, and unapologetically themselves. You have an eye for detail that others miss and a sense of pride in everything you do. Your confidence is visible — you carry yourself with the certainty of someone who knows their worth. You are honest to a fault, and your directness, while refreshing, can sometimes be brutal. Your high standards apply to everyone around you, which can make you seem critical. Metal Roosters are especially confident and determined, Water Roosters are intuitive and persuasive, Wood Roosters are idealistic and creative, Fire Roosters are passionate and dynamic, and Earth Roosters are practical and reliable. The Rooster's lesson is to temper your honesty with compassion, and to recognize that everyone is fighting their own battle.",
  Dog: "The Dog is the eleventh animal of the Chinese zodiac, the symbol of loyalty, honesty, and justice. Those born in the Year of the Dog are the most trustworthy people you will ever meet. You are loyal to a fault, honest when it would be easier to lie, and fiercely protective of those you love. Your sense of justice is innate — you cannot stand to see the innocent suffer or the guilty go unpunished. Your loyalty can become possessiveness, and your anxiety about the safety of those you love can make you worry excessively. Metal Dogs are especially loyal and principled, Water Dogs are intuitive and diplomatic, Wood Dogs are idealistic and generous, Fire Dogs are passionate and energetic, and Earth Dogs are practical and grounded. The Dog's lesson is to extend the same loyalty and compassion to yourself that you so readily give to others, and to trust that not everything requires your protection.",
  Pig: "The Pig is the twelfth and final animal of the Chinese zodiac, the symbol of abundance, kindness, and honesty. Those born in the Year of the Pig are generous, warm-hearted, and genuine. You approach life with an open heart and an open hand, giving freely without counting the cost. Your kindness is not naivety — you see the darkness in the world and choose to be light anyway. You enjoy life's pleasures without guilt and share your abundance with everyone around you. Your trust in others can leave you vulnerable to exploitation, and your desire to please everyone can lead to overextension. Metal Pigs are determined and principled, Water Pigs are intuitive and persuasive, Wood Pigs are creative and generous, Fire Pigs are passionate and enthusiastic, and Earth Pigs are practical and nurturing. The Pig's lesson is to maintain your generous spirit while developing discernment, and to remember that you cannot pour from an empty vessel.",
};

const CHINESE_FESTIVALS: Record<string, { name: string; date: string; desc: string }> = {
  cny: { name: "Chinese New Year (Spring Festival)", date: "Jan/Feb (1st lunar month)", desc: "The most important Chinese festival, celebrating the beginning of the new year on the lunar calendar. Families reunite, feast, exchange red envelopes (hongbao), and set off fireworks to ward off evil spirits. Celebrations last 15 days, ending with the Lantern Festival." },
  capgome: { name: "Lantern Festival (Cap Go Meh)", date: "15th day of 1st lunar month", desc: "The final day of Chinese New Year celebrations. Lanterns of all shapes and sizes are displayed and released. Riddles are written on lanterns for passersby to solve. In Southeast Asia, this is known as Cap Go Meh and is celebrated with large parades." },
  qingming: { name: "Qingming Festival (Tomb Sweeping Day)", date: "April 4 or 5", desc: "A day to honor ancestors by cleaning their graves, making offerings of food and incense, and burning paper money. Families picnic at the gravesite, sharing meals with the spirits of their ancestors." },
  dragonboat: { name: "Dragon Boat Festival (Duanwu)", date: "5th day of 5th lunar month", desc: "Commemorates the poet Qu Yuan. Dragon boat races are held, and zongzi (sticky rice dumplings wrapped in bamboo leaves) are eaten. Medicinal herbs are hung on doors to ward off disease." },
  qixi: { name: "Qixi Festival (Chinese Valentine's Day)", date: "7th day of 7th lunar month", desc: "Based on the romantic legend of the Cowherd and Weaver Girl, two lovers separated by the Milky Way who are reunited once a year on this night. Young women pray for sewing skills and good husbands." },
  hungryghost: { name: "Hungry Ghost Festival (Zhongyuan)", date: "15th day of 7th lunar month", desc: "The gates of the afterlife open, and spirits roam the earth. Offerings of food, incense, and paper money are made to appease the hungry ghosts. Performances are held on temporary stages to entertain both the living and the dead." },
  midautumn: { name: "Mid-Autumn Festival", date: "15th day of 8th lunar month", desc: "A harvest festival celebrating the full moon. Mooncakes are eaten and shared. Families gather to admire the moon, which is said to be the roundest and brightest of the year. Lanterns are carried by children in parades." },
  doubleyang: { name: "Double Ninth Festival (Chongyang)", date: "9th day of 9th lunar month", desc: "A day to honor the elderly. Families climb mountains, drink chrysanthemum wine, and wear cornus branches. The number 9 is associated with yang energy, and double 9 is considered auspicious." },
  winterfest: { name: "Winter Solstice Festival (Dongzhi)", date: "December 21 or 22", desc: "A celebration of the winter solstice, when yang energy begins to rise. Families gather to eat tangyuan (glutinous rice balls) symbolizing reunion and completeness. In Chinese cosmology, this marks the rebirth of light." },
};

const ISLAMIC_OBSERVANCES: Record<string, { name: string; desc: string }> = {
  muharram: { name: "Muharram (Islamic New Year)", desc: "The first month of the Islamic calendar. The 10th day of Muharram is Ashura, a day of voluntary fasting observed by many Muslims. For Shia Muslims, it is a day of mourning commemorating the martyrdom of Husayn ibn Ali at the Battle of Karbala." },
  ramadan: { name: "Ramadan (Month of Fasting)", desc: "The ninth month of the Islamic calendar, during which Muslims fast from dawn to sunset. It is a time of spiritual reflection, increased prayer, charity, and community. The night of Laylat al-Qadr (the Night of Power) falls within the last ten days, marking the revelation of the Quran." },
  eidfitr: { name: "Eid al-Fitr", desc: "The festival of breaking the fast, celebrated on the first day of Shawwal, the 10th Islamic month. It marks the end of Ramadan with special prayers, feasting, gift-giving (especially to children), and the wearing of new clothes. The greeting is 'Eid Mubarak.'" },
  eidha: { name: "Eid al-Adha (Festival of Sacrifice)", desc: "The festival commemorating the willingness of Ibrahim (Abraham) to sacrifice his son in obedience to God. It coincides with the Hajj pilgrimage. Families who can afford it sacrifice an animal and distribute the meat to the poor, family, and friends." },
  mawlid: { name: "Mawlid (Birth of the Prophet)", desc: "The celebration of the birth of Prophet Muhammad, observed on the 12th day of Rabi' al-Awwal. Celebrations include recitations of poetry in praise of the Prophet, religious lectures, and communal meals." },
  isra: { name: "Isra' and Mi'raj", desc: "The Night Journey and Ascension of Prophet Muhammad, observed on the 27th day of Rajab. Muslims believe the Prophet was transported from Mecca to Jerusalem and ascended to heaven, where he received the instruction for daily prayers." },
  asha: { name: "Ashura", desc: "Observed on the 10th of Muharram. For Sunni Muslims, it is a day of voluntary fasting, commemorating the day Moses and the Israelites were saved from Pharaoh. For Shia Muslims, it marks the climax of the mourning period for Imam Husayn." },
};

interface ChineseYear { stem: string; branch: string; element: string; animal: string; cycleYear: number; }

function getChineseYear(year: number): ChineseYear {
  const offset = year - 4;
  const stemIdx = ((offset % 10) + 10) % 10;
  const branchIdx = ((offset % 12) + 12) % 12;
  const cycleYear = ((offset % 60) + 60) % 60 || 60;
  return { stem: HEAVENLY_STEMS[stemIdx], branch: EARTHLY_BRANCHES[branchIdx], element: STEM_ELEMENTS[stemIdx], animal: CHINESE_ZODIAC[branchIdx], cycleYear };
}

const JAVANESE_MONTHS = ["Sura", "Sapar", "Mulud", "Bakdamulud", "Jumadilawal", "Jumadilakir", "Rejeb", "Ruwah", "Pasa", "Sawal", "Sela/Apit", "Besar"];
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const PASARAN = ["Legi", "Pahing", "Pon", "Wage", "Kliwon"];

const HIJRI_MONTHS = ["Muharram", "Safar", "Rabi' al-Awwal", "Rabi' al-Thani", "Jumada al-Awwal", "Jumada al-Thani", "Rajab", "Sha'ban", "Ramadan", "Shawwal", "Dhu al-Qa'dah", "Dhu al-Hijjah"];
function gregorianToJdn(y: number, m: number, d: number): number {
  const a = Math.floor((14 - m) / 12);
  const yy = y + 4800 - a;
  const mm = m + 12 * a - 3;
  return d + Math.floor((153 * mm + 2) / 5) + 365 * yy + Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400) - 32045;
}

const HIJRI_LEAP_YEARS = new Set([2, 5, 7, 10, 13, 16, 18, 21, 24, 27, 29]);

function isHijriLeap(y: number): boolean {
  return HIJRI_LEAP_YEARS.has(((y - 1) % 30) + 1);
}

function hijriYearDays(y: number): number {
  return isHijriLeap(y) ? 355 : 354;
}

function jdnToHijri(jdn: number) {
  const epoch = 1948440;
  const days = jdn - epoch;
  if (days < 0) return { year: 1, month: 1, day: 1 };
  const approx = Math.floor((days + 0.5) / 354.36707);
  let year = Math.max(1, approx);
  let cum = 0;
  for (let y = 1; y < year; y++) cum += hijriYearDays(y);
  while (cum + hijriYearDays(year) <= days) { cum += hijriYearDays(year); year++; }
  while (cum > days && year > 1) { year--; cum -= hijriYearDays(year); }
  const doy = days - cum + 1;
  const mlen = [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, isHijriLeap(year) ? 30 : 29];
  let month = 1, day = doy;
  for (let i = 0; i < 12; i++) {
    if (day <= mlen[i]) break;
    day -= mlen[i]; month++;
  }
  return { year, month, day };
}

function daysInMonth(month: number, year: number) {
  return new Date(year, month, 0).getDate();
}

type Tab = "chinese" | "javanese" | "islamic";

export default function CalendarPage() {
  const now = useMemo(() => new Date(), []);
  const [yearText, setYearText] = useState(String(now.getFullYear()));
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [day, setDay] = useState(now.getDate());
  const [calculated, setCalculated] = useState(true);
  const [tab, setTab] = useState<Tab>("chinese");
  const [openFestival, setOpenFestival] = useState<string | null>(null);
  const [openObservance, setOpenObservance] = useState<string | null>(null);

  const year = parseInt(yearText) || now.getFullYear();
  const maxDay = useMemo(() => daysInMonth(month, year), [month, year]);
  const clampedDay = Math.min(day, maxDay);

  const date = useMemo(() => new Date(year, month - 1, clampedDay), [year, month, clampedDay]);
  const dateStr = useMemo(() => date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }), [date]);
  const dayOfWeek = date.getDay();

  const jdn = useMemo(() => gregorianToJdn(year, month, clampedDay), [year, month, clampedDay]);
  const hijri = useMemo(() => jdnToHijri(jdn), [jdn]);
  const chineseYear = useMemo(() => getChineseYear(year), [year]);

  const wetonDay = DAYS[dayOfWeek];
  const wetonPasaran = PASARAN[((jdn + 1) % 5 + 5) % 5];
  const sakaYear = year - 78;
  const jMonthIdx = ((month + 9) % 12 + 12) % 12;

  const isToday =
    !calculated || (year === now.getFullYear() && month === now.getMonth() + 1 && clampedDay === now.getDate());

  const TABS: { key: Tab; label: string; icon: string }[] = [
    { key: "chinese", label: "Chinese", icon: "🐉" },
    { key: "javanese", label: "Javanese", icon: "🌴" },
    { key: "islamic", label: "Islamic", icon: "🌙" },
  ];

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-12">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <h1 className="apple-headline text-[34px] leading-[1.47] tracking-[-0.374px] mb-2">
        World Calendars
      </h1>
      <p className="text-[13px] text-[var(--color-ink-muted-48)] mb-6 text-center max-w-lg">
        Three calendars, one moment. Explore Chinese, Javanese, and Islamic dates.
      </p>

      <div className="w-full max-w-2xl apple-card px-6 py-5 mb-5">
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div>
            <label className="text-[10px] font-semibold uppercase text-[var(--color-ink-muted-48)]">Year</label>
            <input
              value={yearText}
              onChange={(e) => setYearText(e.target.value.replace(/[^0-9-]/g, ""))}
              onKeyDown={(e) => e.key === "Enter" && setCalculated((c) => !c)}
              placeholder="e.g. 1985"
              className="apple-input w-full h-9 text-[13px] mt-0.5"
            />
          </div>
          <div>
            <label className="text-[10px] font-semibold uppercase text-[var(--color-ink-muted-48)]">Month</label>
            <select value={month} onChange={(e) => setMonth(parseInt(e.target.value))} className="apple-input w-full h-9 text-[13px] mt-0.5">
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>{new Date(2000, m - 1, 1).toLocaleDateString("en-US", { month: "long" })}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-semibold uppercase text-[var(--color-ink-muted-48)]">Day</label>
            <select value={clampedDay} onChange={(e) => setDay(parseInt(e.target.value))} className="apple-input w-full h-9 text-[13px] mt-0.5">
              {Array.from({ length: maxDay }, (_, i) => i + 1).map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setCalculated((c) => !c)}
            className="apple-btn-primary h-10 px-6 text-[13px]"
          >
            Calculate
          </button>
          {!isToday && (
            <button
              onClick={() => {
                setYearText(String(now.getFullYear()));
                setMonth(now.getMonth() + 1);
                setDay(now.getDate());
                setCalculated(true);
              }}
              className="text-[11px] text-[var(--color-primary)] hover:underline"
            >
              Back to today
            </button>
          )}
        </div>
        <div className="text-center mt-3">
          <div className="text-[15px] font-semibold text-[var(--color-ink)]">{dateStr}</div>
          {isToday && <div className="text-[10px] text-[var(--color-primary)] font-semibold uppercase mt-0.5">Today</div>}
        </div>
      </div>

      <div className="w-full max-w-2xl flex gap-1 mb-5">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 px-3 py-2.5 rounded-[11px] text-[13px] font-semibold transition-all ${
              tab === t.key
                ? "bg-[var(--color-primary)] text-white"
                : "bg-[var(--color-surface-pearl)] text-[var(--color-ink-muted-48)] hover:brightness-95"
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {tab === "chinese" && (
        <div className="w-full max-w-2xl space-y-4">
          <div className="apple-card px-6 py-5">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-[22px]">🐉</span>
              <h2 className="text-[17px] font-semibold text-[var(--color-ink)]">Chinese Calendar</h2>
            </div>
            <div className="text-[20px] font-bold text-[var(--color-ink)] mb-1">
              Year of the {chineseYear.animal} ({chineseYear.stem}{chineseYear.branch})
            </div>
            <div className="text-[13px] text-[var(--color-ink-muted-48)] mb-3">
              Cycle year {chineseYear.cycleYear}/60 &middot; Element: {chineseYear.element}
            </div>
            <div className="px-4 py-3 rounded-[11px] bg-[var(--color-surface-pearl)]">
              <p className="text-[13px] leading-[1.7] text-[var(--color-ink)]">{CHINESE_ZODIAC_READINGS[chineseYear.animal]}</p>
            </div>
          </div>

          <div className="apple-card px-6 py-5">
            <h3 className="text-[12px] font-semibold uppercase text-[var(--color-ink-muted-48)] mb-3">Chinese Zodiac Animals</h3>
            <div className="grid grid-cols-6 gap-1.5 text-center">
              {CHINESE_ZODIAC.map((animal, i) => {
                const baseYear = 2020 - ((2020 - 4) % 12);
                const y = baseYear + i;
                return (
                  <div key={animal} className={`px-1 py-1.5 rounded-[8px] text-[10px] ${animal === chineseYear.animal ? 'bg-[var(--color-primary)] text-white font-semibold' : 'bg-[var(--color-surface-pearl)] text-[var(--color-ink-muted-48)]'}`}>
                    {animal}
                    <div className="text-[8px] opacity-70">{y}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="apple-card px-6 py-5">
            <h3 className="text-[12px] font-semibold uppercase text-[var(--color-ink-muted-48)] mb-3">Chinese Festivals & Observances</h3>
            <div className="grid grid-cols-1 gap-1.5">
              {Object.entries(CHINESE_FESTIVALS).map(([key, fest]) => (
                <button
                  key={key}
                  onClick={() => setOpenFestival(openFestival === key ? null : key)}
                  className="w-full text-left px-3 py-2 rounded-[9px] bg-[var(--color-surface-pearl)] hover:brightness-95 active:brightness-90 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-semibold text-[var(--color-ink)]">{fest.name}</span>
                    <span className="text-[10px] text-[var(--color-ink-muted-48)]">{fest.date}</span>
                  </div>
                  {openFestival === key && (
                    <p className="text-[11px] leading-[1.5] text-[var(--color-ink)] mt-1.5">{fest.desc}</p>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "javanese" && (
        <div className="w-full max-w-2xl space-y-4">
          <div className="apple-card px-6 py-5">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-[22px]">🌴</span>
              <h2 className="text-[17px] font-semibold text-[var(--color-ink)]">Javanese Calendar (Kalender Jawa)</h2>
            </div>
            <div className="text-[20px] font-bold text-[var(--color-ink)] mb-1">{wetonDay} {wetonPasaran}</div>
            <div className="text-[13px] text-[var(--color-ink-muted-48)] mb-3">
              Saka Year {sakaYear} &middot; Month of {JAVANESE_MONTHS[jMonthIdx]}
            </div>
            <div className="px-4 py-3 rounded-[11px] bg-[var(--color-surface-pearl)]">
              <p className="text-[13px] leading-[1.7] text-[var(--color-ink)]">
                The Javanese calendar, formalized by Sultan Agung of Mataram in 1633 CE (Saka year 1555), is a hybrid system that blends the Hindu-Buddhist Saka calendar with Islamic lunar months, while keeping the uniquely Javanese <em>pasaran</em> five-day cycle. Your weton on this date is <strong>{wetonDay} {wetonPasaran}</strong>. In Javanese culture, each weton carries a specific spiritual energy that influences the character of that day. The pasaran cycle of {PASARAN.join(", ")} rotates continuously alongside the seven-day week, creating a 35-day cycle that governs everything from market days to wedding dates. All three systems — the Hindu Saka solar year, the Islamic lunar months, and the native Javanese pasaran cycle — run simultaneously, reflecting the Javanese belief that time is not linear but woven from multiple threads.
              </p>
            </div>
          </div>

          <div className="apple-card px-6 py-5">
            <h3 className="text-[12px] font-semibold uppercase text-[var(--color-ink-muted-48)] mb-3">Pasaran Cycle</h3>
            <div className="grid grid-cols-5 gap-1.5">
              {PASARAN.map((p, i) => (
                <div key={p} className={`px-1 py-1.5 rounded-[8px] text-center ${i === ((jdn + 1) % 5 + 5) % 5 ? 'bg-[var(--color-primary)] text-white font-semibold' : 'bg-[var(--color-surface-pearl)] text-[var(--color-ink-muted-48)]'}`}>
                  <div className="text-[10px] font-semibold">{p}</div>
                  <div className="text-[8px] opacity-70">{i === ((jdn + 1) % 5 + 5) % 5 ? "active" : ""}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="apple-card px-6 py-5">
            <h3 className="text-[12px] font-semibold uppercase text-[var(--color-ink-muted-48)] mb-3">Javanese Months</h3>
            <div className="grid grid-cols-3 gap-1.5">
              {JAVANESE_MONTHS.map((jm, i) => (
                <div key={jm} className={`px-1 py-1.5 rounded-[8px] text-center text-[10px] ${i === jMonthIdx ? 'bg-[var(--color-primary)] text-white font-semibold' : 'bg-[var(--color-surface-pearl)] text-[var(--color-ink-muted-48)]'}`}>
                  <div className="font-semibold">{jm}</div>
                  <div className="text-[8px] opacity-70">{i === jMonthIdx ? "current" : ""}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "islamic" && (
        <div className="w-full max-w-2xl space-y-4">
          <div className="apple-card px-6 py-5">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-[22px]">🌙</span>
              <h2 className="text-[17px] font-semibold text-[var(--color-ink)]">Islamic Calendar (Hijriyah)</h2>
            </div>
            <div className="text-[20px] font-bold text-[var(--color-ink)] mb-1">
              {hijri.day} {HIJRI_MONTHS[hijri.month - 1]} {hijri.year} AH
            </div>
            <div className="text-[13px] text-[var(--color-ink-muted-48)] mb-3">
              Year {hijri.year} After Hijrah &middot; Month of {HIJRI_MONTHS[hijri.month - 1]}
            </div>
            <div className="px-4 py-3 rounded-[11px] bg-[var(--color-surface-pearl)]">
              <p className="text-[13px] leading-[1.7] text-[var(--color-ink)]">
                The Islamic calendar, also called the Hijri calendar, is a purely lunar calendar consisting of 12 months in a year of about 354 days. It began in 622 CE with the Hijrah (migration) of Prophet Muhammad from Mecca to Medina. Since the Islamic year is about 11 days shorter than the solar year, the calendar drifts backward through the seasons, completing a full cycle approximately every 33 years. Each month begins with the sighting of the new crescent moon. The most significant months include <strong>Ramadan</strong> (the month of fasting), <strong>Muharram</strong> (the first month), and <strong>Dhu al-Hijjah</strong> (the month of Hajj).
              </p>
            </div>
          </div>

          <div className="apple-card px-6 py-5">
            <h3 className="text-[12px] font-semibold uppercase text-[var(--color-ink-muted-48)] mb-3">Islamic Months</h3>
            <div className="grid grid-cols-3 gap-1.5">
              {HIJRI_MONTHS.map((hm, i) => (
                <div key={hm} className={`px-1 py-1.5 rounded-[8px] text-center text-[10px] ${i === hijri.month - 1 ? 'bg-[var(--color-primary)] text-white font-semibold' : 'bg-[var(--color-surface-pearl)] text-[var(--color-ink-muted-48)]'}`}>
                  <div className="font-semibold">{hm.split("'")[0]}</div>
                  <div className="text-[8px] opacity-70">{i === hijri.month - 1 ? "current" : ""}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="apple-card px-6 py-5">
            <h3 className="text-[12px] font-semibold uppercase text-[var(--color-ink-muted-48)] mb-3">Islamic Observances</h3>
            <div className="grid grid-cols-1 gap-1.5">
              {Object.entries(ISLAMIC_OBSERVANCES).map(([key, obs]) => (
                <button
                  key={key}
                  onClick={() => setOpenObservance(openObservance === key ? null : key)}
                  className="w-full text-left px-3 py-2 rounded-[9px] bg-[var(--color-surface-pearl)] hover:brightness-95 active:brightness-90 transition-all"
                >
                  <span className="text-[12px] font-semibold text-[var(--color-ink)]">{obs.name}</span>
                  {openObservance === key && (
                    <p className="text-[11px] leading-[1.5] text-[var(--color-ink)] mt-1.5">{obs.desc}</p>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-2xl apple-card px-6 py-5 mt-4">
        <p className="text-[12px] leading-[1.6] text-[var(--color-ink-muted-48)]">
          The Hijri date shown is an approximate conversion. Exact Islamic dates depend on local moon sighting and may vary by one day depending on location. The Chinese calendar shown uses the year-based zodiac cycle; exact lunar dates in the Chinese calendar would require a full lunisolar conversion. The Javanese pasaran calculation is based on a fixed reference date.
        </p>
      </div>
          <Disclaimer type="divination" />
    </div>
  );
}
