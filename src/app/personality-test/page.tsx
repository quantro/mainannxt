"use client";

import { useMemo, useState } from "react";
import ThemeToggle from "../theme-toggle";
import { Disclaimer } from "../disclaimer";
import { PageTitle } from "../page-title";

interface Question {
  text: string;
  trait: "O" | "C" | "E" | "A" | "N";
  reverse: boolean;
}

const QUESTIONS: Question[] = [
  { text: "Saya memiliki imajinasi yang aktif.", trait: "O", reverse: false },
  { text: "Saya suka merenungkan ide-ide abstrak.", trait: "O", reverse: false },
  { text: "Saya menikmati pengalaman baru dan beragam.", trait: "O", reverse: false },
  { text: "Saya lebih suka rutinitas daripada hal baru.", trait: "O", reverse: true },
  { text: "Saya tertarik pada seni dan keindahan.", trait: "O", reverse: false },
  { text: "Saya jarang penasaran tentang hal-hal yang tidak saya ketahui.", trait: "O", reverse: true },

  { text: "Saya selalu menyelesaikan tugas tepat waktu.", trait: "C", reverse: false },
  { text: "Saya suka menjaga kerapian dan kebersihan.", trait: "C", reverse: false },
  { text: "Saya cenderung malas dan tidak teratur.", trait: "C", reverse: true },
  { text: "Saya bekerja keras untuk mencapai tujuan saya.", trait: "C", reverse: false },
  { text: "Saya sering menunda-nunda pekerjaan penting.", trait: "C", reverse: true },
  { text: "Saya memperhatikan detail dalam setiap hal.", trait: "C", reverse: false },

  { text: "Saya merasa nyaman menjadi pusat perhatian.", trait: "E", reverse: false },
  { text: "Saya lebih suka menyendiri daripada bersosialisasi.", trait: "E", reverse: true },
  { text: "Saya mudah bergaul dengan orang baru.", trait: "E", reverse: false },
  { text: "Saya cenderung pendiam dalam pertemuan sosial.", trait: "E", reverse: true },
  { text: "Saya penuh energi dan semangat.", trait: "E", reverse: false },
  { text: "Saya menikmati percakapan yang hangat dengan banyak orang.", trait: "E", reverse: false },

  { text: "Saya peduli dengan perasaan orang lain.", trait: "A", reverse: false },
  { text: "Saya cenderung bersikap dingin dan tidak ramah.", trait: "A", reverse: true },
  { text: "Saya suka bekerja sama dengan orang lain.", trait: "A", reverse: false },
  { text: "Saya jarang mempertimbangkan perasaan orang lain.", trait: "A", reverse: true },
  { text: "Saya percaya bahwa orang pada dasarnya baik.", trait: "A", reverse: false },
  { text: "Saya mudah memaafkan kesalahan orang lain.", trait: "A", reverse: false },

  { text: "Saya sering merasa cemas dan tegang.", trait: "N", reverse: false },
  { text: "Saya mudah mengalami perubahan suasana hati.", trait: "N", reverse: false },
  { text: "Saya biasanya merasa tenang dan santai.", trait: "N", reverse: true },
  { text: "Saya sering khawatir tentang hal-hal kecil.", trait: "N", reverse: false },
  { text: "Saya jarang merasa sedih atau tertekan.", trait: "N", reverse: true },
  { text: "Saya mudah stres dalam situasi sulit.", trait: "N", reverse: false },
];

const LIKERT_LABELS = ["Sangat Tidak Setuju", "Tidak Setuju", "Netral", "Setuju", "Sangat Setuju"];

const TRAIT_LABELS: Record<string, string> = {
  O: "Openness (Keterbukaan)",
  C: "Conscientiousness (Kehati-hatian)",
  E: "Extraversion (Ekstroversi)",
  A: "Agreeableness (Keramahan)",
  N: "Neuroticism (Neurotisme)",
};

const TRAIT_DESC: Record<string, { low: string; high: string }> = {
  O: {
    low: "Anda cenderung praktis, konvensional, dan menyukai rutinitas. Anda lebih nyaman dengan hal-hal yang sudah dikenal dan kurang tertarik pada pengalaman baru atau ide-ide abstrak.",
    high: "Anda sangat terbuka terhadap pengalaman baru, imajinatif, dan ingin tahu. Anda menikmati seni, petualangan intelektual, dan ide-ide yang tidak biasa.",
  },
  C: {
    low: "Anda cenderung spontan dan fleksibel, namun mungkin kurang terorganisir. Anda lebih santai dalam pendekatan terhadap tugas dan tenggat waktu.",
    high: "Anda sangat terorganisir, disiplin, dan dapat diandalkan. Anda menetapkan tujuan tinggi dan bekerja keras untuk mencapainya dengan pendekatan yang sistematis.",
  },
  E: {
    low: "Anda cenderung pendiam, mandiri, dan menikmati waktu sendiri. Anda lebih suka interaksi sosial yang intim dan bermakna daripada keramaian.",
    high: "Anda sangat ramah, energik, dan menikmati interaksi sosial. Anda merasa nyaman menjadi pusat perhatian dan mendapatkan energi dari bersama orang lain.",
  },
  A: {
    low: "Anda cenderung kompetitif, skeptis, dan lebih mengutamakan kepentingan diri sendiri. Anda tidak ragu untuk menyuarakan ketidaksetujuan.",
    high: "Anda sangat peduli dengan orang lain, kooperatif, dan penuh kasih sayang. Anda menghindari konflik dan berusaha menjaga keharmonisan dalam hubungan.",
  },
  N: {
    low: "Anda cenderung tenang, stabil secara emosional, dan tidak mudah stres. Anda mampu menghadapi tekanan dengan sikap yang terkendali dan positif.",
    high: "Anda cenderung mengalami emosi negatif seperti kecemasan, kekhawatiran, dan ketidakstabilan suasana hati. Anda lebih sensitif terhadap stres dan tekanan hidup.",
  },
};

