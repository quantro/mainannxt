"use client";

import { useMemo, useState } from "react";
import ThemeToggle from "../theme-toggle";
import { Disclaimer } from "../disclaimer";
import { PageTitle } from "../page-title";

const QUESTIONS = [
  "Seberapa sering Anda merasa kesulitan untuk rileks?",
  "Seberapa sering Anda merasa tegang atau gelisah?",
  "Seberapa sering Anda merasa mudah marah atau tersinggung?",
  "Seberapa sering Anda merasa kewalahan oleh tanggung jawab sehari-hari?",
  "Seberapa sering Anda merasa sulit berkonsentrasi karena pikiran yang mengganggu?",
  "Seberapa sering Anda merasa cemas tentang hal-hal di luar kendali Anda?",
  "Seberapa sering Anda merasa lelah meskipun tidak melakukan aktivitas berat?",
  "Seberapa sering Anda mengalami gangguan tidur karena pikiran yang tidak tenang?",
  "Seberapa sering Anda merasa jantung berdebar atau napas terasa sesak saat cemas?",
  "Seberapa sering Anda merasa khawatir berlebihan tentang masa depan?",
];

const FREQ_LABELS = ["Tidak Pernah", "Jarang", "Kadang-Kadang", "Sering", "Sangat Sering"];

function getScoreCategory(score: number): { label: string; color: string; desc: string } {
  if (score <= 15) {
    return {
      label: "Rendah",
      color: "#34c759",
      desc: "Skor Anda tergolong rendah, yang menunjukkan bahwa tingkat stres dan kecemasan Anda relatif ringan. Anda tampaknya mampu mengelola tekanan sehari-hari dengan cukup baik. Tetaplah menjaga keseimbangan hidup dan terus praktikkan kebiasaan sehat yang sudah Anda lakukan.",
    };
  }
  if (score <= 30) {
    return {
      label: "Sedang",
      color: "#ff9f0a",
      desc: "Skor Anda berada pada tingkat sedang. Ini menunjukkan bahwa Anda mengalami tingkat stres dan kecemasan yang cukup berarti. Pertimbangkan untuk menerapkan teknik manajemen stres seperti latihan pernapasan, olahraga teratur, atau berbicara dengan teman atau keluarga. Jika gejala mulai mengganggu keseharian, konsultasikan dengan profesional kesehatan mental.",
    };
  }
  return {
    label: "Tinggi",
    color: "#ff3b30",
    desc: "Skor Anda tergolong tinggi, yang mengindikasikan tingkat stres dan kecemasan yang signifikan. Anda mungkin mengalami kesulitan dalam menjalani aktivitas sehari-hari. Sangat disarankan untuk mencari dukungan profesional, seperti psikolog atau psikiater. Anda tidak sendirian, dan bantuan tersedia.",
  };
}

export default function StressAssessmentPage() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const allAnswered = QUESTIONS.every((_, i) => answers[i] !== undefined);

  const score = useMemo(() => {
    if (!submitted) return null;
    const total = QUESTIONS.reduce((sum, _, i) => sum + (answers[i] ?? 0), 0);
    return total;
  }, [submitted, answers]);

  const category = useMemo(() => {
    if (score === null) return null;
    return getScoreCategory(score);
  }, [score]);

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
      <PageTitle title="Stress & Anxiety Assessment" />
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <h1 className="apple-headline text-[32px] leading-[1.47] tracking-[-0.374px] mb-2">
        Stress &amp; Anxiety Assessment
      </h1>
      <p className="text-[13px] text-[var(--color-ink-muted-48)] mb-8 text-center max-w-xl">
        Kuesioner singkat untuk mengukur tingkat stres dan kecemasan yang Anda alami. Jawablah berdasarkan perasaan Anda dalam <strong>dua minggu terakhir</strong>.
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
                    <p className="text-[14px] leading-[1.5] text-[var(--color-ink)] mb-2">{q}</p>
                    <div className="flex gap-1.5">
                      {FREQ_LABELS.map((label, li) => (
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

          {category && (
            <>
              <div className="apple-card px-6 py-5 text-center">
                <h2 className="text-[14px] font-semibold uppercase text-[var(--color-ink-muted-48)] mb-4 tracking-[-0.224px]">
                  Hasil Assessment
                </h2>
                <div className="text-[48px] font-bold tabular-nums" style={{ color: category.color }}>
                  {score}
                </div>
                <div className="text-[13px] text-[var(--color-ink-muted-48)] mb-1">dari 40</div>
                <div className="w-full max-w-xs mx-auto h-2 rounded-full bg-[var(--color-divider-soft)] overflow-hidden mt-3 mb-4">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${(score ?? 0) / 40 * 100}%`, background: category.color }}
                  />
                </div>
                <div
                  className="inline-block text-[14px] font-semibold px-3 py-1 rounded-full mb-3"
                  style={{ background: category.color, color: "#fff" }}
                >
                  {category.label}
                </div>
                <p className="text-[13px] leading-[1.6] text-[var(--color-ink-muted-48)] text-left">
                  {category.desc}
                </p>
              </div>

              <div className="apple-card px-6 py-5">
                <p className="text-[12px] leading-[1.6] text-[var(--color-ink-muted-48)] italic mb-3">
                  <strong>Peringatan:</strong> Instrumen ini BUKAN alat diagnosis medis. Hasil ini hanya untuk tujuan edukatif dan refleksi pribadi. Jika Anda mengalami gejala stres atau kecemasan yang mengganggu aktivitas sehari-hari, segera konsultasikan dengan tenaga kesehatan mental profesional.
                </p>
                <p className="text-[12px] leading-[1.6] text-[var(--color-ink-muted-48)] italic">
                  Terinspirasi dari Generalized Anxiety Disorder 7-item (GAD-7, Spitzer et al., 2006) dan Perceived Stress Scale (PSS, Cohen et al., 1983).
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
