"use client";

import { createBrowserClient } from "@supabase/ssr";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import ThemeToggle from "../theme-toggle";

const nav = [
  { href: "/admin", label: "Dashboard", icon: "\uD83D\uDCCA" },
  { href: "/admin/clicks", label: "Click Log", icon: "\uD83D\uDCCB" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const isLogin = path === "/admin/login";

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  if (isLogin) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-56 shrink-0 border-r border-[var(--color-divider-soft)] p-4 flex flex-col gap-1">
        <div className="flex items-center justify-between mb-6">
          <Link href="/admin" className="text-[15px] font-semibold no-underline">
            Admin
          </Link>
          <ThemeToggle />
        </div>
        {nav.map((item) => {
          const active = path === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] no-underline transition-colors ${
                active
                  ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-medium"
                  : "text-[var(--color-ink-muted-48)] hover:bg-[var(--color-divider-soft)]"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
        <button
          onClick={handleSignOut}
          className="mt-auto flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] text-[var(--color-ink-muted-48)] hover:bg-[var(--color-divider-soft)] transition-colors no-underline w-full text-left"
        >
          Sign Out
        </button>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
