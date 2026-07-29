"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeClosed, SignIn, ArrowLeft } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const [nimNip, setNimNip] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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

      router.push("/dashboard");
      window.location.reload();
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-gradient-to-br from-[#fafcfe] via-white to-[#068ec5]/5 py-20">
      <Link
        href="/"
        className="fixed left-6 top-24 flex items-center gap-1.5 text-sm text-[#64748b] transition-colors hover:text-[#068ec5]"
      >
        <ArrowLeft size={16} weight="bold" />
        Kembali
      </Link>

      <div className="w-full max-w-md px-6">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#068ec5] shadow-lg">
            <SignIn size={28} weight="fill" className="text-white" />
          </div>
          <h1 className="mt-6 text-2xl font-bold tracking-tight text-[#1a1a2e]">
            Masuk ke Akun
          </h1>
          <p className="mt-2 text-sm text-[#64748b]">
            Masukkan NIM/NIP dan password Anda.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 space-y-5">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="nimNip"
              className="block text-sm font-medium text-[#1a1a2e]"
            >
              NIM / NIP
            </label>
            <input
              id="nimNip"
              type="text"
              value={nimNip}
              onChange={(e) => setNimNip(e.target.value)}
              placeholder="Masukkan NIM atau NIP"
              className="mt-1.5 block w-full rounded-xl border border-[#e2e8f0] bg-white px-4 py-3 text-sm text-[#1a1a2e] placeholder-[#94a3b8] transition-colors focus:border-[#068ec5] focus:outline-none focus:ring-2 focus:ring-[#068ec5]/20"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[#1a1a2e]"
            >
              Password
            </label>
            <div className="relative mt-1.5">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                className="block w-full rounded-xl border border-[#e2e8f0] bg-white px-4 py-3 pr-11 text-sm text-[#1a1a2e] placeholder-[#94a3b8] transition-colors focus:border-[#068ec5] focus:outline-none focus:ring-2 focus:ring-[#068ec5]/20"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] transition-colors hover:text-[#64748b]"
              >
                {showPassword ? <EyeClosed size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={cn(
              "flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#068ec5] text-sm font-semibold text-white transition-all active:scale-[0.98]",
              loading ? "opacity-60" : "hover:bg-[#0577a3]"
            )}
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-[#64748b]">
          Belum punya akun?{" "}
          <Link
            href="/aktivasi"
            className="font-semibold text-[#068ec5] transition-colors hover:text-[#0577a3]"
          >
            Aktivasi Akun
          </Link>
        </p>
      </div>
    </div>
  );
}
