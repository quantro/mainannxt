import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!supabase) {
    return NextResponse.json({ error: "Database tidak tersedia" }, { status: 500 });
  }

  const { searchParams } = new URL(req.url);
  const year = searchParams.get("year");
  const type = searchParams.get("type");

  let query = supabase
    .from("indonesian_holidays")
    .select("*")
    .order("date", { ascending: true });

  if (year) {
    query = query.eq("year", parseInt(year));
  }
  if (type) {
    query = query.eq("type", type);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}
