"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import ThemeToggle from "../theme-toggle";

type Tool = "myip" | "dns" | "port";

const COMMON_PORTS = [
  { port: 20, service: "FTP Data" },
  { port: 21, service: "FTP Control" },
  { port: 22, service: "SSH" },
  { port: 23, service: "Telnet" },
  { port: 25, service: "SMTP" },
  { port: 53, service: "DNS" },
  { port: 80, service: "HTTP" },
  { port: 110, service: "POP3" },
  { port: 143, service: "IMAP" },
  { port: 443, service: "HTTPS" },
  { port: 3306, service: "MySQL" },
  { port: 5432, service: "PostgreSQL" },
  { port: 6379, service: "Redis" },
  { port: 8080, service: "HTTP-Alt" },
  { port: 8443, service: "HTTPS-Alt" },
  { port: 27017, service: "MongoDB" },
];

const TOOLS: { key: Tool; icon: string; label: string }[] = [
  { key: "myip", icon: "\uD83C\uDF10", label: "My IP" },
  { key: "dns", icon: "\uD83D\uDD0D", label: "DNS Lookup" },
  { key: "port", icon: "\uD83D\uDD11", label: "Common Ports" },
];

export default function NetworkPage() {
  const [tab, setTab] = useState<Tool>("myip");
  const [myIp, setMyIp] = useState<string | null>(null);
  const [ipGeo, setIpGeo] = useState<Record<string, string> | null>(null);
  const [dnsDomain, setDnsDomain] = useState("");
  const [dnsResult, setDnsResult] = useState<any[] | null>(null);
  const [dnsLoading, setDnsLoading] = useState(false);
  const [dnsError, setDnsError] = useState("");
  const [portHost, setPortHost] = useState("");
  const [portResults, setPortResults] = useState<{ port: number; service: string; open: boolean | null }[]>(
    COMMON_PORTS.map((p) => ({ ...p, open: null }))
  );
  const [portTesting, setPortTesting] = useState(false);

  useEffect(() => {
    if (tab !== "myip") return;
    fetch("https://api.ipify.org?format=json")
      .then((r) => r.json())
      .then((d) => setMyIp(d.ip))
      .catch(() => setMyIp("Unable to detect"));
  }, [tab]);

  useEffect(() => {
    if (!myIp || myIp === "Unable to detect" || ipGeo) return;
    fetch(`https://ipapi.co/${myIp}/json/`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) return;
        setIpGeo({
          city: d.city || "N/A",
          region: d.region || "N/A",
          country: d.country_name || "N/A",
          org: d.org || "N/A",
          timezone: d.timezone || "N/A",
          lat: d.latitude?.toString() || "N/A",
          lon: d.longitude?.toString() || "N/A",
        });
      })
      .catch(() => {});
  }, [myIp, ipGeo]);

  async function doDnsLookup() {
    const domain = dnsDomain.trim().toLowerCase();
    if (!domain) return;
    setDnsLoading(true);
    setDnsError("");
    setDnsResult(null);
    try {
      const r = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=ALL`);
      const d = await r.json();
      if (d.Status === 3) {
        setDnsError(`Domain "${domain}" does not exist (NXDOMAIN).`);
      } else if (d.Answer) {
        setDnsResult(d.Answer);
      } else if (d.Authority) {
        setDnsResult(d.Authority);
      } else {
        setDnsError("No records found.");
      }
    } catch {
      setDnsError("DNS lookup failed. Check your connection.");
    }
    setDnsLoading(false);
  }

  function testPorts(host: string) {
    const h = host.trim().toLowerCase();
    if (!h) return;
    setPortHost(h);
    setPortTesting(true);
    setPortResults(COMMON_PORTS.map((p) => ({ ...p, open: null })));

    let idx = 0;
    const results = COMMON_PORTS.map(() => false);
    const controller = new AbortController();

    function tryNext() {
      if (idx >= COMMON_PORTS.length) {
        setPortResults(COMMON_PORTS.map((p, i) => ({ ...p, open: results[i] })));
        setPortTesting(false);
        return;
      }
      const port = COMMON_PORTS[idx];
      fetch(`https://${h}:${port.port}`, {
        mode: "no-cors",
        signal: controller.signal,
      })
        .then(() => {
          results[idx] = true;
        })
        .catch(() => {
          results[idx] = false;
        })
        .finally(() => {
          setPortResults(COMMON_PORTS.map((p, i) => ({ ...p, open: results[i] })));
          idx++;
          setTimeout(tryNext, 300);
        });
    }
    tryNext();
  }

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-12">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <h1 className="apple-headline text-[34px] leading-[1.47] tracking-[-0.374px] mb-2">
        Network Tools
      </h1>
      <p className="text-[13px] text-[var(--color-ink-muted-48)] mb-8 text-center max-w-lg">
        Your IP address, DNS lookup, and common port reference.
      </p>

      <div className="w-full max-w-2xl flex gap-1 mb-5">
        {TOOLS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 px-3 py-2.5 rounded-[11px] text-[13px] font-semibold transition-all ${
              tab === t.key
                ? "bg-[var(--color-primary)] text-white"
                : "bg-[var(--color-surface-pearl)] text-[var(--color-ink-muted-48)] hover:brightness-95"
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {tab === "myip" && (
        <div className="w-full max-w-2xl space-y-4">
          <div className="apple-card px-6 py-5 text-center">
            <div className="text-[12px] font-semibold uppercase text-[var(--color-ink-muted-48)] mb-1">Your Public IP</div>
            <div className="text-[28px] font-bold text-[var(--color-ink)] font-mono tracking-tight">
              {myIp || "Detecting..."}
            </div>
          </div>
          {ipGeo && (
            <div className="apple-card px-6 py-5">
              <h3 className="text-[12px] font-semibold uppercase text-[var(--color-ink-muted-48)] mb-3">Geolocation & Network</h3>
              <div className="grid grid-cols-2 gap-2 text-[13px]">
                {[
                  ["City", ipGeo.city],
                  ["Region", ipGeo.region],
                  ["Country", ipGeo.country],
                  ["ISP / Org", ipGeo.org],
                  ["Timezone", ipGeo.timezone],
                  ["Latitude", ipGeo.lat],
                  ["Longitude", ipGeo.lon],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="px-3 py-2 rounded-[9px] bg-[var(--color-surface-pearl)] flex justify-between items-center"
                  >
                    <span className="text-[var(--color-ink-muted-48)]">{label}</span>
                    <span className="font-semibold text-[var(--color-ink)] text-right ml-2">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="apple-card px-6 py-5">
            <p className="text-[12px] leading-[1.6] text-[var(--color-ink-muted-48)]">
              Your public IP address is how the rest of the internet sees you. It is assigned by your Internet Service Provider (ISP) and can be static (fixed) or dynamic (changes periodically). Geolocation data is approximate and based on your ISP's registration, not your exact location.
            </p>
          </div>
        </div>
      )}

      {tab === "dns" && (
        <div className="w-full max-w-2xl space-y-4">
          <div className="apple-card px-6 py-5">
            <h3 className="text-[12px] font-semibold uppercase text-[var(--color-ink-muted-48)] mb-3">DNS Lookup</h3>
            <div className="flex items-center gap-2">
              <input
                value={dnsDomain}
                onChange={(e) => setDnsDomain(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && doDnsLookup()}
                placeholder="example.com"
                className="apple-input flex-1 h-10 text-[14px] font-mono"
              />
              <button
                onClick={doDnsLookup}
                disabled={dnsLoading}
                className="apple-btn-primary h-10 px-4 text-[13px] whitespace-nowrap"
              >
                {dnsLoading ? "..." : "Lookup"}
              </button>
            </div>
          </div>

          {dnsError && (
            <div className="apple-card px-6 py-5 border border-red-300">
              <p className="text-[13px] text-red-500">{dnsError}</p>
            </div>
          )}

          {dnsResult && (
            <div className="apple-card px-6 py-5">
              <h3 className="text-[12px] font-semibold uppercase text-[var(--color-ink-muted-48)] mb-3">
                Records for {dnsDomain}
              </h3>
              <div className="grid grid-cols-1 gap-1.5">
                {dnsResult.map((rec, i) => (
                  <div
                    key={i}
                    className="px-3 py-2 rounded-[9px] bg-[var(--color-surface-pearl)] text-[13px] flex items-center gap-3 font-mono"
                  >
                    <span className="font-semibold text-[var(--color-primary)] min-w-[40px]">{rec.type}</span>
                    <span className="text-[var(--color-ink-muted-48)]">{rec.TTL || "-"}s</span>
                    <span className="text-[var(--color-ink)] break-all">{rec.data}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!dnsResult && !dnsError && (
            <div className="apple-card px-6 py-5">
              <p className="text-[12px] leading-[1.6] text-[var(--color-ink-muted-48)]">
                DNS (Domain Name System) translates human-readable domain names like "example.com" into IP addresses that computers use to communicate. This tool performs a DNS lookup using Google's public DNS resolver (8.8.8.8) and returns all available record types including A (IPv4), AAAA (IPv6), MX (mail), CNAME (aliases), and NS (nameservers).
              </p>
            </div>
          )}
        </div>
      )}

      {tab === "port" && (
        <div className="w-full max-w-2xl space-y-4">
          <div className="apple-card px-6 py-5">
            <h3 className="text-[12px] font-semibold uppercase text-[var(--color-ink-muted-48)] mb-3">Common Ports Reference</h3>
            <div className="grid grid-cols-2 gap-1.5">
              {portResults.map((p) => (
                <div
                  key={p.port}
                  className="px-3 py-2 rounded-[9px] bg-[var(--color-surface-pearl)] text-[12px] flex items-center justify-between"
                >
                  <div>
                    <span className="font-semibold text-[var(--color-ink)]">{p.port}</span>
                    <span className="text-[var(--color-ink-muted-48)] ml-2">{p.service}</span>
                  </div>
                  <span className="text-[var(--color-ink-muted-48)]">IANA</span>
                </div>
              ))}
            </div>
          </div>
          <div className="apple-card px-6 py-5">
            <p className="text-[12px] leading-[1.6] text-[var(--color-ink-muted-48)]">
              These are well-known ports assigned by the Internet Assigned Numbers Authority (IANA). Ports 0-1023 are system ports, 1024-49151 are registered ports, and 49152-65535 are dynamic/private. Each port number is associated with a specific protocol or service to standardize network communication.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
