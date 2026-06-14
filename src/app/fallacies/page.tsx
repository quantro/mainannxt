"use client";

import React, { useMemo, useState } from "react";
import ThemeToggle from "../theme-toggle";
import { Disclaimer } from "../disclaimer";
import { PageTitle } from "../page-title";

interface Fallacy {
  name: string;
  alias: string;
  description: string;
  example: string;
  category: string;
  Diagram: () => React.JSX.Element;
}

const FALLACIES: Fallacy[] = [
  {
    name: "Denying the Antecedent",
    alias: "Menyangkal Anteseden",
    description:
      "Kesesatan formal yang terjadi saat seseorang menyimpulkan bahwa konsekuen salah hanya karena antesedennya salah. Dalam logika, 'Jika P maka Q' dan 'bukan P' tidak otomatis berarti 'bukan Q' — Q bisa tetap benar karena alasan lain.",
    example:
      "Jika hujan, tanah basah. Tidak hujan. Maka tanah tidak basah. Padahal tanah bisa basah karena disiram, banjir, atau pipa bocor. Argumen ini mengabaikan kemungkinan lain yang tetap membuat Q benar meskipun P salah.",
    category: "Formal",
    Diagram: () => (
      <svg viewBox="0 0 320 120" className="w-full max-w-sm" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="10" y="10" width="90" height="36" rx="8" className="text-[var(--color-primary)]" stroke="currentColor" fill="none" />
        <text x="55" y="33" textAnchor="middle" fontSize="11" fill="currentColor" stroke="none" className="text-[var(--color-ink)]">P &rarr; Q</text>
        <rect x="10" y="56" width="90" height="36" rx="8" className="text-[var(--color-ink-muted-48)]" stroke="currentColor" fill="none" />
        <text x="55" y="79" textAnchor="middle" fontSize="11" fill="currentColor" stroke="none" className="text-[var(--color-ink-muted-48)]">&not;P</text>
        <line x1="100" y1="28" x2="130" y2="28" stroke="currentColor" strokeDasharray="4 3" />
        <line x1="100" y1="74" x2="130" y2="74" stroke="currentColor" strokeDasharray="4 3" />
        <line x1="130" y1="28" x2="130" y2="74" stroke="currentColor" />
        <line x1="130" y1="74" x2="160" y2="74" stroke="currentColor" />
        <line x1="160" y1="74" x2="160" y2="96" stroke="currentColor" />
        <line x1="155" y1="112" x2="160" y2="96" stroke="currentColor" />
        <line x1="165" y1="112" x2="160" y2="96" stroke="currentColor" />
        <rect x="115" y="96" width="90" height="36" rx="8" className="text-red-500" stroke="currentColor" fill="none" />
        <text x="160" y="119" textAnchor="middle" fontSize="11" fill="currentColor" stroke="none" className="text-red-500">&there4; &not;Q ✗</text>
        <circle cx="210" cy="28" r="8" className="text-[var(--color-ink-muted-48)]" stroke="currentColor" fill="none" />
        <text x="210" y="32" textAnchor="middle" fontSize="9" fill="currentColor" stroke="none" className="text-[var(--color-ink-muted-48)]">?</text>
        <line x1="210" y1="36" x2="210" y2="96" stroke="currentColor" strokeDasharray="3 3" />
      </svg>
    ),
  },
  {
    name: "Affirming the Consequent",
    alias: "Menegaskan Konsekuen",
    description:
      "Kesesatan yang terjadi saat seseorang menyimpulkan anteseden benar dari konsekuen yang benar. 'Jika P maka Q, Q benar, maka P benar' — padahal Q bisa benar tanpa P, karena faktor lain yang juga menghasilkan Q.",
    example:
      "Jika seseorang demam, ia sakit. Orang itu sakit. Maka ia pasti demam. Padahal sakit bisa berarti flu, keracunan, atau kondisi lain tanpa demam. 'Sakit' tidak secara otomatis berarti 'demam'.",
    category: "Formal",
    Diagram: () => (
      <svg viewBox="0 0 320 120" className="w-full max-w-sm" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="10" y="10" width="90" height="36" rx="8" className="text-[var(--color-primary)]" stroke="currentColor" fill="none" />
        <text x="55" y="33" textAnchor="middle" fontSize="11" fill="currentColor" stroke="none" className="text-[var(--color-ink)]">P &rarr; Q</text>
        <rect x="10" y="56" width="90" height="36" rx="8" className="text-[var(--color-primary)]" stroke="currentColor" fill="none" />
        <text x="55" y="79" textAnchor="middle" fontSize="11" fill="currentColor" stroke="none" className="text-[var(--color-ink)]">Q</text>
        <line x1="100" y1="28" x2="130" y2="28" stroke="currentColor" strokeDasharray="4 3" />
        <line x1="100" y1="74" x2="130" y2="74" stroke="currentColor" />
        <line x1="130" y1="28" x2="130" y2="74" stroke="currentColor" />
        <line x1="130" y1="74" x2="160" y2="74" stroke="currentColor" />
        <line x1="160" y1="74" x2="160" y2="96" stroke="currentColor" />
        <line x1="155" y1="112" x2="160" y2="96" stroke="currentColor" />
        <line x1="165" y1="112" x2="160" y2="96" stroke="currentColor" />
        <rect x="115" y="96" width="90" height="36" rx="8" className="text-red-500" stroke="currentColor" fill="none" />
        <text x="160" y="119" textAnchor="middle" fontSize="11" fill="currentColor" stroke="none" className="text-red-500">&there4; P ✗</text>
        <circle cx="210" cy="74" r="8" className="text-[var(--color-ink-muted-48)]" stroke="currentColor" fill="none" />
        <text x="210" y="78" textAnchor="middle" fontSize="9" fill="currentColor" stroke="none" className="text-[var(--color-ink-muted-48)]">?</text>
        <line x1="210" y1="82" x2="210" y2="96" stroke="currentColor" strokeDasharray="3 3" />
      </svg>
    ),
  },
  {
    name: "Undistributed Middle",
    alias: "Tengah Tak Terdistribusi",
    description:
      "Kesesatan dalam silogisme kategoris di mana istilah tengah (middle term) tidak terdistribusi dalam kedua premis. Agar kesimpulan valid, istilah tengah harus mencakup seluruh anggotanya di setidaknya satu premis.",
    example:
      "Semua kucing adalah mamalia. Semua anjing adalah mamalia. Maka semua kucing adalah anjing. — Istilah tengah 'mamalia' tidak terdistribusi: kucing dan anjing adalah subset mamalia, tapi tidak saling tumpang tindih.",
    category: "Formal",
    Diagram: () => (
      <svg viewBox="0 0 320 120" className="w-full max-w-sm" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="110" cy="60" rx="60" ry="50" className="text-blue-500" stroke="currentColor" fill="none" />
        <ellipse cx="210" cy="60" rx="60" ry="50" className="text-green-500" stroke="currentColor" fill="none" />
        <rect x="145" y="30" width="30" height="20" rx="4" className="text-[var(--color-ink-muted-48)]" stroke="currentColor" fill="none" />
        <text x="160" y="44" textAnchor="middle" fontSize="9" fill="currentColor" stroke="none" className="text-[var(--color-ink-muted-48)]">?</text>
        <text x="110" y="20" textAnchor="middle" fontSize="9" fill="currentColor" stroke="none" className="text-blue-500">Kucing</text>
        <text x="210" y="20" textAnchor="middle" fontSize="9" fill="currentColor" stroke="none" className="text-green-500">Anjing</text>
        <text x="160" y="110" textAnchor="middle" fontSize="9" fill="currentColor" stroke="none" className="text-red-500">Keduanya mamalia, tapi ...</text>
      </svg>
    ),
  },
  {
    name: "Ad Hominem",
    alias: "Serangan Pribadi",
    description:
      "Menyerang karakter, latar belakang, atau atribut pribadi lawan debat alih-alih membantah argumennya. Ini adalah kesalahan karena validitas argumen tidak tergantung pada siapa yang mengatakannya.",
    example:
      "A: 'Menurut penelitian, vaksin aman dan efektif.' B: 'Kamu bukan dokter, jadi pendapatmu tidak valid.' — Alih-alih membantah data penelitian, B menyerang kredensial A secara tidak relevan.",
    category: "Relevansi",
    Diagram: () => (
      <svg viewBox="0 0 320 120" className="w-full max-w-sm" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="80" cy="50" r="20" className="text-[var(--color-ink)]" stroke="currentColor" fill="none" />
        <rect x="20" y="70" width="120" height="8" rx="4" className="text-[var(--color-ink)]" stroke="currentColor" fill="none" />
        <rect x="40" y="78" width="80" height="8" rx="4" className="text-[var(--color-ink)]" stroke="currentColor" fill="none" />
        <circle cx="240" cy="50" r="20" className="text-[var(--color-primary)]" stroke="currentColor" fill="none" />
        <rect x="220" y="70" width="40" height="8" rx="4" className="text-[var(--color-primary)]" stroke="currentColor" fill="none" />
        <rect x="225" y="78" width="30" height="8" rx="4" className="text-[var(--color-primary)]" stroke="currentColor" fill="none" />
        <path d="M105 45 Q140 20 220 45" stroke="currentColor" strokeDasharray="4 3" className="text-red-500" />
        <text x="160" y="22" textAnchor="middle" fontSize="9" fill="currentColor" stroke="none" className="text-red-500">Serangan pribadi</text>
        <text x="80" y="105" textAnchor="middle" fontSize="9" fill="currentColor" stroke="none" className="text-[var(--color-ink)]">Argumenmu ...</text>
        <text x="240" y="105" textAnchor="middle" fontSize="9" fill="currentColor" stroke="none" className="text-[var(--color-primary)]">Kamu bodoh!</text>
      </svg>
    ),
  },
  {
    name: "Straw Man",
    alias: "Orang-orangan Sawah",
    description:
      "Memutarbalikkan argumen lawan menjadi versi yang lebih lemah, ekstrem, atau mudah diserang, lalu menyerang versi yang sudah dilemahkan itu seolah itu argumen asli lawan. Sangat umum dalam debat politik.",
    example:
      "A: 'Menurut saya, jam kerja fleksibel bisa meningkatkan produktivitas.' B: 'Jadi kamu mau semua orang bekerja 24 jam tanpa aturan? Gila!' — B sengaja mendistorsi posisi A menjadi ekstrem agar mudah diserang.",
    category: "Relevansi",
    Diagram: () => (
      <svg viewBox="0 0 320 120" className="w-full max-w-sm" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="80" cy="50" r="18" className="text-[var(--color-primary)]" stroke="currentColor" fill="none" />
        <rect x="20" y="68" width="120" height="8" rx="4" className="text-[var(--color-primary)]" stroke="currentColor" fill="none" />
        <circle cx="230" cy="45" r="18" className="text-[var(--color-ink)]" stroke="currentColor" fill="none" />
        <rect x="150" y="63" width="160" height="8" rx="4" className="text-[var(--color-ink)]" stroke="currentColor" fill="none" />
        <rect x="170" y="71" width="120" height="8" rx="4" className="text-[var(--color-ink)]" stroke="currentColor" fill="none" />
        <line x1="150" y1="28" x2="230" y2="28" stroke="currentColor" strokeDasharray="4 3" className="text-red-500" />
        <polygon points="230,25 220,31 240,31" className="text-red-500" fill="currentColor" stroke="none" />
        <text x="160" y="20" textAnchor="middle" fontSize="9" fill="currentColor" stroke="none" className="text-red-500">Distorsi</text>
        <text x="80" y="95" textAnchor="middle" fontSize="8" fill="currentColor" stroke="none" className="text-[var(--color-primary)]">Argumen asli</text>
        <text x="230" y="95" textAnchor="middle" fontSize="8" fill="currentColor" stroke="none" className="text-[var(--color-ink)]">Versi lemah</text>
      </svg>
    ),
  },
  {
    name: "Appeal to Authority",
    alias: "Argumentum ad Verecundiam",
    description:
      "Mengklaim suatu pernyataan benar hanya karena seorang ahli atau otoritas mengatakannya — tanpa bukti lain. Ini sesat jika otoritas tersebut tidak kompeten di bidang yang dimaksud, atau jika ada bukti yang bertentangan.",
    example:
      "Selebritas A mempromosikan produk kecantikan dengan klaim 'Dokter di Hollywood merekomendasikan ini' tanpa bukti klinis. Atau: 'Guru fisika bilang zodiak memengaruhi kepribadian, jadi itu benar' — padahal fisika bukan astrologi.",
    category: "Relevansi",
    Diagram: () => (
      <svg viewBox="0 0 320 120" className="w-full max-w-sm" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="80" cy="45" r="20" className="text-[var(--color-ink)]" stroke="currentColor" fill="none" />
        <rect x="60" y="65" width="40" height="10" rx="5" className="text-[var(--color-primary)]" stroke="currentColor" fill="none" />
        <rect x="65" y="75" width="30" height="10" rx="5" className="text-[var(--color-primary)]" stroke="currentColor" fill="none" />
        <text x="80" y="49" textAnchor="middle" fontSize="10" fill="currentColor" stroke="none" className="text-[var(--color-ink)]">A</text>
        <path d="M120 45 Q180 20 230 45" stroke="currentColor" />
        <polygon points="230,45 218,38 218,52" fill="currentColor" stroke="none" />
        <text x="175" y="15" textAnchor="middle" fontSize="9" fill="currentColor" stroke="none" className="text-[var(--color-ink-muted-48)]">&ldquo;Ini benar!&rdquo;</text>
        <circle cx="260" cy="45" r="18" className="text-[var(--color-ink-muted-48)]" stroke="currentColor" fill="none" />
        <rect x="245" y="63" width="30" height="8" rx="4" className="text-[var(--color-ink-muted-48)]" stroke="currentColor" fill="none" />
        <text x="260" y="49" textAnchor="middle" fontSize="10" fill="currentColor" stroke="none" className="text-[var(--color-ink-muted-48)]">?</text>
        <text x="80" y="105" textAnchor="middle" fontSize="8" fill="currentColor" stroke="none" className="text-[var(--color-ink)]">Otoritas</text>
        <text x="260" y="105" textAnchor="middle" fontSize="8" fill="currentColor" stroke="none" className="text-[var(--color-ink-muted-48)]">Tanpa bukti</text>
      </svg>
    ),
  },
  {
    name: "Appeal to Emotion",
    alias: "Argumentum ad Misericordiam",
    description:
      "Memanipulasi perasaan (kasihan, takut, cinta, marah) untuk memenangkan argumen, bukan menggunakan bukti logis. Emosi memang kuat, tapi tidak menggantikan fakta dan nalar dalam pengambilan keputusan rasional.",
    example:
      "Seorang pengacara berkata kepada juri: 'Klien saya adalah seorang nenek berusia 80 tahun yang buta dan hidup sebatang kara. Apakah kalian tega memenjarakannya?' — Alih-alih membuktikan kliennya tidak bersalah, ia memanfaatkan rasa kasihan.",
    category: "Relevansi",
    Diagram: () => (
      <svg viewBox="0 0 320 120" className="w-full max-w-sm" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M160 40 C160 20, 130 15, 120 30 C110 15, 80 20, 80 40 C80 60, 120 75, 160 85 C200 75, 240 60, 240 40 C240 20, 210 15, 200 30 C190 15, 160 20, 160 40Z" className="text-red-400" stroke="currentColor" fill="none" />
        <text x="160" y="55" textAnchor="middle" fontSize="20" fill="currentColor" stroke="none" className="text-red-400">&hearts;</text>
        <text x="160" y="110" textAnchor="middle" fontSize="9" fill="currentColor" stroke="none" className="text-[var(--color-ink-muted-48)]">Emosi &ne; Bukti</text>
      </svg>
    ),
  },
  {
    name: "Appeal to Force",
    alias: "Argumentum ad Baculum",
    description:
      "Menggunakan ancaman, intimidasi, atau konsekuensi negatif untuk memaksa seseorang menerima suatu kesimpulan. Argumen menang bukan karena benar, tapi karena lawan takut menolak.",
    example:
      "'Kamu harus setuju dengan proposal ini, atau kamu akan dipecat.' — Ancaman pemecatan tidak membuat proposal itu secara logis lebih benar. Ini adalah pemaksaan kehendak, bukan argumen rasional.",
    category: "Relevansi",
    Diagram: () => (
      <svg viewBox="0 0 320 120" className="w-full max-w-sm" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="80" cy="50" r="18" className="text-[var(--color-ink)]" stroke="currentColor" fill="none" />
        <rect x="20" y="68" width="120" height="8" rx="4" className="text-[var(--color-ink)]" stroke="currentColor" fill="none" />
        <rect x="30" y="76" width="100" height="8" rx="4" className="text-[var(--color-ink)]" stroke="currentColor" fill="none" />
        <circle cx="250" cy="50" r="18" className="text-red-500" stroke="currentColor" fill="none" />
        <rect x="235" y="68" width="30" height="8" rx="4" className="text-red-500" stroke="currentColor" fill="none" />
        <line x1="148" y1="35" x2="232" y2="35" stroke="currentColor" strokeDasharray="4 3" />
        <line x1="220" y1="15" x2="250" y2="35" stroke="currentColor" strokeWidth="2.5" />
        <text x="160" y="105" textAnchor="middle" fontSize="9" fill="currentColor" stroke="none" className="text-red-500">Ancaman &rarr; Bukan bukti</text>
      </svg>
    ),
  },
  {
    name: "Red Herring",
    alias: "Ikan Haring Merah",
    description:
      "Memperkenalkan topik yang tidak relevan ke dalam diskusi untuk mengalihkan perhatian dari isu utama. Tujuannya mengubah arah argumen agar lawan lupa pada pokok pembicaraan awal.",
    example:
      "A: 'Perusahaan ini mencemari sungai.' B: 'Tapi lihat berapa banyak lapangan kerja yang kami ciptakan!' — B sengaja mengalihkan topik dari pencemaran ke lapangan kerja, yang tidak menjawab tuduhan awal.",
    category: "Relevansi",
    Diagram: () => (
      <svg viewBox="0 0 320 120" className="w-full max-w-sm" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="40" y1="75" x2="280" y2="75" stroke="currentColor" />
        <circle cx="65" cy="50" r="18" className="text-[var(--color-primary)]" stroke="currentColor" fill="none" />
        <text x="65" y="54" textAnchor="middle" fontSize="10" fill="currentColor" stroke="none" className="text-[var(--color-primary)]">A</text>
        <circle cx="220" cy="50" r="18" className="text-red-500" stroke="currentColor" fill="none" />
        <text x="220" y="54" textAnchor="middle" fontSize="10" fill="currentColor" stroke="none" className="text-red-500">&larr;</text>
        <line x1="80" y1="42" x2="140" y2="20" stroke="currentColor" strokeDasharray="4 3" />
        <line x1="180" y1="42" x2="140" y2="20" stroke="currentColor" />
        <polygon points="140,17 132,25 148,25" fill="currentColor" stroke="none" />
        <text x="140" y="12" textAnchor="middle" fontSize="8" fill="currentColor" stroke="none" className="text-[var(--color-ink-muted-48)]">Pengalihan</text>
        <text x="65" y="95" textAnchor="middle" fontSize="8" fill="currentColor" stroke="none" className="text-[var(--color-primary)]">Isu utama</text>
        <text x="220" y="95" textAnchor="middle" fontSize="8" fill="currentColor" stroke="none" className="text-red-500">Topik lain</text>
      </svg>
    ),
  },
  {
    name: "Tu Quoque",
    alias: "Kamu Juga",
    description:
      "Membantah kritik dengan menuduh balik bahwa lawan juga melakukan hal yang sama. 'Kamu juga' bukanlah sanggahan logis — dua kesalahan tidak menghasilkan kebenaran. Kesalahan seseorang tidak membenarkan kesalahan orang lain.",
    example:
      "A: 'Kamu merokok, padahal tahu itu berbahaya.' B: 'Lha kamu juga dulu merokok, kok!' — B gagal membahas bahaya merokok dan malah menyerang balik secara personal.",
    category: "Relevansi",
    Diagram: () => (
      <svg viewBox="0 0 320 120" className="w-full max-w-sm" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="80" cy="45" r="18" className="text-[var(--color-primary)]" stroke="currentColor" fill="none" />
        <circle cx="240" cy="45" r="18" className="text-green-500" stroke="currentColor" fill="none" />
        <rect x="20" y="63" width="120" height="8" rx="4" className="text-[var(--color-primary)]" stroke="currentColor" fill="none" />
        <rect x="195" y="63" width="90" height="8" rx="4" className="text-green-500" stroke="currentColor" fill="none" />
        <text x="80" y="49" textAnchor="middle" fontSize="10" fill="currentColor" stroke="none" className="text-[var(--color-primary)]">A</text>
        <text x="240" y="49" textAnchor="middle" fontSize="10" fill="currentColor" stroke="none" className="text-green-500">B</text>
        <path d="M98 45 Q160 10 222 45" stroke="currentColor" strokeDasharray="4 3" />
        <text x="160" y="10" textAnchor="middle" fontSize="8" fill="currentColor" stroke="none" className="text-[var(--color-ink-muted-48)]">Kamu juga!</text>
        <text x="80" y="95" textAnchor="middle" fontSize="8" fill="currentColor" stroke="none" className="text-[var(--color-primary)]">Kritik</text>
        <text x="240" y="95" textAnchor="middle" fontSize="8" fill="currentColor" stroke="none" className="text-green-500">Balik menuduh</text>
      </svg>
    ),
  },
  {
    name: "Bandwagon",
    alias: "Argumentum ad Populum",
    description:
      "Mengklaim sesuatu benar atau baik hanya karena banyak orang percaya atau melakukannya. Popularitas tidak menjamin kebenaran — sejarah penuh dengan keyakinan mayoritas yang ternyata salah.",
    example:
      "'Semua orang pakai aplikasi ini, pasti bagus!' — Padahal popularitas tidak selalu berkorelasi dengan kualitas. Banyak orang bisa saja salah, seperti keyakinan bahwa bumi datar yang diyakini mayoritas di masa lalu.",
    category: "Relevansi",
    Diagram: () => (
      <svg viewBox="0 0 320 120" className="w-full max-w-sm" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="100" cy="50" r="12" className="text-[var(--color-ink-muted-48)]" stroke="currentColor" fill="none" />
        <circle cx="130" cy="40" r="12" className="text-[var(--color-ink-muted-48)]" stroke="currentColor" fill="none" />
        <circle cx="160" cy="35" r="12" className="text-[var(--color-ink-muted-48)]" stroke="currentColor" fill="none" />
        <circle cx="190" cy="40" r="12" className="text-[var(--color-ink-muted-48)]" stroke="currentColor" fill="none" />
        <circle cx="220" cy="50" r="12" className="text-[var(--color-primary)]" stroke="currentColor" fill="none" />
        <text x="160" y="39" textAnchor="middle" fontSize="8" fill="currentColor" stroke="none" className="text-[var(--color-ink-muted-48)]">...</text>
        <text x="220" y="54" textAnchor="middle" fontSize="9" fill="currentColor" stroke="none" className="text-[var(--color-primary)]">?</text>
        <text x="160" y="80" textAnchor="middle" fontSize="9" fill="currentColor" stroke="none" className="text-[var(--color-ink-muted-48)]">Semua orang lakukan ...</text>
        <text x="160" y="100" textAnchor="middle" fontSize="9" fill="currentColor" stroke="none" className="text-red-500">&rarr; Belum tentu benar</text>
      </svg>
    ),
  },
  {
    name: "Equivocation",
    alias: "Ekuivokasi",
    description:
      "Menggunakan kata atau frasa yang sama dengan dua makna berbeda dalam satu argumen, sehingga kesimpulan yang tampak logis sebenarnya menyesatkan. Kata-kata seperti 'bebas', 'cinta', atau 'alam' sering disalahgunakan.",
    example:
      "Hukum adalah peraturan. Hukum alam adalah gravitasi. Maka gravitasi adalah peraturan. — Kata 'hukum' digunakan dengan dua arti berbeda: aturan buatan manusia vs fenomena ilmiah. Argumennya tampak masuk akal tapi keliru.",
    category: "Ambiguitas",
    Diagram: () => (
      <svg viewBox="0 0 320 120" className="w-full max-w-sm" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="120" y="10" width="80" height="36" rx="8" className="text-[var(--color-primary)]" stroke="currentColor" fill="none" />
        <text x="160" y="33" textAnchor="middle" fontSize="12" fill="currentColor" stroke="none" className="text-[var(--color-primary)]">Kata</text>
        <line x1="140" y1="46" x2="80" y2="75" stroke="currentColor" />
        <line x1="180" y1="46" x2="240" y2="75" stroke="currentColor" />
        <rect x="20" y="75" width="120" height="36" rx="8" className="text-blue-500" stroke="currentColor" fill="none" />
        <text x="80" y="98" textAnchor="middle" fontSize="10" fill="currentColor" stroke="none" className="text-blue-500">Makna 1</text>
        <rect x="180" y="75" width="120" height="36" rx="8" className="text-green-500" stroke="currentColor" fill="none" />
        <text x="240" y="98" textAnchor="middle" fontSize="10" fill="currentColor" stroke="none" className="text-green-500">Makna 2</text>
      </svg>
    ),
  },
  {
    name: "Amphiboly",
    alias: "Amfiboli",
    description:
      "Kesesatan akibat struktur kalimat yang ambigu sehingga bisa ditafsirkan dengan lebih dari satu cara. Bedanya dengan ekuivokasi: di sini ambiguitas berasal dari tata bahasa, bukan dari kata individual.",
    example:
      "'Kucing mengejar tikus itu sampai mati.' — Siapa yang mati? Kucing atau tikus? Kalimat ini ambigu secara struktural. Atau: 'Polisi menangkap pencuri dengan senjata' — siapa yang bersenjata, polisi atau pencuri?",
    category: "Ambiguitas",
    Diagram: () => (
      <svg viewBox="0 0 320 120" className="w-full max-w-sm" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <text x="160" y="25" textAnchor="middle" fontSize="10" fill="currentColor" stroke="none" className="text-[var(--color-primary)]">Kalimat ambigu</text>
        <line x1="160" y1="30" x2="160" y2="45" stroke="currentColor" />
        <line x1="80" y1="50" x2="160" y2="45" stroke="currentColor" />
        <line x1="240" y1="50" x2="160" y2="45" stroke="currentColor" />
        <rect x="20" y="50" width="120" height="36" rx="8" className="text-blue-500" stroke="currentColor" fill="none" />
        <text x="80" y="73" textAnchor="middle" fontSize="9" fill="currentColor" stroke="none" className="text-blue-500">Tafsiran 1</text>
        <rect x="180" y="50" width="120" height="36" rx="8" className="text-green-500" stroke="currentColor" fill="none" />
        <text x="240" y="73" textAnchor="middle" fontSize="9" fill="currentColor" stroke="none" className="text-green-500">Tafsiran 2</text>
        <text x="160" y="110" textAnchor="middle" fontSize="9" fill="currentColor" stroke="none" className="text-[var(--color-ink-muted-48)]">Struktur kalimat &rarr; dua arti</text>
      </svg>
    ),
  },
  {
    name: "Composition",
    alias: "Komposisi",
    description:
      "Menyimpulkan bahwa suatu sifat yang dimiliki oleh setiap anggota secara individual pasti juga dimiliki oleh keseluruhan kelompok. Apa yang benar untuk bagian belum tentu benar untuk keseluruhan.",
    example:
      "Setiap pemain di tim ini adalah pemain hebat. Maka tim ini adalah tim yang hebat. — Belum tentu: pemain hebat belum tentu bisa bekerja sama sebagai tim. Tim yang hebat membutuhkan sinergi, bukan hanya individu-individu hebat.",
    category: "Ambiguitas",
    Diagram: () => (
      <svg viewBox="0 0 320 120" className="w-full max-w-sm" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="10" y="15" width="40" height="30" rx="4" className="text-blue-400" stroke="currentColor" fill="none" />
        <rect x="55" y="15" width="40" height="30" rx="4" className="text-green-400" stroke="currentColor" fill="none" />
        <rect x="100" y="15" width="40" height="30" rx="4" className="text-yellow-400" stroke="currentColor" fill="none" />
        <rect x="145" y="15" width="40" height="30" rx="4" className="text-purple-400" stroke="currentColor" fill="none" />
        <text x="30" y="34" textAnchor="middle" fontSize="8" fill="currentColor" stroke="none" className="text-blue-400">A</text>
        <text x="75" y="34" textAnchor="middle" fontSize="8" fill="currentColor" stroke="none" className="text-green-400">B</text>
        <text x="120" y="34" textAnchor="middle" fontSize="8" fill="currentColor" stroke="none" className="text-yellow-400">C</text>
        <text x="165" y="34" textAnchor="middle" fontSize="8" fill="currentColor" stroke="none" className="text-purple-400">D</text>
        <text x="95" y="62" textAnchor="middle" fontSize="9" fill="currentColor" stroke="none" className="text-[var(--color-ink-muted-48)]">Masing-masing hebat</text>
        <line x1="95" y1="67" x2="95" y2="78" stroke="currentColor" />
        <rect x="40" y="78" width="110" height="34" rx="6" className="text-red-400" stroke="currentColor" fill="none" />
        <text x="95" y="100" textAnchor="middle" fontSize="9" fill="currentColor" stroke="none" className="text-red-400">Tim hebat? Belum tentu</text>
        <circle cx="220" cy="95" r="16" className="text-[var(--color-ink-muted-48)]" stroke="currentColor" fill="none" />
        <text x="220" y="99" textAnchor="middle" fontSize="12" fill="currentColor" stroke="none" className="text-[var(--color-ink-muted-48)]">?</text>
      </svg>
    ),
  },
  {
    name: "Division",
    alias: "Divisi",
    description:
      "Kebalikan dari komposisi: menyimpulkan bahwa suatu sifat yang dimiliki oleh keseluruhan juga pasti dimiliki oleh setiap bagiannya. Sebuah tim bisa punya sifat yang tidak dimiliki oleh anggotanya secara individu.",
    example:
      "Indonesia adalah negara demokrasi. Maka setiap orang Indonesia adalah demokrat. — Padahal tidak semua warga negara Indonesia menganut prinsip demokrasi. Sifat negara tidak otomatis melekat pada setiap individunya.",
    category: "Ambiguitas",
    Diagram: () => (
      <svg viewBox="0 0 320 120" className="w-full max-w-sm" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="95" y="10" width="130" height="36" rx="8" className="text-[var(--color-primary)]" stroke="currentColor" fill="none" />
        <text x="160" y="33" textAnchor="middle" fontSize="11" fill="currentColor" stroke="none" className="text-[var(--color-primary)]">Keseluruhan: Hebat</text>
        <line x1="130" y1="46" x2="60" y2="78" stroke="currentColor" />
        <line x1="160" y1="46" x2="160" y2="78" stroke="currentColor" />
        <line x1="190" y1="46" x2="260" y2="78" stroke="currentColor" />
        <rect x="10" y="78" width="100" height="34" rx="6" className="text-blue-400" stroke="currentColor" fill="none" />
        <text x="60" y="100" textAnchor="middle" fontSize="8" fill="currentColor" stroke="none" className="text-blue-400">Bagian A: ...?</text>
        <rect x="120" y="78" width="80" height="34" rx="6" className="text-green-400" stroke="currentColor" fill="none" />
        <text x="160" y="100" textAnchor="middle" fontSize="8" fill="currentColor" stroke="none" className="text-green-400">Bagian B: ...?</text>
        <rect x="210" y="78" width="100" height="34" rx="6" className="text-yellow-400" stroke="currentColor" fill="none" />
        <text x="260" y="100" textAnchor="middle" fontSize="8" fill="currentColor" stroke="none" className="text-yellow-400">Bagian C: ...?</text>
      </svg>
    ),
  },
  {
    name: "Begging the Question",
    alias: "Pertanyaan Melingkar / Circulus in Probando",
    description:
      "Kesesatan di mana kesimpulan sudah terkandung dalam premis (argumen berputar-putar). Argumen tidak memberikan bukti baru — hanya mengulang klaim yang sama dengan kata-kata berbeda, sehingga tidak ada kemajuan logis.",
    example:
      "Al-Qur'an adalah firman Allah karena Al-Qur'an sendiri mengatakan bahwa ia firman Allah. Dan karena ia firman Allah, maka apa yang dikatakannya pasti benar. — Argumen ini berputar tanpa bukti eksternal.",
    category: "Presumsi",
    Diagram: () => (
      <svg viewBox="0 0 320 120" className="w-full max-w-sm" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="160" cy="60" r="45" className="text-red-400" stroke="currentColor" fill="none" strokeDasharray="4 3" />
        <circle cx="160" cy="60" r="30" className="text-[var(--color-primary)]" stroke="currentColor" fill="none" />
        <circle cx="160" cy="60" r="15" className="text-[var(--color-ink-muted-48)]" stroke="currentColor" fill="none" />
        <text x="160" y="120" textAnchor="middle" fontSize="9" fill="currentColor" stroke="none" className="text-[var(--color-ink-muted-48)]">Argumen berputar tanpa bukti baru</text>
      </svg>
    ),
  },
  {
    name: "False Dilemma",
    alias: "Dilema Palsu / Hitam-Putih",
    description:
      "Menyajikan hanya dua pilihan padahal sebenarnya ada lebih banyak opsi. Memaksa pendengar memilih antara dua ekstrem, biasanya satu jelas buruk dan satu lagi tampak lebih baik, untuk memenangkan argumen.",
    example:
      "'Kamu bersama kami atau melawan kami.' — Padahal ada banyak posisi di antaranya: netral, setuju sebagian, atau punya pendapat alternatif. Dunia jarang hitam-putih; abu-abu dan spektrum penuh selalu ada.",
    category: "Presumsi",
    Diagram: () => (
      <svg viewBox="0 0 320 120" className="w-full max-w-sm" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="20" y="30" width="120" height="55" rx="8" className="text-blue-500" stroke="currentColor" fill="none" />
        <text x="80" y="65" textAnchor="middle" fontSize="11" fill="currentColor" stroke="none" className="text-blue-500">Pilihan A</text>
        <rect x="180" y="30" width="120" height="55" rx="8" className="text-red-500" stroke="currentColor" fill="none" />
        <text x="240" y="65" textAnchor="middle" fontSize="11" fill="currentColor" stroke="none" className="text-red-500">Pilihan B</text>
        <text x="160" y="25" textAnchor="middle" fontSize="9" fill="currentColor" stroke="none" className="text-[var(--color-ink-muted-48)]">Hanya dua?</text>
        <line x1="160" y1="105" x2="240" y2="105" stroke="currentColor" strokeDasharray="4 3" />
        <text x="160" y="115" textAnchor="middle" fontSize="9" fill="currentColor" stroke="none" className="text-green-500">Padahal masih banyak opsi lain</text>
      </svg>
    ),
  },
  {
    name: "Slippery Slope",
    alias: "Lereng Licin",
    description:
      "Berargumen bahwa suatu langkah kecil pasti akan menyebabkan rangkaian peristiwa yang mengarah pada konsekuensi besar yang buruk, tanpa bukti bahwa rantai kausal tersebut benar-benar akan terjadi. 'Efek domino' yang belum terbukti.",
    example:
      "Jika kita izinkan siswa membawa ponsel, besok mereka akan main game terus, lalu bolos, lalu narkoba, lalu jadi kriminal. — Setiap langkah dalam rantai ini adalah lompatan logis tanpa bukti bahwa satu hal akan menyebabkan hal berikutnya.",
    category: "Presumsi",
    Diagram: () => (
      <svg viewBox="0 0 320 120" className="w-full max-w-sm" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="10" y="55" width="30" height="55" rx="3" className="text-blue-500" stroke="currentColor" fill="none" />
        <rect x="55" y="55" width="30" height="55" rx="3" className="text-blue-400" stroke="currentColor" fill="none" />
        <rect x="100" y="55" width="30" height="55" rx="3" className="text-blue-300" stroke="currentColor" fill="none" />
        <rect x="145" y="55" width="30" height="55" rx="3" className="text-yellow-400" stroke="currentColor" fill="none" />
        <rect x="190" y="55" width="30" height="55" rx="3" className="text-orange-400" stroke="currentColor" fill="none" />
        <rect x="235" y="55" width="30" height="55" rx="3" className="text-red-500" stroke="currentColor" fill="none" />
        <text x="25" y="40" textAnchor="middle" fontSize="8" fill="currentColor" stroke="none" className="text-blue-500">A</text>
        <text x="70" y="40" textAnchor="middle" fontSize="8" fill="currentColor" stroke="none" className="text-blue-400">B</text>
        <text x="115" y="40" textAnchor="middle" fontSize="8" fill="currentColor" stroke="none" className="text-blue-300">C</text>
        <text x="250" y="40" textAnchor="middle" fontSize="8" fill="currentColor" stroke="none" className="text-red-500">Z</text>
        <line x1="40" y1="83" x2="55" y2="83" stroke="currentColor" />
        <line x1="85" y1="83" x2="100" y2="83" stroke="currentColor" />
        <line x1="130" y1="83" x2="145" y2="83" stroke="currentColor" />
        <line x1="175" y1="83" x2="190" y2="83" stroke="currentColor" />
        <line x1="220" y1="83" x2="235" y2="83" stroke="currentColor" />
        <text x="250" y="120" textAnchor="middle" fontSize="9" fill="currentColor" stroke="none" className="text-red-500">Tiap langkah belum terbukti</text>
      </svg>
    ),
  },
  {
    name: "Hasty Generalization",
    alias: "Generalisasi Terburu-buru",
    description:
      "Menarik kesimpulan umum berdasarkan sampel yang terlalu kecil atau tidak representatif. Satu atau dua contoh tidak cukup untuk membuat aturan universal. Juga dikenal sebagai 'sample bias' atau 'statistik kecil'.",
    example:
      "Saya bertemu dua orang dari kota X, keduanya sombong. Jadi semua orang dari kota X sombong. — Kesimpulan dari sampel dua orang tidak cukup untuk menilai seluruh populasi kota yang mungkin jutaan jiwa.",
    category: "Presumsi",
    Diagram: () => (
      <svg viewBox="0 0 320 120" className="w-full max-w-sm" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="60" cy="45" r="15" className="text-[var(--color-primary)]" stroke="currentColor" fill="none" />
        <circle cx="100" cy="45" r="15" className="text-[var(--color-primary)]" stroke="currentColor" fill="none" />
        <text x="80" y="80" textAnchor="middle" fontSize="8" fill="currentColor" stroke="none" className="text-[var(--color-primary)]">2 contoh</text>
        <line x1="80" y1="85" x2="160" y2="45" stroke="currentColor" strokeDasharray="4 3" />
        <polygon points="160,42 148,50 172,50" fill="currentColor" stroke="none" />
        <circle cx="190" cy="30" r="10" className="text-[var(--color-ink-muted-48)]" stroke="currentColor" fill="none" />
        <circle cx="220" cy="35" r="10" className="text-[var(--color-ink-muted-48)]" stroke="currentColor" fill="none" />
        <circle cx="240" cy="25" r="10" className="text-[var(--color-ink-muted-48)]" stroke="currentColor" fill="none" />
        <circle cx="215" cy="55" r="10" className="text-[var(--color-ink-muted-48)]" stroke="currentColor" fill="none" />
        <circle cx="245" cy="50" r="10" className="text-[var(--color-ink-muted-48)]" stroke="currentColor" fill="none" />
        <text x="220" y="80" textAnchor="middle" fontSize="9" fill="currentColor" stroke="none" className="text-red-500">&rarr; Semua sama? ✗</text>
      </svg>
    ),
  },
  {
    name: "False Cause",
    alias: "Post Hoc Ergo Propter Hoc",
    description:
      "Menyimpulkan bahwa karena peristiwa A terjadi sebelum peristiwa B, maka A pasti menyebabkan B. Korelasi tidak berarti kausalitas. Dua peristiwa bisa terjadi berurutan secara kebetulan, atau dipengaruhi faktor ketiga.",
    example:
      "Saya pakai gelang keberuntungan ini, lalu tim favorit saya menang. Jadi gelang ini membawa keberuntungan. — Urutan waktu tidak membuktikan sebab-akibat. Mungkin saja tim menang karena strategi, bukan karena gelang.",
    category: "Presumsi",
    Diagram: () => (
      <svg viewBox="0 0 320 120" className="w-full max-w-sm" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="20" y="30" width="100" height="40" rx="8" className="text-blue-500" stroke="currentColor" fill="none" />
        <text x="70" y="55" textAnchor="middle" fontSize="10" fill="currentColor" stroke="none" className="text-blue-500">Peristiwa A</text>
        <rect x="200" y="30" width="100" height="40" rx="8" className="text-green-500" stroke="currentColor" fill="none" />
        <text x="250" y="55" textAnchor="middle" fontSize="10" fill="currentColor" stroke="none" className="text-green-500">Peristiwa B</text>
        <line x1="120" y1="50" x2="200" y2="50" stroke="currentColor" />
        <polygon points="200,45 190,55 200,55" fill="currentColor" stroke="none" />
        <text x="160" y="42" textAnchor="middle" fontSize="9" fill="currentColor" stroke="none" className="text-[var(--color-ink-muted-48)]">Setelah</text>
        <text x="160" y="95" textAnchor="middle" fontSize="9" fill="currentColor" stroke="none" className="text-red-500">Korelasi &ne; Kausalitas</text>
        <line x1="250" y1="70" x2="160" y2="95" stroke="currentColor" strokeDasharray="3 3" className="text-[var(--color-ink-muted-48)]" />
        <text x="160" y="115" textAnchor="middle" fontSize="9" fill="currentColor" stroke="none" className="text-[var(--color-ink-muted-48)]">Mungkin ada faktor lain (X)</text>
        <circle cx="290" cy="80" r="8" className="text-[var(--color-ink-muted-48)]" stroke="currentColor" fill="none" />
        <text x="290" y="84" textAnchor="middle" fontSize="8" fill="currentColor" stroke="none" className="text-[var(--color-ink-muted-48)]">?</text>
      </svg>
    ),
  },
];

