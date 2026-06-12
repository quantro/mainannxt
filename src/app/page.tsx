import Link from "next/link";
import ThemeToggle from "./theme-toggle";

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen px-6 py-24">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <h1 className="apple-headline text-[40px] leading-[1.1] text-center mb-1">
        Tools
      </h1>
      <p className="text-[17px] leading-[1.47] tracking-[-0.374px] text-[var(--color-ink-muted-48)] mb-12">
        Select a tool to use
      </p>

      <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Link
          href="/word-maker"
          className="apple-card block px-5 py-4 hover:border-[var(--color-primary)] hover:shadow-sm transition-all no-underline"
        >
          <div className="text-[22px] mb-2">&#x270F;&#xFE0F;</div>
          <h2 className="text-[15px] font-semibold leading-[1.24] tracking-[-0.374px] text-[var(--color-ink)]">
            Word Maker
          </h2>
          <p className="text-[13px] leading-[1.43] tracking-[-0.224px] text-[var(--color-ink-muted-48)] mt-0.5">
            Create words from letters in names
          </p>
        </Link>
        <Link
          href="/anagram"
          className="apple-card block px-5 py-4 hover:border-[var(--color-primary)] hover:shadow-sm transition-all no-underline"
        >
          <div className="text-[22px] mb-2">&#x1F3B2;</div>
          <h2 className="text-[15px] font-semibold leading-[1.24] tracking-[-0.374px] text-[var(--color-ink)]">
            Anagram Finder
          </h2>
          <p className="text-[13px] leading-[1.43] tracking-[-0.224px] text-[var(--color-ink-muted-48)] mt-0.5">
            Find real words from a set of letters
          </p>
        </Link>
        <Link
          href="/acronym"
          className="apple-card block px-5 py-4 hover:border-[var(--color-primary)] hover:shadow-sm transition-all no-underline"
        >
          <div className="text-[22px] mb-2">&#x1F3AF;</div>
          <h2 className="text-[15px] font-semibold leading-[1.24] tracking-[-0.374px] text-[var(--color-ink)]">
            Acronym Builder
          </h2>
          <p className="text-[13px] leading-[1.43] tracking-[-0.224px] text-[var(--color-ink-muted-48)] mt-0.5">
            Generate acronyms from phrases
          </p>
        </Link>
        <Link
          href="/blender"
          className="apple-card block px-5 py-4 hover:border-[var(--color-primary)] hover:shadow-sm transition-all no-underline"
        >
          <div className="text-[22px] mb-2">&#x1F9EA;</div>
          <h2 className="text-[15px] font-semibold leading-[1.24] tracking-[-0.374px] text-[var(--color-ink)]">
            Name Blender
          </h2>
          <p className="text-[13px] leading-[1.43] tracking-[-0.224px] text-[var(--color-ink-muted-48)] mt-0.5">
            Blend two names together
          </p>
        </Link>
        <Link
          href="/cipher"
          className="apple-card block px-5 py-4 hover:border-[var(--color-primary)] hover:shadow-sm transition-all no-underline"
        >
          <div className="text-[22px] mb-2">&#x1F511;</div>
          <h2 className="text-[15px] font-semibold leading-[1.24] tracking-[-0.374px] text-[var(--color-ink)]">
            Cipher Tool
          </h2>
          <p className="text-[13px] leading-[1.43] tracking-[-0.224px] text-[var(--color-ink-muted-48)] mt-0.5">
            Encode and decode text with ciphers
          </p>
        </Link>
        <Link
          href="/ladder"
          className="apple-card block px-5 py-4 hover:border-[var(--color-primary)] hover:shadow-sm transition-all no-underline"
        >
          <div className="text-[22px] mb-2">&#x1FA9C;</div>
          <h2 className="text-[15px] font-semibold leading-[1.24] tracking-[-0.374px] text-[var(--color-ink)]">
            Word Ladder
          </h2>
          <p className="text-[13px] leading-[1.43] tracking-[-0.224px] text-[var(--color-ink-muted-48)] mt-0.5">
            Find shortest path between two words
          </p>
        </Link>
      </div>
    </div>
  );
}
