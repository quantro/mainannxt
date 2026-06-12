export type ClickCounts = Record<string, number>;

export async function fetchStats(): Promise<ClickCounts> {
  try {
    const res = await fetch("/api/stats");
    return await res.json();
  } catch {
    return {};
  }
}

export async function recordClick(slug: string): Promise<ClickCounts> {
  try {
    const res = await fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    });
    const data = await res.json();
    return data.stats ?? {};
  } catch {
    return {};
  }
}

export function totalClicks(counts: ClickCounts): number {
  return Object.values(counts).reduce((a, b) => a + b, 0);
}

export function sortedTools(counts: ClickCounts): [string, number][] {
  return Object.entries(counts).sort((a, b) => b[1] - a[1]);
}
