"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import ThemeToggle from "./theme-toggle";
import { getClickCounts, recordClick, totalClicks, sortedTools, type ClickCounts } from "@/lib/tracker";

const tools = [
  { slug: "/word-maker", icon: "\u270F\uFE0F", name: "Word Maker", desc: "Create words from letters in names" },
  { slug: "/anagram", icon: "\uD83C\uDFB2", name: "Anagram Finder", desc: "Find real words from a set of letters" },
  { slug: "/acronym", icon: "\uD83C\uDFAF", name: "Acronym Builder", desc: "Generate acronyms from phrases" },
  { slug: "/blender", icon: "\uD83E\uDDEA", name: "Name Blender", desc: "Blend two names together" },
  { slug: "/cipher", icon: "\uD83D\uDD11", name: "Cipher Tool", desc: "Encode and decode text with ciphers" },
  { slug: "/ladder", icon: "\uD83E\uDE9C", name: "Word Ladder", desc: "Find shortest path between two words" },
];

export default function Home() {
  const [showStats, setShowStats] = useState(false);
  const [counts, setCounts] = useState<ClickCounts>({});

  useEffect(() => {
    setCounts(getClickCounts());
  }, []);

  function handleClick(slug: string) {
    recordClick(slug);
    setCounts(getClickCounts());
  }

  return (
    <div className="flex flex-col items-center min-h-screen px-6 py-24">
      <div className="absolute top-4 right-4 flex items-center gap-2">
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
        Tools
      </h1>
      <p className="text-[17px] leading-[1.47] tracking-[-0.374px] text-[var(--color-ink-muted-48)] mb-12">
        Select a tool to use
      </p>

      <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {tools.map(tool => (
          <Link
            key={tool.slug}
            href={tool.slug}
            onClick={() => handleClick(tool.slug)}
            className="apple-card block px-5 py-4 hover:border-[var(--color-primary)] hover:shadow-sm transition-all no-underline"
          >
            <div className="text-[22px] mb-2">{tool.icon}</div>
            <h2 className="text-[15px] font-semibold leading-[1.24] tracking-[-0.374px] text-[var(--color-ink)]">
              {tool.name}
            </h2>
            <p className="text-[13px] leading-[1.43] tracking-[-0.224px] text-[var(--color-ink-muted-48)] mt-0.5">
              {tool.desc}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
