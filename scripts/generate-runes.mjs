import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const RUNES = [
  { name: "fehu", label: "Fehu", letter: "F", unicode: "\u16A0" },
  { name: "uruz", label: "Uruz", letter: "U", unicode: "\u16A2" },
  { name: "thurisaz", label: "Thurisaz", letter: "TH", unicode: "\u16A6" },
  { name: "ansuz", label: "Ansuz", letter: "A", unicode: "\u16A8" },
  { name: "raidho", label: "Raidho", letter: "R", unicode: "\u16B1" },
  { name: "kenaz", label: "Kenaz", letter: "K", unicode: "\u16B2" },
  { name: "gebo", label: "Gebo", letter: "G", unicode: "\u16B7" },
  { name: "wunjo", label: "Wunjo", letter: "W", unicode: "\u16B9" },
  { name: "hagalaz", label: "Hagalaz", letter: "H", unicode: "\u16BA" },
  { name: "nauthiz", label: "Nauthiz", letter: "N", unicode: "\u16BE" },
  { name: "isa", label: "Isa", letter: "I", unicode: "\u16C1" },
  { name: "jera", label: "Jera", letter: "J", unicode: "\u16C3" },
  { name: "eihwaz", label: "Eihwaz", letter: "EI", unicode: "\u16C7" },
  { name: "perth", label: "Perth", letter: "P", unicode: "\u16C8" },
  { name: "algiz", label: "Algiz", letter: "Z", unicode: "\u16C9" },
  { name: "sowulo", label: "Sowulo", letter: "S", unicode: "\u16CA" },
  { name: "teiwaz", label: "Teiwaz", letter: "T", unicode: "\u16CF" },
  { name: "berkana", label: "Berkana", letter: "B", unicode: "\u16D2" },
  { name: "ehwaz", label: "Ehwaz", letter: "E", unicode: "\u16D6" },
  { name: "mannaz", label: "Mannaz", letter: "M", unicode: "\u16D7" },
  { name: "laguz", label: "Laguz", letter: "L", unicode: "\u16DA" },
  { name: "ingwaz", label: "Ingwaz", letter: "NG", unicode: "\u16DC" },
  { name: "dagaz", label: "Dagaz", letter: "D", unicode: "\u16DE" },
  { name: "othala", label: "Othala", letter: "O", unicode: "\u16DF" },
];

const dir = join(import.meta.dirname, "..", "public", "runes");
mkdirSync(dir, { recursive: true });

for (const rune of RUNES) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 280" width="200" height="280">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#f5efe6"/>
      <stop offset="100%" stop-color="#ece3d5"/>
    </linearGradient>
  </defs>
  <rect width="200" height="280" fill="url(#bg)" rx="14"/>
  <rect x="4" y="4" width="192" height="272" fill="none" stroke="#d4c9b5" stroke-width="1" rx="12"/>
  <text x="100" y="205" text-anchor="middle"
    font-family="'Apple Symbols','Segoe UI Symbol','Arial Unicode MS','Noto Sans Symbols',sans-serif"
    font-size="140" fill="#3d3229" font-weight="400">${rune.unicode}</text>
</svg>`;
  writeFileSync(join(dir, `${rune.name}.svg`), svg);
  console.log(`Created ${rune.name}.svg`);
}

console.log(`Done — ${RUNES.length} rune SVGs created in public/runes/`);
