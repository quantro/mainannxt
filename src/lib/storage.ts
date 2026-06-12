import { supabase } from "./supabase";

type ClickCounts = Record<string, number>;

export async function getStats(): Promise<ClickCounts> {
  if (!supabase) return {};
  const { data } = await supabase
    .from("tool_clicks")
    .select("tool_slug, click_count");

  if (!data) return {};
  const counts: ClickCounts = {};
  for (const row of data) {
    counts[row.tool_slug] = row.click_count;
  }
  return counts;
}

export async function recordClick(slug: string): Promise<ClickCounts> {
  if (!supabase) return {};
  await supabase.rpc("increment_click", { tool: slug });
  return getStats();
}
