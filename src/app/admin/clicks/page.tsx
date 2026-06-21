"use client";

import { useEffect, useState } from "react";
import { PageTitle } from "../../page-title";
import { SkeletonTable } from "../../skeleton";

interface LogEntry {
  id: number;
  tool_slug: string;
  ip_address: string;
  clicked_at: string;
}

const toolsInfo: Record<string, { icon: string; name: string }> = {
  "/word-maker": { icon: "\u270F\uFE0F", name: "Word Maker" },
  "/anagram": { icon: "\uD83C\uDFB2", name: "Anagram Finder" },
  "/acronym": { icon: "\uD83C\uDFAF", name: "Acronym Builder" },
  "/blender": { icon: "\uD83E\uDDEA", name: "Name Blender" },
  "/ladder": { icon: "\uD83E\uDE9C", name: "Word Ladder" },
  "/cipher": { icon: "\uD83D\uDD11", name: "Cipher Tool" },
  "/wheel": { icon: "\uD83C\uDFAF", name: "Wheel of Names" },
  "/network": { icon: "\uD83C\uDF10", name: "Network Tools" },
  "/pdf-forge": { icon: "\uD83D\uDCC4", name: "PDF Forge" },
  "/password-generator": { icon: "\uD83D\uDD11", name: "Password Generator" },
  "/qr-code": { icon: "\uD83D\uDCF1", name: "QR Code Generator" },
  "/indonesian-holidays": { icon: "\uD83C\uDDEE\uD83C\uDDE9", name: "Indonesian Holidays" },
  "/weton-calendar": { icon: "\uD83D\uDCC6", name: "Weton Calendar" },
  "/tafsir-mimpi": { icon: "\uD83D\uDCAD", name: "Tafsir Mimpi" },
  "/zodiac": { icon: "\uD83C\uDF1F", name: "Star Sign Reader" },
  "/tarot": { icon: "\uD83C\uDF84", name: "Tarot Reading" },
  "/runes": { icon: "\uD83E\uDEA8", name: "Rune Divination" },
  "/numerology": { icon: "\uD83D\uDD22", name: "Numerology" },
  "/chinese-zodiac": { icon: "\uD83D\uDC32", name: "Chinese Zodiac" },
  "/fortune": { icon: "\uD83D\uDD2E", name: "Fortune Teller" },
  "/primbon": { icon: "\uD83C\uDF19", name: "Primbon Jawa" },
  "/pranata-mangsa": { icon: "\uD83C\uDF3E", name: "Pranata Mangsa" },
  "/calendar": { icon: "\uD83D\uDCC5", name: "World Calendars" },
};

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("en-ID", {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    hour12: false,
  });
}

function maskIp(ip: string) {
  if (ip === "unknown" || ip === "::1" || ip.startsWith("192.168.") || ip.startsWith("10.") || ip.startsWith("172.")) return ip;
  const parts = ip.split(".");
  if (parts.length === 4) return `${parts[0]}.${parts[1]}.${parts[2]}.xxx`;
  return ip;
}

function IpSummary({
  logs, maskIp, toolsInfo, formatTime,
}: {
  logs: LogEntry[];
  maskIp: (ip: string) => string;
  toolsInfo: Record<string, { icon: string; name: string }>;
  formatTime: (iso: string) => string;
}) {
  const byIp = logs.reduce<Record<string, { count: number; tools: Set<string>; first: string; last: string }>>((acc, l) => {
    if (!acc[l.ip_address]) {
      acc[l.ip_address] = { count: 0, tools: new Set(), first: l.clicked_at, last: l.clicked_at };
    }
    const ip = acc[l.ip_address];
    ip.count++;
    ip.tools.add(l.tool_slug);
    if (l.clicked_at < ip.first) ip.first = l.clicked_at;
    if (l.clicked_at > ip.last) ip.last = l.clicked_at;
    return acc;
  }, {});

  const sorted = Object.entries(byIp).sort((a, b) => b[1].count - a[1].count);

  return (
    <div className="w-full max-w-3xl space-y-2">
      {sorted.map(([ip, data]) => {
        const toolEntries = [...data.tools].map((slug) => toolsInfo[slug] || { icon: "\uD83D\uDCC1", name: slug });
        return (
          <div key={ip} className="cosmic-card px-4 py-3 text-[13px]">
            <div className="flex items-center justify-between mb-1.5">
              <code className="text-[12px] font-mono font-semibold">{maskIp(ip)}</code>
              <span className="text-[12px] text-[var(--color-ink-muted-48)] tabular-nums">
                {data.count} click{data.count === 1 ? "" : "s"}
              </span>
            </div>
            <div className="flex flex-wrap gap-1 mb-1.5">
              {toolEntries.map((t) => (
                <span key={t.name} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[6px] bg-[var(--color-surface-pearl)] text-[11px]">
                  {t.icon} {t.name}
                </span>
              ))}
            </div>
            <div className="text-[11px] text-[var(--color-ink-muted-48)]">
              {formatTime(data.first)} – {formatTime(data.last)}
            </div>
          </div>
        );
      })}
      {sorted.length === 0 && (
        <p className="text-[14px] text-[var(--color-ink-muted-48)] text-center py-8">No clicks yet.</p>
      )}
    </div>
  );
}

