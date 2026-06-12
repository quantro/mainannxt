const STORAGE_KEY = "tool-click-counts";

export type ClickCounts = Record<string, number>;

export function getClickCounts(): ClickCounts {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

export function recordClick(slug: string): void {
  const counts = getClickCounts();
  counts[slug] = (counts[slug] || 0) + 1;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(counts));
}

export function totalClicks(counts: ClickCounts): number {
  return Object.values(counts).reduce((a, b) => a + b, 0);
}

export function sortedTools(counts: ClickCounts): [string, number][] {
  return Object.entries(counts).sort((a, b) => b[1] - a[1]);
}
