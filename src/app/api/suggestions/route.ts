import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { name, message } = await req.json();
    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json({ error: "Pesan tidak boleh kosong" }, { status: 400 });
    }
    if (message.length > 2000) {
      return NextResponse.json({ error: "Pesan maksimal 2000 karakter" }, { status: 400 });
    }

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    if (!supabase) {
      return NextResponse.json({ error: "Database tidak tersedia" }, { status: 500 });
    }

    const { error } = await supabase.from("suggestions").insert({
      name: typeof name === "string" && name.trim() ? name.trim() : null,
      message: message.trim(),
      ip,
    });

    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Gagal mengirim saran" }, { status: 500 });
  }
}

export async function GET() {
  if (!supabase) return NextResponse.json([]);
  const { data } = await supabase
    .from("suggestions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);
  return NextResponse.json(data ?? []);
}
