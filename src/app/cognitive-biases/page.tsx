"use client";

import { useMemo, useState } from "react";
import ThemeToggle from "../theme-toggle";
import { Disclaimer } from "../disclaimer";
import { PageTitle } from "../page-title";

interface Bias {
  name: string;
  description: string;
  example: string;
  category: string;
}

const BIASES: Bias[] = [
  {
    name: "Actor-Observer Bias",
    description:
      "Kecenderungan menjelaskan perilaku orang lain berdasarkan karakter internal mereka, sementara menjelaskan perilaku sendiri berdasarkan faktor situasional. Saat kita gagal, itu karena keadaan; saat orang lain gagal, itu karena siapa mereka.",
    example:
      "Kamu melihat seseorang terjatuh dari sepeda lalu berpikir 'ceroboh sekali'. Tapi saat kamu sendiri terjatuh, kamu beralasan 'ada lubang di jalan dan remnya blong'.",
    category: "Social",
  },
  {
    name: "Halo Effect",
    description:
      "Kesan positif pada satu sifat (misalnya penampilan fisik) memengaruhi penilaian kita terhadap sifat-sifat lain secara keseluruhan. Kecantikan menciptakan 'aura' yang membuat kita menganggap seseorang juga pintar, baik hati, atau kompeten.",
    example:
      "Seseorang yang tampan atau cantik lebih mudah dianggap kompeten dalam wawancara kerja, meskipun belum ada bukti tentang kemampuannya.",
    category: "Social",
  },
  {
    name: "Self-Serving Bias",
    description:
      "Kecenderungan mengambil kredit atas keberhasilan (saya berhasil karena kerja kerasku) dan menyalahkan faktor eksternal atas kegagalan (saya gagal karena soalnya tidak adil). Melindungi harga diri dengan mendistorsi atribusi kausal.",
    example:
      "Dapat nilai A: 'Aku memang pintar dan belajar keras.' Dapat nilai D: 'Gurunya tidak jelas ngajarnya dan soalnya menjebak.'",
    category: "Social",
  },
  {
    name: "Fundamental Attribution Error",
    description:
      "Kecenderungan terlalu menekankan faktor kepribadian/disposisi dalam menjelaskan perilaku orang lain, sambil meremehkan faktor situasional. Kita melihat karakter, bukan konteks.",
    example:
      "Saat melihat pengemis di jalan, kamu berpikir 'dia malas dan tidak mau bekerja' tanpa tahu bahwa dia baru saja kehilangan pekerjaan karena pabrik tutup dan memiliki tiga anak yang harus diberi makan.",
    category: "Social",
  },
  {
    name: "Availability Heuristic",
    description:
      "Menilai kemungkinan suatu peristiwa berdasarkan seberapa mudah contoh-contohnya muncul di benak kita. Peristiwa yang dramatis dan mudah diingat dianggap lebih sering terjadi daripada yang sebenarnya.",
    example:
      "Setelah menonton berita tentang kecelakaan pesawat, kamu merasa naik pesawat sangat berbahaya — padahal secara statistik, mobil jauh lebih berbahaya. Kecelakaan pesawat lebih 'tersedia' di ingatan karena diliput secara luas.",
    category: "Memory",
  },
  {
    name: "Misinformation Effect",
    description:
      "Ingatan tentang suatu peristiwa menjadi terdistorsi oleh informasi yang didapat setelah peristiwa tersebut terjadi. Ingatan kita tidak statis — ia dapat ditulis ulang oleh informasi baru.",
    example:
      "Setelah menonton berita tentang tabrakan mobil, seorang saksi mata yang awalnya mengatakan mobil itu berwarna biru, setelah polisi menyebut 'mobil merah', mulai 'mengingat' mobil itu berwarna merah.",
    category: "Memory",
  },
  {
    name: "Peak-End Rule",
    description:
      "Kita menilai suatu pengalaman bukan berdasarkan total durasi atau rata-rata momennya, melainkan berdasarkan momen puncak (peak) dan bagian akhir (end) dari pengalaman tersebut.",
    example:
      "Liburan ke pantai yang melelahkan karena macet 5 jam tetap terasa menyenangkan karena sunset di akhir perjalanan sangat indah. Momen puncak dan akhir menentukan keseluruhan kesan.",
    category: "Memory",
  },
  {
    name: "Serial Position Effect",
    description:
      "Kecenderungan lebih mudah mengingat item pertama (primacy effect) dan item terakhir (recency effect) dalam suatu daftar, sementara item di tengah lebih mudah dilupakan.",
    example:
      "Dalam rapat tim, kamu mengingat dengan jelas presentasi pembuka (pertama) dan kesimpulan (terakhir), tetapi hampir lupa apa yang disampaikan orang ketiga di tengah sesi.",
    category: "Memory",
  },
  {
    name: "Confirmation Bias",
    description:
      "Kecenderungan mencari, menafsirkan, dan mengingat informasi yang menegaskan keyakinan yang sudah ada sambil mengabaikan bukti yang bertentangan. Kita melihat apa yang ingin kita lihat.",
    example:
      "Seorang perokok membaca artikel 'Merokok Membantu Konsentrasi' dan membagikannya ke grup WA, tetapi mengabaikan laporan dari WHO tentang 8 juta kematian akibat rokok per tahun karena tidak sesuai dengan kebiasaannya.",
    category: "Decision",
  },
  {
    name: "Anchoring",
    description:
      "Kecenderungan terlalu bergantung pada informasi pertama yang diterima (anchor) saat membuat keputusan. Angka pertama yang kita dengar menjadi 'jangkar' yang memengaruhi penilaian selanjutnya.",
    example:
      "Mobil diiklankan seharga Rp 500 juta, lalu didiskon menjadi Rp 400 juta. Rp 400 juta terasa murah karena jangkar awalnya Rp 500 juta — meskipun harga pasar mobil itu sebenarnya Rp 350 juta.",
    category: "Decision",
  },
  {
    name: "Sunk Cost Fallacy",
    description:
      "Kecenderungan terus berinvestasi dalam sesuatu yang sudah terbukti gagal hanya karena sudah banyak waktu, uang, atau tenaga yang dikeluarkan. 'Sudah terlanjur' adalah mantra paling mahal di dunia.",
    example:
      "Kamu tetap menonton film jelek di bioskop sampai habis karena sudah bayar tiket Rp 50.000, bukannya pergi dan melakukan hal yang lebih bermanfaat. Uang itu sudah hilang — yang tersisa hanyalah waktumu.",
    category: "Decision",
  },
  {
    name: "Framing Effect",
    description:
      "Cara penyajian informasi (frame) memengaruhi keputusan yang diambil, meskipun informasi yang disajikan secara substansial sama. Manusia bereaksi berbeda terhadap 'kehilangan' vs 'keuntungan'.",
    example:
      "80% daging bebas lemak' terdengar lebih sehat daripada '20% mengandung lemak' — padahal keduanya fakta yang sama. Bedanya hanya pada cara membingkai informasinya.",
    category: "Decision",
  },
  {
    name: "Dunning-Kruger Effect",
    description:
      "Orang dengan kompetensi rendah cenderung melebih-lebihkan kemampuan mereka, sementara ahli cenderung meremehkan kemampuan sendiri. Ketidaktahuan bukanlah kebahagiaan — tetapi memberikan ilusi keunggulan.",
    example:
      "Seseorang yang baru belajar gitar selama seminggu merasa sudah cukup mahir untuk tampil di kafe, sementara musisi profesional yang sudah 15 tahun bermain masih merasa perlu banyak belajar.",
    category: "Decision",
  },
  {
    name: "Optimism Bias",
    description:
      "Kecenderungan meremehkan kemungkinan mengalami kejadian negatif di masa depan. Kita pikir 'itu tidak akan terjadi pada saya' — padahal statistik berkata lain.",
    example:
      "80% orang mengira mereka adalah pengemudi di atas rata-rata. Setiap perokok berpikir mereka yang akan selamat dari kanker paru-paru. Setiap pengusaha pikir startup mereka yang akan berhasil, bukan 90% yang gagal.",
    category: "Belief",
  },
  {
    name: "Backfire Effect",
    description:
      "Ketika keyakinan inti seseorang ditantang oleh bukti yang bertentangan, alih-alih mengubah keyakinan, mereka justru semakin memperkuat keyakinannya. Fakta bisa memiliki efek sebaliknya.",
    example:
      "Memberi data vaksinasi yang aman kepada seseorang yang percaya vaksin berbahaya justru membuat mereka semakin yakin bahwa vaksin adalah konspirasi. Semakin kuat bukti yang disajikan, semakin kuat penolakannya.",
    category: "Belief",
  },
  {
    name: "Curse of Knowledge",
    description:
      "Sulitnya membayangkan apa yang dirasakan seseorang yang tidak tahu apa yang kita tahu. Begitu kita memahami sesuatu, kita lupa bagaimana rasanya tidak memahaminya.",
    example:
      "Seorang programmer menjelaskan konsep 'rekursi' dengan kode Python ke neneknya yang baru belajar WhatsApp, lalu bingung kenapa neneknya tidak paham. 'Kan jelas banget tinggal panggil diri sendiri.'",
    category: "Belief",
  },
  {
    name: "Placebo Effect",
    description:
      "Keyakinan bahwa suatu perawatan akan bekerja dapat menghasilkan perubahan fisiologis yang nyata — bahkan jika perawatan itu tidak memiliki kandungan aktif. Pikiran menyembuhkan tubuh.",
    example:
      "Pasien diberi pil gula (placebo) dan diberi tahu itu obat sakit kepala. 30-40% pasien melaporkan sakit kepalanya berkurang — bukan karena pilnya, tapi karena keyakinan mereka bahwa pil itu bekerja.",
    category: "Belief",
  },
];

