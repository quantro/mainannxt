"use client";

import { useState } from "react";
import ThemeToggle from "../theme-toggle";
import { Disclaimer } from "../disclaimer";
import { PageTitle } from "../page-title";

interface Emotion {
  id: string;
  name: string;
  description: string;
  opposite: string;
  combinations: { with: string; produces: string }[];
  lowIntensity: string;
  highIntensity: string;
  color: string;
}

const EMOTIONS: Emotion[] = [
  {
    id: "joy",
    name: "Kegembiraan",
    description:
      "Perasaan positif yang muncul saat mencapai sesuatu yang berharga, mendapatkan pengakuan, atau mengalami hal yang menyenangkan. Membawa energi, keterbukaan, dan keinginan untuk berbagi.",
    opposite: "Kesedihan",
    combinations: [
      { with: "Trust", produces: "Cinta (Love)" },
      { with: "Anticipation", produces: "Optimisme (Optimism)" },
    ],
    lowIntensity: "Ketenangan (Serenity)",
    highIntensity: "Ekstasi (Ecstasy)",
    color: "#FFD700",
  },
  {
    id: "trust",
    name: "Kepercayaan",
    description:
      "Perasaan aman dan yakin terhadap seseorang, ide, atau situasi. Memungkinkan kerja sama, keintiman, dan ikatan sosial yang kuat. Fondasi dari hubungan yang sehat.",
    opposite: "Kebencian",
    combinations: [
      { with: "Joy", produces: "Cinta (Love)" },
      { with: "Fear", produces: "Ketundukan (Submission)" },
    ],
    lowIntensity: "Penerimaan (Acceptance)",
    highIntensity: "Kekaguman (Admiration)",
    color: "#4CAF50",
  },
  {
    id: "fear",
    name: "Ketakutan",
    description:
      "Respons terhadap ancaman atau bahaya yang dirasakan. Mengaktifkan mekanisme 'fight or flight' — melindungi kita dari risiko, tetapi juga bisa membatasi jika berlebihan.",
    opposite: "Kemarahan",
    combinations: [
      { with: "Trust", produces: "Ketundukan (Submission)" },
      { with: "Surprise", produces: "Kengerian (Awe)" },
    ],
    lowIntensity: "Kekhawatiran (Apprehension)",
    highIntensity: "Teror (Terror)",
    color: "#9C27B0",
  },
  {
    id: "surprise",
    name: "Kejutan",
    description:
      "Respons singkat terhadap peristiwa yang tidak terduga. Dapat bersifat positif atau negatif. Membantu kita fokus pada situasi baru dan mempersiapkan respons yang sesuai.",
    opposite: "Antisipasi",
    combinations: [
      { with: "Fear", produces: "Kengerian (Awe)" },
      { with: "Sadness", produces: "Kekecewaan (Disapproval)" },
    ],
    lowIntensity: "Gangguan (Distraction)",
    highIntensity: "Keheranan (Amazement)",
    color: "#FF9800",
  },
  {
    id: "sadness",
    name: "Kesedihan",
    description:
      "Perasaan kehilangan, kekecewaan, atau ketidakberdayaan. Meskipun terasa berat, kesedihan memiliki fungsi penting — memberi waktu untuk memproses kehilangan dan mendapatkan dukungan sosial.",
    opposite: "Kegembiraan",
    combinations: [
      { with: "Surprise", produces: "Kekecewaan (Disapproval)" },
      { with: "Disgust", produces: "Penyesalan (Remorse)" },
    ],
    lowIntensity: "Kesuraman (Pensiveness)",
    highIntensity: "Duka Cita (Grief)",
    color: "#2196F3",
  },
  {
    id: "disgust",
    name: "Kejijikan",
    description:
      "Respons penolakan terhadap sesuatu yang dianggap menjijikkan, berbahaya, atau tidak bermoral. Melindungi kita dari hal-hal yang dapat membahayakan secara fisik maupun sosial.",
    opposite: "Kepercayaan",
    combinations: [
      { with: "Sadness", produces: "Penyesalan (Remorse)" },
      { with: "Anger", produces: "Kebencian (Contempt)" },
    ],
    lowIntensity: "Ketidaksukaan (Dislike)",
    highIntensity: "Kebencian (Loathing)",
    color: "#795548",
  },
  {
    id: "anger",
    name: "Kemarahan",
    description:
      "Respons terhadap ketidakadilan, hambatan, atau penghinaan. Memberikan energi untuk mengatasi rintangan dan menegakkan batasan. Bermasalah saat tidak terkendali.",
    opposite: "Ketakutan",
    combinations: [
      { with: "Disgust", produces: "Kebencian (Contempt)" },
      { with: "Anticipation", produces: "Agresivitas (Aggressiveness)" },
    ],
    lowIntensity: "Kekesalan (Annoyance)",
    highIntensity: "Kemarahan (Rage)",
    color: "#F44336",
  },
  {
    id: "anticipation",
    name: "Antisipasi",
    description:
      "Perasaan menanti sesuatu yang akan terjadi. Melibatkan pemikiran ke depan, perencanaan, dan harapan. Bisa terasa menyenangkan (menanti liburan) atau mencemaskan (menanti hasil tes).",
    opposite: "Kejutan",
    combinations: [
      { with: "Joy", produces: "Optimisme (Optimism)" },
      { with: "Anger", produces: "Agresivitas (Aggressiveness)" },
    ],
    lowIntensity: "Minat (Interest)",
    highIntensity: "Kewaspadaan (Vigilance)",
    color: "#00BCD4",
  },
];

