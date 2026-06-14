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
  const { data: existing, error } = await supabase
    .from("tool_clicks")
    .select("click_count")
    .eq("tool_slug", slug)
    .maybeSingle();
  if (!error && existing) {
    await supabase
      .from("tool_clicks")
      .update({ click_count: existing.click_count + 1 })
      .eq("tool_slug", slug);
  } else {
    await supabase
      .from("tool_clicks")
      .insert({ tool_slug: slug, click_count: 1 });
  }
  return getStats();
}
