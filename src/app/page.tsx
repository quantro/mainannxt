"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import ThemeToggle from "./theme-toggle";
import { Disclaimer } from "./disclaimer";
import { PageTitle } from "./page-title";
import { fetchStats, recordClick, totalClicks, sortedTools, type ClickCounts } from "@/lib/tracker";

interface Tool {
  slug: string;
  icon: string;
  name: string;
  desc: string;
  category: string;
}

const tools: Tool[] = [
  { slug: "/word-maker", icon: "\u270F\uFE0F", name: "Word Maker", desc: "Create words from letters in names", category: "Words" },
  { slug: "/anagram", icon: "\uD83C\uDFB2", name: "Anagram Finder", desc: "Find real words from a set of letters", category: "Words" },
  { slug: "/acronym", icon: "\uD83C\uDFAF", name: "Acronym Builder", desc: "Generate acronyms from phrases", category: "Words" },
  { slug: "/blender", icon: "\uD83E\uDDEA", name: "Name Blender", desc: "Blend two names together", category: "Words" },
  { slug: "/ladder", icon: "\uD83E\uDE9C", name: "Word Ladder", desc: "Find shortest path between two words", category: "Words" },
  { slug: "/cipher", icon: "\uD83D\uDD11", name: "Cipher Tool", desc: "Encode and decode text with ciphers", category: "Utilities" },
  { slug: "/wheel", icon: "\uD83C\uDFAF", name: "Wheel of Names", desc: "Spin to pick a random winner", category: "Utilities" },
  { slug: "/network", icon: "\uD83C\uDF10", name: "Network Tools", desc: "IP, DNS lookup, and port reference", category: "Utilities" },
  { slug: "/pdf-forge", icon: "\uD83D\uDCC4", name: "PDF Forge", desc: "Compress, merge, split, convert images and text to PDF", category: "Utilities" },
  { slug: "/password-generator", icon: "\uD83D\uDD11", name: "Password Generator", desc: "Generate secure random passwords with strength meter", category: "Utilities" },
  { slug: "/qr-code", icon: "\uD83D\uDCF1", name: "QR Code Generator", desc: "Generate QR codes from text or URLs", category: "Utilities" },
  { slug: "/indonesian-holidays", icon: "\uD83C\uDDEE\uD83C\uDDE9", name: "Indonesian Holidays", desc: "National, Islamic, and cultural holidays for any year", category: "Calendars" },
  { slug: "/weton-calendar", icon: "\uD83D\uDCC6", name: "Weton Calendar", desc: "Month-at-a-glance Javanese weton grid", category: "Calendars" },
  { slug: "/tafsir-mimpi", icon: "\uD83D\uDCAD", name: "Tafsir Mimpi", desc: "Javanese dream meaning dictionary", category: "Divination" },
  { slug: "/zodiac", icon: "\uD83C\uDF1F", name: "Star Sign Reader", desc: "Discover your zodiac sign and traits", category: "Divination" },
  { slug: "/tarot", icon: "\uD83C\uDF84", name: "Tarot Reading", desc: "Full 78-card deck with multiple spreads", category: "Divination" },
  { slug: "/runes", icon: "\uD83E\uDEA8", name: "Rune Divination", desc: "Elder Futhark rune casting and readings", category: "Divination" },
  { slug: "/numerology", icon: "\uD83D\uDD22", name: "Numerology", desc: "Life path and destiny numbers", category: "Divination" },
  { slug: "/chinese-zodiac", icon: "\uD83D\uDC32", name: "Chinese Zodiac", desc: "Find your animal sign and element", category: "Divination" },
  { slug: "/fortune", icon: "\uD83D\uDD2E", name: "Fortune Teller", desc: "Mystical fortune reading and tarot", category: "Divination" },
  { slug: "/primbon", icon: "\uD83C\uDF19", name: "Primbon Jawa", desc: "Javanese weton personality and love match", category: "Divination" },
  { slug: "/pranata-mangsa", icon: "\uD83C\uDF3E", name: "Pranata Mangsa", desc: "Javanese seasonal calendar and wisdom", category: "Calendars" },
  { slug: "/calendar", icon: "\uD83D\uDCC5", name: "World Calendars", desc: "Chinese, Javanese, and Islamic calendars", category: "Calendars" },
  { slug: "/unit-converter", icon: "\uD83D\uDCF0", name: "Unit Converter", desc: "Convert length, weight, temperature, and volume units", category: "Utilities" },
  { slug: "/color-picker", icon: "\uD83C\uDFA8", name: "Color Picker", desc: "Convert between HEX, RGB, and HSL color formats", category: "Utilities" },
  { slug: "/json-formatter", icon: "\uD83D\uDCCB", name: "JSON Formatter", desc: "Format, validate, and minify JSON", category: "Utilities" },
  { slug: "/text-diff", icon: "\uD83D\uDCDD", name: "Text Diff", desc: "Compare two texts and see added/removed lines", category: "Utilities" },
  { slug: "/countdown-timer", icon: "\u23F1\uFE0F", name: "Countdown Timer", desc: "Countdown timer and stopwatch with lap recording", category: "Utilities" },
  { slug: "/random-number", icon: "\uD83D\uDCAF", name: "Random Number", desc: "Generate random numbers with customizable ranges", category: "Utilities" },
  { slug: "/saran", icon: "\uD83D\uDCE3", name: "Kirim Saran", desc: "Sampaikan ide atau masukan untuk alat baru", category: "Utilities" },
];

