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
| `/` | `src/app/page.tsx` | **Home** — Landing page with a responsive card grid linking to all 6 tools and a theme toggle. |
| `/word-maker` | `src/app/word-maker/page.tsx` | **Word Maker** — Enter names with per-row position sliders, find patterns via recursive backtracking across name permutations, and export a canvas-based grid visualization as PNG. |
| `/anagram` | `src/app/anagram/page.tsx` | **Anagram Finder** — Debounced dictionary lookup that finds all words formable from a given set of letters, sorted by length. |
| `/acronym` | `src/app/acronym/page.tsx` | **Acronym Builder** — Generate acronyms from phrases using first-letter or custom-position modes. Brute-forces up to 50,000 combinations to find real-word acronyms. |
| `/blender` | `src/app/blender/page.tsx` | **Name Blender** — Blends two names using 7 algorithms (front+back, overlap, interleave, vowel-consonant segement interleave with both orderings). |
| `/cipher` | `src/app/cipher/page.tsx` | **Cipher Tool** — Encode/decode text with 5 ciphers: Caesar, ROT13, Atbash, Vigenere, and Rail Fence. Includes copy-to-clipboard. |
| `/ladder` | `src/app/ladder/page.tsx` | **Word Ladder** — BFS shortest-path search between two words, showing each step with the changed letter highlighted. |

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
