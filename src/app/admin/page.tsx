"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Shield } from "@phosphor-icons/react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [nimNip, setNimNip] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nimNip, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login gagal.");
        return;
      }

      if (data.role !== "admin") {
        setError("Akses khusus admin.");
        await fetch("/api/auth/logout", { method: "POST" });
        return;
      }

      window.location.href = "/dashboard";
    } catch {
      setError("Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-[#0f0f1a]">
      <div className="w-full max-w-sm px-6">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#068ec5] shadow-lg">
            <Shield size={28} weight="fill" className="text-white" />
          </div>
          <h1 className="mt-6 text-2xl font-bold tracking-tight text-white">
            Admin Panel
          </h1>
          <p className="mt-2 text-sm text-white/50">Login admin SIT Baitul Halim</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 space-y-5">
          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div>
            <input
              type="text"
              value={nimNip}
              onChange={(e) => setNimNip(e.target.value)}
              placeholder="NIP"
              className="block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 transition-colors focus:border-[#068ec5] focus:outline-none focus:ring-2 focus:ring-[#068ec5]/20"
              required
            />
          </div>

          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 transition-colors focus:border-[#068ec5] focus:outline-none focus:ring-2 focus:ring-[#068ec5]/20"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex h-12 w-full items-center justify-center rounded-xl bg-[#068ec5] text-sm font-semibold text-white transition-all hover:bg-[#0577a3] active:scale-[0.98] disabled:opacity-60"
          >
            {loading ? "..." : "Masuk"}
          </button>
        </form>
      </div>
    </div>
  );
}
