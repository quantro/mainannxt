"use client";

import { useState } from "react";
import ThemeToggle from "../theme-toggle";
import { PageTitle } from "../page-title";
import { useToast } from "../toast";

export default function SaranPage() {
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal mengirim");
      }

      setMessage("");
      setStatus("idle");
      toast("Saran berhasil dikirim!", "success");
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Terjadi kesalahan");
    }
  }

  return (
    <div className="flex flex-col items-center min-h-screen px-6 py-24">
      <PageTitle title="Kirim Saran" />
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <h1 className="cosmic-headline text-[32px] leading-[1.1] text-center mb-1">
        Kirim Saran
      </h1>
      <p className="text-[14px] text-[var(--color-ink-muted-48)] text-center mb-8 max-w-sm">
        Punya ide untuk alat baru? Atau ada yang ingin diperbaiki? Tulis saran kamu di sini.
      </p>

      <form
        onSubmit={handleSubmit}
        className="cosmic-card w-full max-w-md p-6 space-y-4"
      >
        <div>
          <label className="text-[13px] font-medium block mb-1.5">
            Saran atau ide kamu
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Contoh: Buat alat kalkulator BMI, atau tambah fitur ekspor PDF…"
            rows={5}
            maxLength={2000}
            required
            className="cosmic-input w-full resize-none text-[14px] p-3"
          />
          <p className="text-[11px] text-[var(--color-ink-muted-48)] mt-1 text-right">
            {message.length}/2000
          </p>
        </div>

        {status === "error" && (
          <p className="text-[13px] text-red-500">{errorMsg}</p>
        )}

        <button
          type="submit"
          disabled={status === "loading" || !message.trim()}
          className="cosmic-btn-primary w-full h-10 text-[14px] disabled:opacity-50"
        >
          {status === "loading" ? "Mengirim…" : "Kirim Saran"}
        </button>
      </form>
    </div>
  );
}