function computeScore(answers: Record<number, number>, questions: Question[], traitId: string): number {
  const traitQs = questions.filter((q) => q.trait === traitId);
  const total = traitQs.reduce((sum, q, i) => {
    const idx = questions.indexOf(q);
    const raw = answers[idx] ?? 2;
    return sum + (q.reverse ? 5 - raw : raw);
  }, 0);
  const max = traitQs.length * 5;
  const min = traitQs.length * 1;
  return Math.round(((total - min) / (max - min)) * 100);
}

export default function PersonalityTestPage() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const allAnswered = QUESTIONS.every((_, i) => answers[i] !== undefined);

  const scores = useMemo(() => {
    if (!submitted) return null;
    return {
      O: computeScore(answers, QUESTIONS, "O"),
      C: computeScore(answers, QUESTIONS, "C"),
      E: computeScore(answers, QUESTIONS, "E"),
      A: computeScore(answers, QUESTIONS, "A"),
      N: computeScore(answers, QUESTIONS, "N"),
    };
  }, [submitted, answers]);

  const handleAnswer = (qIdx: number, value: number) => {
    setAnswers((prev) => ({ ...prev, [qIdx]: value }));
  };

  const handleSubmit = () => {
    if (!allAnswered) return;
    setSubmitted(true);
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
  };

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-12">
      <PageTitle title="Personality Test" />
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <h1 className="apple-headline text-[32px] leading-[1.47] tracking-[-0.374px] mb-2">
        Personality Test
      </h1>
      <p className="text-[13px] text-[var(--color-ink-muted-48)] mb-8 text-center max-w-xl">
        Ukur kepribadian Anda berdasarkan model Big Five (OCEAN). Jawab 30 pertanyaan dengan jujur untuk mengetahui skor Anda pada setiap dimensi kepribadian.
      </p>

      {!submitted ? (
        <>
          <div className="w-full max-w-2xl space-y-3 mb-6">
            {QUESTIONS.map((q, i) => (
              <div key={i} className="apple-card px-5 py-4">
                <div className="flex items-start gap-3">
                  <span className="text-[11px] font-semibold text-[var(--color-ink-muted-48)] leading-[1.6] mt-0.5 shrink-0 w-6 text-right">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] leading-[1.5] text-[var(--color-ink)] mb-2">{q.text}</p>
                    <div className="flex gap-1.5">
                      {LIKERT_LABELS.map((label, li) => (
                        <button
                          key={li}
                          onClick={() => handleAnswer(i, li)}
                          className={`flex-1 text-[10px] leading-[1.2] py-2 px-1 rounded-[8px] border transition-all ${
                            answers[i] === li
                              ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                              : "bg-[var(--color-canvas)] text-[var(--color-ink-muted-48)] border-[var(--color-hairline)] hover:border-[var(--color-primary)]"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className="apple-btn-primary text-[14px] disabled:opacity-40"
          >
            {allAnswered ? "Lihat Hasil" : `Jawab semua pertanyaan (${Object.keys(answers).length}/${QUESTIONS.length})`}
          </button>
        </>
      ) : (
        <div className="w-full max-w-2xl space-y-5">
          <button onClick={handleReset} className="apple-btn-ghost text-[13px] mb-2">
            ← Kerjakan Ulang
          </button>

          {scores && (
            <>
              <div className="apple-card px-6 py-5">
                <h2 className="text-[14px] font-semibold uppercase text-[var(--color-ink-muted-48)] mb-4 tracking-[-0.224px]">
                  Skor Kepribadian Big Five
                </h2>
                {(["O", "C", "E", "A", "N"] as const).map((trait) => {
                  const score = scores[trait];
                  return (
                    <div key={trait} className="mb-4 last:mb-0">
                      <div className="flex justify-between items-baseline mb-1.5">
                        <span className="text-[13px] font-medium text-[var(--color-ink)]">{TRAIT_LABELS[trait]}</span>
                        <span className="text-[13px] font-semibold text-[var(--color-ink-muted-48)] tabular-nums">{score}/100</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[var(--color-divider-soft)] overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${score}%`, background: score >= 66 ? "#34c759" : score >= 33 ? "#ff9f0a" : "#ff3b30" }}
                        />
                      </div>
                      <p className="text-[12px] leading-[1.5] text-[var(--color-ink-muted-48)] mt-1.5">
                        {score >= 50 ? TRAIT_DESC[trait].high : TRAIT_DESC[trait].low}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="apple-card px-6 py-5">
                <p className="text-[12px] leading-[1.6] text-[var(--color-ink-muted-48)] italic">
                  Berdasarkan model Big Five Personality Traits (Lewis Goldberg, 1993; McCrae &amp; Costa, 2003).
                  Hasil ini bersifat indikatif dan tidak menggantikan asesmen psikologis profesional.
                </p>
              </div>
            </>
          )}
        </div>
      )}

      <div className="w-full max-w-2xl mt-6">
        <Disclaimer type="divination" />
      </div>
    </div>
  );
}