const CATEGORIES = [
  { key: "Words", icon: "\uD83D\uDCDD", label: "Word Play" },
  { key: "Utilities", icon: "\uD83D\uDEE0\uFE0F", label: "Utilities & Tools" },
  { key: "Divination", icon: "\uD83D\uDD2E", label: "Divination & Astrology" },
  { key: "Calendars", icon: "\uD83D\uDCC5", label: "Calendars & Seasons" },
];

export default function Home() {
  const [showStats, setShowStats] = useState(false);
  const [search, setSearch] = useState("");
  const [counts, setCounts] = useState<ClickCounts>({});

  useEffect(() => {
    fetchStats().then(setCounts);
  }, []);

  async function handleClick(slug: string) {
    const stats = await recordClick(slug);
    setCounts(stats);
  }

  return (
    <div className="flex flex-col items-center min-h-screen px-6 py-24">
      <PageTitle title="Fun Tools" />
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <Link
          href="/saran"
          className="apple-btn-ghost text-[13px] no-underline"
        >
          Saran
        </Link>
        <button
          onClick={() => setShowStats(!showStats)}
          className="apple-btn-ghost text-[13px]"
        >
          {showStats ? "Close" : "Stats"}
        </button>
        <ThemeToggle />
      </div>

      {showStats && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm" onClick={() => setShowStats(false)}>
          <div className="apple-card w-full max-w-sm mx-4 p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-[17px] font-semibold mb-4">Click Stats</h2>
            {totalClicks(counts) === 0 ? (
              <p className="text-[13px] text-[var(--color-ink-muted-48)]">No clicks yet.</p>
            ) : (
              <div className="space-y-2">
                {sortedTools(counts).map(([slug, n]) => {
                  const tool = tools.find(t => t.slug === slug);
                  return (
                    <div key={slug} className="flex items-center justify-between text-[13px]">
                      <span>{tool?.icon} {tool?.name || slug}</span>
                      <span className="font-semibold tabular-nums">{n} click{n === 1 ? "" : "s"}</span>
                    </div>
                  );
                })}
                <div className="border-t border-[var(--color-border-subtle)] pt-2 mt-2 flex justify-between text-[13px] font-semibold">
                  <span>Total</span>
                  <span className="tabular-nums">{totalClicks(counts)} clicks</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <h1 className="apple-headline text-[40px] leading-[1.1] text-center mb-1">
        Fun Tools
      </h1>
      <p className="text-[17px] leading-[1.47] tracking-[-0.374px] text-[var(--color-ink-muted-48)] mb-6">
        Select a tool to use
      </p>

      <div className="w-full max-w-xs mb-10">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tools…"
          className="apple-input w-full h-10 text-[14px] text-center"
        />
      </div>

      <div className="w-full max-w-4xl space-y-10">
        {CATEGORIES.map((cat) => {
          const catTools = tools.filter(
            (t) => t.category === cat.key && (!search || t.name.toLowerCase().includes(search.toLowerCase()) || t.desc.toLowerCase().includes(search.toLowerCase()))
          );
          if (catTools.length === 0 && search) return null;
          return (
            <div key={cat.key}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[18px]">{cat.icon}</span>
                <h2 className="text-[14px] font-semibold uppercase tracking-[0.5px] text-[var(--color-ink-muted-48)]">
                  {cat.label}
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {catTools.map((tool) => (
                  <Link
                    key={tool.slug}
                    href={tool.slug}
                    onClick={() => handleClick(tool.slug)}
                    className="apple-card block px-5 py-4 hover:border-[var(--color-primary)] hover:shadow-sm transition-all no-underline"
                  >
                    <div className="text-[22px] mb-2">{tool.icon}</div>
                    <h3 className="text-[15px] font-semibold leading-[1.24] tracking-[-0.374px] text-[var(--color-ink)]">
                      {tool.name}
                    </h3>
                    <p className="text-[13px] leading-[1.43] tracking-[-0.224px] text-[var(--color-ink-muted-48)] mt-0.5">
                      {tool.desc}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
        {search && !tools.some((t) => t.name.toLowerCase().includes(search.toLowerCase()) || t.desc.toLowerCase().includes(search.toLowerCase())) && (
          <p className="text-[14px] text-[var(--color-ink-muted-48)] text-center py-8">No tools found matching "{search}"</p>
        )}
      </div>
      <Disclaimer type="utility" />
    </div>
  );
}
