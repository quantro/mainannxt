import { type NextRequest } from "next/server";
import { updateSession } from "./lib/supabase-middleware";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/admin/login") {
    return;
  }

  const { supabaseResponse, user } = await updateSession(request);

  if (!user) {
    const url = new URL("/admin/login", request.url);
    url.searchParams.set("redirect", request.nextUrl.pathname);
    return Response.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: "/admin/:path*",
};