const EmotionWedge = ({
  emotion,
  index,
  selected,
  onSelect,
}: {
  emotion: Emotion;
  index: number;
  selected: boolean;
  onSelect: () => void;
}) => {
  const angle = (index * 360) / EMOTIONS.length;
  const rotation = angle - 90;

  return (
    <button
      onClick={onSelect}
      className="absolute inset-0 w-full h-full cursor-pointer transition-transform duration-200 hover:scale-105"
      style={{
        clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos(((angle - 22.5) * Math.PI) / 180)}% ${50 + 50 * Math.sin(((angle - 22.5) * Math.PI) / 180)}%, ${50 + 50 * Math.cos(((angle + 22.5) * Math.PI) / 180)}% ${50 + 50 * Math.sin(((angle + 22.5) * Math.PI) / 180)}%)`,
      }}
    >
      <div
        className="absolute w-full h-full flex items-center justify-center"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <span
          className="text-white text-[10px] font-semibold leading-tight text-center drop-shadow-sm"
          style={{
            transform: `rotate(${-rotation}deg)`,
            writingMode: "vertical-rl",
            textOrientation: "mixed",
          }}
        >
          {emotion.name}
        </span>
      </div>
    </button>
  );
};

export default function EmotionWheelPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = EMOTIONS.find((e) => e.id === selectedId) ?? null;

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-12">
      <PageTitle title="Emotion Wheel" />
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <h1 className="apple-headline text-[34px] leading-[1.47] tracking-[-0.374px] mb-2">
        Emotion Wheel
      </h1>
      <p className="text-[13px] text-[var(--color-ink-muted-48)] mb-8 text-center max-w-lg">
        Roda Emosi Plutchik &mdash; Jelajahi 8 emosi dasar dan hubungannya. Klik emosi untuk detail.
      </p>

      <div className="w-full max-w-[500px] mx-auto mb-8">
        <div className="relative w-full aspect-square">
          <div className="absolute inset-0 rounded-full border-2 border-[var(--color-hairline)] overflow-hidden">
            {EMOTIONS.map((emotion, i) => (
              <div
                key={emotion.id}
                className="absolute inset-0"
                style={{
                  background: `conic-gradient(from ${(i * 360) / EMOTIONS.length - 22.5}deg, ${emotion.color}88 0deg, ${emotion.color}88 45deg, transparent 45deg)`,
                  clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos((((i * 360) / EMOTIONS.length - 22.5) * Math.PI) / 180)}% ${50 + 50 * Math.sin((((i * 360) / EMOTIONS.length - 22.5) * Math.PI) / 180)}%, ${50 + 50 * Math.cos((((i * 360) / EMOTIONS.length + 22.5) * Math.PI) / 180)}% ${50 + 50 * Math.sin((((i * 360) / EMOTIONS.length + 22.5) * Math.PI) / 180)}%)`,
                }}
              >
                <button
                  onClick={() => setSelectedId(emotion.id)}
                  className="w-full h-full cursor-pointer transition-opacity hover:opacity-80"
                >
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{
                      transform: `rotate(${(i * 360) / EMOTIONS.length}deg)`,
                    }}
                  >
                    <span
                      className="text-white text-[10px] sm:text-[11px] font-semibold leading-tight text-center px-1 drop-shadow-sm"
                      style={{
                        transform: `rotate(${-(i * 360) / EMOTIONS.length}deg)`,
                        textShadow: "0 1px 3px rgba(0,0,0,0.5)",
                      }}
                    >
                      {emotion.name}
                    </span>
                  </div>
                </button>
              </div>
            ))}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30%] h-[30%] rounded-full bg-[var(--color-canvas)] border-2 border-[var(--color-hairline)] flex items-center justify-center z-10">
              <span className="text-[10px] font-semibold text-[var(--color-ink-muted-48)] text-center leading-tight">
                Emosi<br/>Dasar
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-2xl space-y-3 mb-6">
        {!selected && (
          <div className="apple-card px-6 py-5 text-center">
            <p className="text-[14px] text-[var(--color-ink-muted-48)]">
              Klik salah satu emosi pada roda di atas untuk melihat deskripsi lengkap, lawan, dan kombinasinya.
            </p>
          </div>
        )}
        {selected && (
          <>
            <div className="apple-card px-6 py-5" style={{ borderLeftColor: selected.color, borderLeftWidth: 4 }}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: selected.color }} />
                <h2 className="text-[20px] font-bold text-[var(--color-ink)]">
                  {selected.name}
                </h2>
              </div>
              <p className="text-[14px] leading-[1.7] text-[var(--color-ink)] mb-3">
                {selected.description}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-[var(--color-surface-pearl)] rounded-[11px] px-4 py-3">
                  <span className="text-[10px] font-semibold uppercase text-[var(--color-ink-muted-48)] tracking-wider">
                    Intensitas Rendah
                  </span>
                  <p className="text-[13px] font-semibold text-[var(--color-ink)] mt-1">
                    {selected.lowIntensity}
                  </p>
                </div>
                <div className="bg-[var(--color-surface-pearl)] rounded-[11px] px-4 py-3">
                  <span className="text-[10px] font-semibold uppercase text-[var(--color-ink-muted-48)] tracking-wider">
                    Intensitas Tinggi
                  </span>
                  <p className="text-[13px] font-semibold text-[var(--color-ink)] mt-1">
                    {selected.highIntensity}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="apple-card px-6 py-4">
                <span className="text-[10px] font-semibold uppercase text-[var(--color-ink-muted-48)] tracking-wider">
                  Lawan
                </span>
                <p className="text-[15px] font-semibold text-[var(--color-ink)] mt-1">
                  {selected.opposite}
                </p>
              </div>
              <div className="apple-card px-6 py-4">
                <span className="text-[10px] font-semibold uppercase text-[var(--color-ink-muted-48)] tracking-wider">
                  Kombinasi
                </span>
                <div className="mt-1 space-y-0.5">
                  {selected.combinations.map((c) => (
                    <p key={c.with} className="text-[13px] text-[var(--color-ink)]">
                      {emotionLabel(c.with)} &rarr; {c.produces}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="w-full max-w-2xl apple-card px-6 py-4 mb-6">
        <p className="text-[11px] leading-[1.6] text-[var(--color-ink-muted-48)] text-center italic">
          Berdasarkan <em>Wheel of Emotions</em> (Robert Plutchik, 1980)
        </p>
      </div>

      <Disclaimer type="divination" />
    </div>
  );
}

function emotionLabel(id: string): string {
  const map: Record<string, string> = {
    joy: "Kegembiraan",
    trust: "Kepercayaan",
    fear: "Ketakutan",
    surprise: "Kejutan",
    sadness: "Kesedihan",
    disgust: "Kejijikan",
    anger: "Kemarahan",
    anticipation: "Antisipasi",
  };
  return map[id] ?? id;
}