const CATEGORIES = ["All", "Social", "Memory", "Decision", "Belief"];

const CATEGORY_COLORS: Record<string, string> = {
  Social: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  Memory: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  Decision: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  Belief: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
};

export default function CognitiveBiasesPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    let result = BIASES;
    if (activeCategory !== "All") {
      result = result.filter((b) => b.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q) ||
          b.example.toLowerCase().includes(q)
      );
    }
    return result;
  }, [search, activeCategory]);

  const toggle = (name: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-12">
      <PageTitle title="Cognitive Biases" />
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <h1 className="cosmic-headline text-[34px] leading-[1.47] tracking-[-0.374px] mb-2">
        Cognitive Biases
      </h1>
      <p className="text-[13px] text-[var(--color-ink-muted-48)] mb-3 text-center max-w-lg">
        Eksplorasi bias kognitif yang memengaruhi cara berpikir, mengambil keputusan, dan mengingat
        — berdasarkan penelitian Kahneman &amp; Tversky.
      </p>

      <div className="w-full max-w-2xl cosmic-card px-6 py-5 mb-4">
        <div className="flex items-center gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari bias berdasarkan nama, deskripsi, atau contoh..."
            className="cosmic-input w-full h-10 text-[14px] flex-1"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-[12px] leading-[1] px-3 py-2 rounded-[11px] bg-[var(--color-surface-pearl)] text-[var(--color-ink-muted-48)] hover:text-[var(--color-ink)] transition-colors"
            >
              Clear
            </button>
          )}
        </div>
        {search && (
          <p className="text-[11px] text-[var(--color-ink-muted-48)] mt-2">
            Menampilkan {filtered.length} dari {BIASES.length} bias
          </p>
        )}
        {!search && (
          <p className="text-[11px] text-[var(--color-ink-muted-48)] mt-2">
            {BIASES.length} bias kognitif tersedia
          </p>
        )}
      </div>

      <div className="w-full max-w-2xl flex flex-wrap gap-2 mb-5">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`text-[12px] leading-[1] px-3 py-2 rounded-[11px] transition-colors ${
              activeCategory === cat
                ? "bg-[var(--color-primary)] text-[var(--color-on-primary)]"
                : "bg-[var(--color-surface-pearl)] text-[var(--color-ink-muted-48)] hover:text-[var(--color-ink)]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="w-full max-w-2xl space-y-3">
        {filtered.length === 0 && (
          <div className="cosmic-card px-6 py-8 text-center">
            <p className="text-[14px] text-[var(--color-ink-muted-48)]">
              Tidak ada bias yang cocok dengan &ldquo;{search}&rdquo;.
            </p>
          </div>
        )}
        {filtered.map((bias) => (
          <div key={bias.name} className="cosmic-card px-6 py-4">
            <button
              onClick={() => toggle(bias.name)}
              className="w-full text-left flex items-center justify-between gap-3"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[17px] font-semibold text-[var(--color-ink)]">
                    {bias.name}
                  </span>
                  <span
                    className={`text-[10px] font-medium px-1.5 py-0.5 rounded-[4px] ${CATEGORY_COLORS[bias.category]} bg-[var(--color-surface-pearl)]`}
                  >
                    {bias.category}
                  </span>
                </div>
                <p className="text-[12px] text-[var(--color-ink-muted-48)] line-clamp-2">
                  {bias.description}
                </p>
              </div>
              <span
                className="text-[var(--color-ink-muted-48)] shrink-0 transition-transform duration-200"
                style={{
                  transform: expanded.has(bias.name) ? "rotate(180deg)" : "rotate(0deg)",
                }}
              >
                ▼
              </span>
            </button>
            {expanded.has(bias.name) && (
              <div className="mt-3 pt-3 border-t border-[var(--color-divider-soft)]">
                <p className="text-[13px] leading-[1.7] text-[var(--color-ink)] mb-3">
                  {bias.description}
                </p>
                <div className="bg-[var(--color-surface-pearl)] rounded-[11px] px-4 py-3">
                  <span className="text-[10px] font-semibold uppercase text-[var(--color-ink-muted-48)] tracking-wider">
                    Contoh:
                  </span>
                  <p className="text-[13px] leading-[1.7] text-[var(--color-ink)] mt-1">
                    {bias.example}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="w-full max-w-2xl cosmic-card px-6 py-4 mt-6">
        <p className="text-[11px] leading-[1.6] text-[var(--color-ink-muted-48)] text-center italic">
          Berdasarkan penelitian Daniel Kahneman &amp; Amos Tversky (1972&ndash;2012) serta{" "}
          <em>Thinking, Fast and Slow</em> (Kahneman, 2011)
        </p>
      </div>

      <Disclaimer type="divination" />
    </div>
  );
}
