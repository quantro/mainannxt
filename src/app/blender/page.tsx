"use client";

import { useMemo, useState } from "react";
import ThemeToggle from "../theme-toggle";
import { Disclaimer } from "../disclaimer";
import { PageTitle } from "../page-title";

function capitalize(s: string): string {
  if (!s) return s;
  return s[0].toUpperCase() + s.slice(1).toLowerCase();
}

function frontBack(a: string, b: string): string {
  return a.slice(0, Math.ceil(a.length / 2)) + b.slice(Math.floor(b.length / 2));
}

function backFront(a: string, b: string): string {
  return a.slice(Math.floor(a.length / 2)) + b.slice(0, Math.ceil(b.length / 2));
}

function overlap(a: string, b: string): string {
  const lowerA = a.toLowerCase();
  const lowerB = b.toLowerCase();
  let best = 0;
  for (let i = 1; i <= Math.min(a.length, b.length); i++) {
    if (lowerA.slice(-i) === lowerB.slice(0, i)) {
      best = i;
    }
  }
  return a + b.slice(best);
}

function interleave(a: string, b: string): string {
  let result = "";
  const maxLen = Math.max(a.length, b.length);
  for (let i = 0; i < maxLen; i++) {
    if (i < a.length) result += a[i];
    if (i < b.length) result += b[i];
  }
  return result;
}

function getSegments(s: string): string[] {
  const segments: string[] = [];
  let current = "";
  for (const ch of s) {
    if (!current) {
      current = ch;
    } else {
      const isCurrVowel = /[aeiou]/i.test(current[current.length - 1]);
      const isChVowel = /[aeiou]/i.test(ch);
      if (isCurrVowel === isChVowel) {
        current += ch;
      } else {
        segments.push(current);
        current = ch;
      }
    }
  }
  if (current) segments.push(current);
  return segments;
}

function segmentInterleave(segsA: string[], segsB: string[]): string[] {
  const maxLen = Math.max(segsA.length, segsB.length);
  const r1: string[] = [];
  const r2: string[] = [];
  for (let i = 0; i < maxLen; i++) {
    if (i < segsA.length) r1.push(segsA[i]);
    if (i < segsB.length) r1.push(segsB[i]);
  }
  for (let i = 0; i < maxLen; i++) {
    if (i < segsB.length) r2.push(segsB[i]);
    if (i < segsA.length) r2.push(segsA[i]);
  }
  return [r1.join(""), r2.join("")].filter((s) => s.length > 0);
}

export default function BlenderPage() {
  const [nameA, setNameA] = useState("");
  const [nameB, setNameB] = useState("");

  const blends = useMemo(() => {
    const a = nameA.trim().toLowerCase();
    const b = nameB.trim().toLowerCase();
    if (!a || !b) return [];

    const results: { label: string; name: string }[] = [];

    results.push({ label: "Front + Back", name: capitalize(frontBack(a, b)) });
    results.push({ label: "Back + Front", name: capitalize(backFront(a, b)) });

    results.push({ label: "Overlap", name: capitalize(overlap(a, b)) });

    results.push({ label: "Interleave (A·B)", name: capitalize(interleave(a, b)) });
    results.push({ label: "Interleave (B·A)", name: capitalize(interleave(b, a)) });

    const segsA = getSegments(a);
    const segsB = getSegments(b);
    const [vc1, vc2] = segmentInterleave(segsA, segsB);
    if (vc1) results.push({ label: "Vowel·Consonant (A·B)", name: capitalize(vc1) });
    if (vc2) results.push({ label: "Vowel·Consonant (B·A)", name: capitalize(vc2) });

    return results;
  }, [nameA, nameB]);

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-12">
      <PageTitle title="Name Blender" />
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <h1 className="apple-headline text-[34px] leading-[1.47] tracking-[-0.374px] mb-8">
        Name Blender
      </h1>

      <div className="w-full max-w-2xl apple-card px-6 py-5 mb-5">
        <h2 className="text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-[var(--color-ink-muted-48)] mb-3 uppercase">
          Names
        </h2>
        <div className="space-y-2">
          <input
            value={nameA}
            onChange={(e) => setNameA(e.target.value)}
            placeholder="First name"
            className="apple-input w-full h-10 text-[14px]"
          />
          <input
            value={nameB}
            onChange={(e) => setNameB(e.target.value)}
            placeholder="Second name"
            className="apple-input w-full h-10 text-[14px]"
          />
        </div>
      </div>

      {nameA.trim() && nameB.trim() && (
        <div className="w-full max-w-2xl apple-card px-6 py-5">
          <p className="text-[12px] font-semibold leading-[1.29] tracking-[-0.224px] text-[var(--color-ink-muted-48)] mb-4 uppercase">
            {blends.length} blend{blends.length !== 1 ? "s" : ""}
          </p>
          <div className="flex flex-col gap-2">
            {blends.map((blend) => (
              <div
                key={blend.label}
                className="flex items-center justify-between gap-4 px-4 py-3 rounded-[11px] bg-[var(--color-surface-pearl)]"
              >
                <span className="text-[12px] leading-[1.29] text-[var(--color-ink-muted-48)] shrink-0">
                  {blend.label}
                </span>
                <span className="text-[15px] font-semibold leading-[1.2] text-[var(--color-ink)]">
                  {blend.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {(!nameA.trim() || !nameB.trim()) && (
        <div className="w-full max-w-2xl apple-card px-6 py-5">
          <p className="text-[14px] leading-[1.43] tracking-[-0.224px] text-[var(--color-ink-muted-48)] text-center">
            Enter two names to blend.
          </p>
        </div>
      )}
          <Disclaimer type="utility" />
    </div>
  );
}
