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
| `/zodiac` | `src/app/zodiac/page.tsx` | **Star Sign Reader** — Western zodiac sign calculator with personality profiles and compatibility. |
| `/tarot` | `src/app/tarot/page.tsx` | **Tarot Reading** — Full 78-card Rider-Waite-Smith deck with single, three-card, and Celtic Cross spreads. Includes card images, multi-paragraph readings, and conclusion synthesis. |
| `/runes` | `src/app/runes/page.tsx` | **Rune Divination** — 24 Elder Futhark runes organized in three aettir. Single, three-rune, and five-rune spreads with upright/merkstave interpretations, full readings, and keyword tags. |
| `/numerology` | `src/app/numerology/page.tsx` | **Numerology** — Life path, destiny, soul urge, personality numbers with detailed interpretations. |
| `/chinese-zodiac` | `src/app/chinese-zodiac/page.tsx` | **Chinese Zodiac** — Animal sign and element calculator based on birth year. |
| `/fortune` | `src/app/fortune/page.tsx` | **Fortune Teller** — Mystical fortune reading with multiple categories. |
| `/primbon` | `src/app/primbon/page.tsx` | **Primbon Jawa** — Javanese weton calculator with neptu, pangarasan, pancasuda, and love compatibility. |
| `/pranata-mangsa` | `src/app/pranata-mangsa/page.tsx` | **Pranata Mangsa** — Javanese 12-season agricultural calendar with seasonal wisdom and natural signs. |
| `/calendar` | `src/app/calendar/page.tsx` | **World Calendars** — Tabbed viewer for Chinese (stem-branch + zodiac), Javanese (Saka + weton), and Islamic (Hijri) calendars. |

### Shared Components

- **`src/app/theme-toggle.tsx`** — Sun/moon toggle button that persists the active theme to `localStorage`. Used by all pages.
- **`src/app/globals.css`** — Design system via CSS custom properties mapped to Tailwind v4 `@theme` tokens (Apple-inspired: SF Pro fonts, pill buttons, parchment backgrounds).
- **`src/app/layout.tsx`** — Root layout with flicker-free theming via inline script and `data-theme` attribute.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
