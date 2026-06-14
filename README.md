# tools

A Next.js 16 project built with React 19, TypeScript, and Tailwind CSS 4.

## Getting Started

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

## Modules

### Shared Library

- **`src/lib/dictionary.ts`** — Exports `WORDS` (~2,000+ 3–5 letter words) and `isWord()` used by Anagram, Acronym, and Ladder tools.

### Routes

| Route | File | Description |
|-------|------|-------------|
| `/` | `src/app/page.tsx` | **Home** — Landing page with category grid linking to all tools and a theme toggle. |
| `/word-maker` | `src/app/word-maker/page.tsx` | **Word Maker** — Enter names with per-row position sliders, find patterns via recursive backtracking across name permutations, and export a canvas-based grid visualization as PNG. |
| `/anagram` | `src/app/anagram/page.tsx` | **Anagram Finder** — Debounced dictionary lookup that finds all words formable from a given set of letters, sorted by length. |
| `/acronym` | `src/app/acronym/page.tsx` | **Acronym Builder** — Generate acronyms from phrases using first-letter or custom-position modes. Brute-forces up to 50,000 combinations to find real-word acronyms. |
| `/blender` | `src/app/blender/page.tsx` | **Name Blender** — Blends two names using 7 algorithms (front+back, overlap, interleave, vowel-consonant segement interleave with both orderings). |
| `/cipher` | `src/app/cipher/page.tsx` | **Cipher Tool** — Encode/decode text with 5 ciphers: Caesar, ROT13, Atbash, Vigenere, and Rail Fence. Includes copy-to-clipboard. |
| `/ladder` | `src/app/ladder/page.tsx` | **Word Ladder** — BFS shortest-path search between two words, showing each step with the changed letter highlighted. |
| `/wheel` | `src/app/wheel/page.tsx` | **Wheel of Names** — Canvas-drawn spinning wheel with colored segments and name management. |
| `/network` | `src/app/network/page.tsx` | **Network Tools** — My IP (ipify + ipapi geolocation), DNS lookup (Google DNS-over-HTTPS), and common ports reference. |
| `/pdf-forge` | `src/app/pdf-forge/page.tsx` | **PDF Forge** — Client-side PDF tools: compress, merge, split, image-to-PDF, and text-to-PDF. Powered by pdf-lib. |
| `/password-generator` | `src/app/password-generator/page.tsx` | **Password Generator** — Secure random passwords with length slider, char type toggles, and strength meter. Uses crypto.getRandomValues. |
| `/qr-code` | `src/app/qr-code/page.tsx` | **QR Code Generator** — Generate QR codes from text or URLs with error correction level and color options. Download as PNG. |
| `/indonesian-holidays` | `src/app/indonesian-holidays/page.tsx` | **Indonesian Holidays** — National, Islamic, Christian, Hindu/Buddhist, and cultural holidays for 2025–2035. Data sourced from api.co.id. |
| `/zodiac` | `src/app/zodiac/page.tsx` | **Star Sign Reader** — Western zodiac sign calculator with personality profiles and compatibility. |
| `/tarot` | `src/app/tarot/page.tsx` | **Tarot Reading** — Full 78-card Rider-Waite-Smith deck with single, three-card, and Celtic Cross spreads. Includes card images, multi-paragraph readings, and conclusion synthesis. |
| `/runes` | `src/app/runes/page.tsx` | **Rune Divination** — 24 Elder Futhark runes organized in three aettir. Single, three-rune, and five-rune spreads with upright/merkstave interpretations, full readings, and keyword tags. |
| `/numerology` | `src/app/numerology/page.tsx` | **Numerology** — Life path, destiny, soul urge, personality numbers with detailed interpretations. |
| `/chinese-zodiac` | `src/app/chinese-zodiac/page.tsx` | **Chinese Zodiac** — Animal sign and element calculator based on birth year. |
| `/fortune` | `src/app/fortune/page.tsx` | **Fortune Teller** — Mystical fortune reading with multiple categories. |
| `/primbon` | `src/app/primbon/page.tsx` | **Primbon Jawa** — Javanese weton calculator with neptu, pangarasan, pancasuda, and love compatibility. |
| `/pranata-mangsa` | `src/app/pranata-mangsa/page.tsx` | **Pranata Mangsa** — Javanese 12-season agricultural calendar with seasonal wisdom and natural signs. |
| `/weton-calendar` | `src/app/weton-calendar/page.tsx` | **Weton Calendar** — Month-at-a-glance grid with weton per day (day + pasaran), 35-combination legend, and cultural context essay. |
| `/tafsir-mimpi` | `src/app/tafsir-mimpi/page.tsx` | **Tafsir Mimpi** — Searchable Javanese dream dictionary with ~780 dream symbols and multi-paragraph interpretations in Indonesian. |
| `/calendar` | `src/app/calendar/page.tsx` | **World Calendars** — 4-tab viewer for Chinese (stem-branch + zodiac), Javanese (Saka + weton), Islamic (Hijri), and Hebrew calendars. |
| `/unit-converter` | `src/app/unit-converter/page.tsx` | **Unit Converter** — Convert length, weight, temperature, and volume units. |
| `/color-picker` | `src/app/color-picker/page.tsx` | **Color Picker** — Convert between HEX, RGB, and HSL color formats with swatch preview. |
| `/json-formatter` | `src/app/json-formatter/page.tsx` | **JSON Formatter** — Format, validate, and minify JSON. |
| `/text-diff` | `src/app/text-diff/page.tsx` | **Text Diff** — Compare two texts with line-by-line diff highlighting. |
| `/countdown-timer` | `src/app/countdown-timer/page.tsx` | **Countdown Timer** — Countdown timer and stopwatch with lap recording. |
| `/random-number` | `src/app/random-number/page.tsx` | **Random Number** — Generate random numbers with customizable ranges. |
| `/personality-test` | `src/app/personality-test/page.tsx` | **Personality Test** — Tes kepribadian Big Five (OCEAN) dalam bahasa Indonesia. |
| `/stress-assessment` | `src/app/stress-assessment/page.tsx` | **Stress Assessment** — Kuesioner stres dan kecemasan berdasarkan GAD-7 & PSS. |
| `/mood-tracker` | `src/app/mood-tracker/page.tsx` | **Mood Tracker** — Lacak suasana hati harian dengan kalender visual. |
| `/habit-tracker` | `src/app/habit-tracker/page.tsx` | **Habit Tracker** — Catat kebiasaan harian dan lihat streak Anda. |
| `/focus-timer` | `src/app/focus-timer/page.tsx` | **Focus Timer** — Teknik Pomodoro dengan timer melingkar dan sesi tracking. |
| `/cognitive-biases` | `src/app/cognitive-biases/page.tsx` | **Cognitive Biases** — Ensiklopedia bias kognitif lengkap dengan contoh. |
| `/emotion-wheel` | `src/app/emotion-wheel/page.tsx` | **Emotion Wheel** — Roda emosi Plutchik interaktif untuk memahami perasaan. |
| `/saran` | `src/app/saran/page.tsx` | **Kirim Saran** — Form untuk mengirim saran atau ide alat baru. Bahasa Indonesia. |
| `/admin` | `src/app/admin/page.tsx` | **Admin Dashboard** — Click summary overview. Auth required. |
| `/admin/clicks` | `src/app/admin/clicks/page.tsx` | **Click Log** — IP-tracked click history, grouped by day with search. Auth required. |
| `/admin/suggestions` | `src/app/admin/suggestions/page.tsx` | **Saran Masukan** — Lihat saran dari pengguna. Auth required. |

### Shared Components

- **`src/app/theme-toggle.tsx`** — Sun/moon toggle button that persists the active theme to `localStorage`. Used by all pages.
- **`src/app/disclaimer.tsx`** — Reusable disclaimer component with two variants (divination/utility). Used by all pages.
- **`src/app/globals.css`** — Design system via CSS custom properties mapped to Tailwind v4 `@theme` tokens (Apple-inspired: SF Pro fonts, pill buttons, parchment backgrounds).
- **`src/app/layout.tsx`** — Root layout with flicker-free theming via inline script and `data-theme` attribute.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
