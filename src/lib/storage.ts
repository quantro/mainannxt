import { supabase } from "./supabase";

type ClickCounts = Record<string, number>;

export interface ClickLogEntry {
  id: number;
  tool_slug: string;
  ip_address: string;
  clicked_at: string;
}

export async function getStats(): Promise<ClickCounts> {
  if (!supabase) return {};
  const { data } = await supabase
    .from("tools_tool_clicks")
    .select("tool_slug, click_count");

  if (!data) return {};
  const counts: ClickCounts = {};
  for (const row of data) {
    counts[row.tool_slug] = row.click_count;
  }
  return counts;
}

export async function recordClick(slug: string, ip?: string): Promise<ClickCounts> {
  if (!supabase) return {};
  const { data: existing, error } = await supabase
    .from("tools_tool_clicks")
    .select("click_count")
    .eq("tool_slug", slug)
    .maybeSingle();
  if (!error && existing) {
    await supabase
      .from("tools_tool_clicks")
      .update({ click_count: existing.click_count + 1 })
      .eq("tool_slug", slug);
  } else {
    await supabase
      .from("tools_tool_clicks")
      .insert({ tool_slug: slug, click_count: 1 });
  }
  const { error: logErr } = await supabase.from("tools_click_log").insert({
    tool_slug: slug,
    ip_address: ip || "unknown",
    clicked_at: new Date().toISOString(),
  });
  if (logErr) console.error("click_log insert error:", logErr);
  return getStats();
}

export async function getClickLogs(limit = 200): Promise<ClickLogEntry[]> {
  if (!supabase) return [];
  const { data } = await supabase
    .from("tools_click_log")
    .select("*")
    .order("clicked_at", { ascending: false })
    .limit(limit);
  return (data ?? []) as ClickLogEntry[];
}