export default function AdminClickLog() {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"timeline" | "ips">("timeline");

  useEffect(() => {
    fetch("/api/click-log?limit=500")
      .then((r) => r.json())
      .then((data) => {
        setLogs(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = search.trim()
    ? logs.filter(
        (l) =>
          l.tool_slug.toLowerCase().includes(search.toLowerCase()) ||
          l.ip_address.includes(search)
      )
    : logs;

  const grouped = filtered.reduce<Record<string, LogEntry[]>>((acc, l) => {
    const day = l.clicked_at.slice(0, 10);
    if (!acc[day]) acc[day] = [];
    acc[day].push(l);
    return acc;
  }, {});

  return (
    <div>
      <PageTitle title="Click Log" />
      <h1 className="text-[24px] font-semibold mb-1">Click Log</h1>
      <p className="text-[13px] text-[var(--color-ink-muted-48)] mb-6">
        {logs.length} click{logs.length === 1 ? "" : "s"} recorded
      </p>

      <div className="flex items-center gap-3 mb-8">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by tool or IP…"
          className="cosmic-input w-full max-w-xs h-10 text-[14px] text-center"
        />
        <button
          onClick={() => setView(view === "timeline" ? "ips" : "timeline")}
          className="cosmic-btn h-10 px-4 text-[13px]"
        >
          {view === "timeline" ? "IP Summary" : "Timeline"}
        </button>
      </div>

      {loading ? (
        <SkeletonTable rows={10} />
      ) : view === "ips" ? (
        <IpSummary logs={filtered} maskIp={maskIp} toolsInfo={toolsInfo} formatTime={formatTime} />
      ) : (
        <div className="w-full max-w-2xl space-y-6">
          {Object.entries(grouped).map(([day, entries]) => (
            <div key={day}>
              <h2 className="text-[13px] font-semibold uppercase tracking-[0.5px] text-[var(--color-ink-muted-48)] mb-2">
                {new Date(day + "T00:00:00").toLocaleDateString("en-ID", {
                  weekday: "long", year: "numeric", month: "long", day: "numeric",
                })}
              </h2>
              <div className="space-y-1">
                {entries.map((entry) => {
                  const info = toolsInfo[entry.tool_slug];
                  return (
                    <div
                      key={entry.id}
                      className="cosmic-card flex items-center gap-3 px-4 py-2.5 text-[13px]"
                    >
                      <span className="text-[18px] shrink-0">{info?.icon || "\uD83D\uDCC1"}</span>
                      <div className="flex-1 min-w-0">
                        <span className="font-medium">{info?.name || entry.tool_slug}</span>
                      </div>
                      <code className="text-[11px] font-mono text-[var(--color-ink-muted-48)] shrink-0">
                        {maskIp(entry.ip_address)}
                      </code>
                      <span className="text-[11px] text-[var(--color-ink-muted-48)] shrink-0 tabular-nums">
                        {formatTime(entry.clicked_at)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-[14px] text-[var(--color-ink-muted-48)] text-center py-8">
              {search ? "No matching clicks." : "No clicks yet."}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
