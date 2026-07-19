import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const BASE_URL = "https://use.api.co.id/holidays/indonesia/";

type ApiHoliday = {
  id: number;
  date: string;
  name: string;
  type: string;
  year: number;
  is_holiday: boolean;
  is_joint_holiday: boolean;
  is_observance: boolean;
};

async function fetchYear(year: number): Promise<ApiHoliday[]> {
  const apiKey = process.env.API_CO_ID_KEY;
  if (!apiKey) throw new Error("API_CO_ID_KEY not configured");

  const allItems: ApiHoliday[] = [];
  let page = 1;
  let totalPage = 1;

  while (page <= totalPage) {
    const params = new URLSearchParams({
      year: String(year),
      start_date: `${year}-01-01`,
      end_date: `${year}-12-31`,
      page: String(page),
    });

    const resp = await fetch(`${BASE_URL}?${params}`, {
      headers: { accept: "application/json", "x-api-co-id": apiKey },
    });

    if (!resp.ok) {
      throw new Error(`API error for ${year} page ${page}: ${resp.status}`);
    }

    const data: { data?: ApiHoliday[]; paging?: { total_page: number } } = await resp.json();
    const items = data?.data ?? [];
    allItems.push(...items);
    totalPage = data?.paging?.total_page ?? 1;
    page++;
  }

  return allItems;
}

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const syncSecret = process.env.SYNC_SECRET;

  if (syncSecret && authHeader !== `Bearer ${syncSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!supabase) {
    return NextResponse.json({ error: "Database tidak tersedia" }, { status: 500 });
  }

  const { searchParams } = new URL(req.url);
  const from = parseInt(searchParams.get("from") || String(new Date().getFullYear()));
  const to = parseInt(searchParams.get("to") || String(from));

  const years = Array.from({ length: to - from + 1 }, (_, i) => from + i);

  const results = { fetched: 0, touched: 0, inserted: 0, failed: 0, errors: [] as string[] };

  for (const year of years) {
    let items: ApiHoliday[];
    try {
      items = await fetchYear(year);
    } catch (err: unknown) {
      results.failed++;
      results.errors.push(`Year ${year}: ${err instanceof Error ? err.message : String(err)}`);
      continue;
    }

    for (const item of items) {
      results.fetched++;

      const { data: existing } = await supabase
        .from("indonesian_holidays")
        .select("id, date, name, type, is_holiday, is_joint_holiday, is_observance, source_id")
        .eq("source_id", item.id)
        .maybeSingle();

      if (existing) {
        const same =
          existing.date === item.date &&
          existing.name === item.name &&
          existing.type === item.type &&
          existing.is_holiday === item.is_holiday &&
          existing.is_joint_holiday === item.is_joint_holiday &&
          existing.is_observance === item.is_observance;

        if (same) {
          await supabase
            .from("indonesian_holidays")
            .update({ updated_at: new Date().toISOString() })
            .eq("id", existing.id);
          results.touched++;
        } else {
          await supabase
            .from("indonesian_holidays")
            .update({
              date: item.date,
              name: item.name,
              type: item.type,
              year,
              is_holiday: item.is_holiday ?? true,
              is_joint_holiday: item.is_joint_holiday ?? false,
              is_observance: item.is_observance ?? false,
              updated_at: new Date().toISOString(),
            })
            .eq("id", existing.id);
          results.touched++;
        }
      } else {
        await supabase.from("indonesian_holidays").insert({
          source_id: item.id,
          date: item.date,
          name: item.name,
          type: item.type,
          year,
          is_holiday: item.is_holiday ?? true,
          is_joint_holiday: item.is_joint_holiday ?? false,
          is_observance: item.is_observance ?? false,
        });
        results.inserted++;
      }
    }
  }

  return NextResponse.json(results, { status: 200 });
}
