import { NextRequest, NextResponse } from "next/server";
import { getClickLogs } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const limit = Math.min(Number(req.nextUrl.searchParams.get("limit")) || 200, 1000);
  const logs = await getClickLogs(limit);
  return NextResponse.json(logs);
}