const CATEGORIES = ["All", "Formal", "Relevansi", "Ambiguitas", "Presumsi"];

const CATEGORY_COLORS: Record<string, string> = {
  Formal: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  Relevansi: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  Ambiguitas: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  Presumsi: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
};



export default function FallaciesPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    let result = FALLACIES;
    if (activeCategory !== "All") {
      result = result.filter((f) => f.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.alias.toLowerCase().includes(q) ||
          f.description.toLowerCase().includes(q) ||
          f.example.toLowerCase().includes(q)
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
      <PageTitle title="Logical Fallacies" />
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <h1 className="cosmic-headline text-[34px] leading-[1.47] tracking-[-0.374px] mb-2">
        Logical Fallacies
      </h1>
      <p className="text-[13px] text-[var(--color-ink-muted-48)] mb-3 text-center max-w-lg">
        Ensiklopedia kesesatan logika — kekeliruan dalam penalaran yang membuat argumen tampak valid
        padahal tidak. Dilengkapi ilustrasi untuk memahami setiap kesalahan berpikir.
      </p>

      <div className="w-full max-w-2xl cosmic-card px-6 py-5 mb-4">
        <div className="flex items-center gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari berdasarkan nama, deskripsi, atau contoh..."
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
            Menampilkan {filtered.length} dari {FALLACIES.length} kesesatan
          </p>
        )}
        {!search && (
          <p className="text-[11px] text-[var(--color-ink-muted-48)] mt-2">
            {FALLACIES.length} kesesatan logika &mdash; klik untuk detail dan ilustrasi
          </p>
        )}
      </div>

      <div className="w-full max-w-2xl flex flex-wrap gap-2 mb-5">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setActiveCategory(cat);
              setExpanded(new Set());
            }}
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
              Tidak ada kesesatan yang cocok dengan &ldquo;{search}&rdquo;.
            </p>
          </div>
        )}
        {filtered.map((fallacy) => {
          const isExpanded = expanded.has(fallacy.name);
          return (
            <div key={fallacy.name} className="cosmic-card px-6 py-4">
              <button
                onClick={() => toggle(fallacy.name)}
                className="w-full text-left flex items-center justify-between gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[17px] font-semibold text-[var(--color-ink)]">
                      {fallacy.name}
                    </span>
                    <span
                      className={`text-[10px] font-medium px-1.5 py-0.5 rounded-[4px] ${CATEGORY_COLORS[fallacy.category]}`}
                    >
                      {fallacy.category}
                    </span>
                  </div>
                  <p className="text-[13px] text-[var(--color-ink-muted-48)] italic">
                    {fallacy.alias}
                  </p>
                </div>
                <span
                  className="text-[var(--color-ink-muted-48)] shrink-0 transition-transform duration-200"
                  style={{
                    transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                >
                  ▼
                </span>
              </button>
              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-[var(--color-divider-soft)]">
                  <div className="flex justify-center mb-4 bg-[var(--color-surface-pearl)] rounded-[11px] p-4 overflow-hidden">
                    <fallacy.Diagram />
                  </div>
                  <p className="text-[13px] leading-[1.7] text-[var(--color-ink)] mb-3">
                    {fallacy.description}
                  </p>
                  <div className="bg-[var(--color-surface-pearl)] rounded-[11px] px-4 py-3">
                    <span className="text-[10px] font-semibold uppercase text-[var(--color-ink-muted-48)] tracking-wider">
                      Contoh:
                    </span>
                    <p className="text-[13px] leading-[1.7] text-[var(--color-ink)] mt-1">
                      {fallacy.example}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="w-full max-w-2xl cosmic-card px-6 py-4 mt-6">
        <p className="text-[11px] leading-[1.6] text-[var(--color-ink-muted-48)] text-center italic">
          Klasifikasi berdasarkan <em>Logical Fallacies</em> (Aristoteles, 384&ndash;322 SM) dan{" "}
          <em>Attacking Faulty Reasoning</em> (T. Edward Damer, 2009)
        </p>
      </div>

      <Disclaimer type="divination" />
    </div>
  );
}
