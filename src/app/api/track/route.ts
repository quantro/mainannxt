import { NextRequest, NextResponse } from "next/server";
import { recordClick } from "@/lib/storage";

export async function POST(req: NextRequest) {
  try {
    const { slug } = await req.json();
    if (!slug || typeof slug !== "string") {
      return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    }
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";
    const stats = await recordClick(slug, ip);
    return NextResponse.json({ ok: true, stats });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
