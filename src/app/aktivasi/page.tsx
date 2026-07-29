"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle, XCircle, UserPlus } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

type Step = "nim" | "form";

interface NimStatus {
  terdaftar: boolean;
  status?: string;
  role?: string;
  sudahPunyaAkun?: boolean;
}

export default function AktivasiPage() {
  const [step, setStep] = useState<Step>("nim");
  const [nimNip, setNimNip] = useState("");
  const [nimStatus, setNimStatus] = useState<NimStatus | null>(null);
  const [checking, setChecking] = useState(false);

  const [namaLengkap, setNamaLengkap] = useState("");
  const [password, setPassword] = useState("");
  const [konfirmasiPassword, setKonfirmasiPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleCheckNim = async () => {
    if (!nimNip.trim()) {
      setError("NIM/NIP harus diisi.");
      return;
    }
    setError("");
    setChecking(true);

    try {
      const res = await fetch(`/api/auth/cek-nim?nim=${encodeURIComponent(nimNip.trim())}`);
      const data = await res.json();

        if (data.terdaftar && data.sudahPunyaAkun) {
        setNimStatus(data);
        setError("Akun sudah aktif. Silakan login.");
      } else if (data.terdaftar && !data.sudahPunyaAkun) {
        setNimStatus(data);
        setStep("form");
      } else {
        setNimStatus(data);
        setError("Data tidak diketahui. Hubungi admin untuk pendaftaran.");
      }
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setChecking(false);
    }
  };

  const handleActivate = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!namaLengkap) {
      setError("Nama lengkap harus diisi.");
      return;
    }
    if (!password) {
      setError("Password harus diisi.");
      return;
    }
    if (password !== konfirmasiPassword) {
      setError("Password dan konfirmasi tidak cocok.");
      return;
    }
    if (password.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/auth/aktivasi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nimNip: nimNip.trim(),
          namaLengkap: namaLengkap.trim(),
          password,
          konfirmasiPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Gagal mengaktivasi akun.");
        return;
      }

      setSuccess(true);
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-gradient-to-br from-[#fafcfe] via-white to-[#068ec5]/5 py-20">
        <Link
          href="/"
          className="fixed left-6 top-24 flex items-center gap-1.5 text-sm text-[#64748b] transition-colors hover:text-[#068ec5]"
        >
          <ArrowLeft size={16} weight="bold" />
          Kembali
        </Link>
        <div className="w-full max-w-md px-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle size={32} weight="fill" className="text-emerald-600" />
          </div>
          <h1 className="mt-6 text-2xl font-bold tracking-tight text-[#1a1a2e]">
            Aktivasi Berhasil!
          </h1>
          <p className="mt-2 text-sm text-[#64748b]">
            Akun Anda sudah aktif. Silakan login dengan NIM/NIP dan password yang sudah dibuat.
          </p>
          <Link
            href="/login"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-[#068ec5] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#0577a3]"
          >
            Masuk ke Login
          </Link>
        </div>
      </div>
    );
  }

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
            <UserPlus size={28} weight="fill" className="text-white" />
          </div>
          <h1 className="mt-6 text-2xl font-bold tracking-tight text-[#1a1a2e]">
            Aktivasi Akun
          </h1>
          <p className="mt-2 text-sm text-[#64748b]">
            {step === "nim"
              ? "Masukkan NIM/NIP Anda untuk memulai aktivasi."
              : "Lengkapi data diri dan buat password."}
          </p>
        </div>

        {/* NIM Lookup Step */}
        {step === "nim" && (
          <div className="mt-10 space-y-5">
            {error && (
              <div className={cn(
                "flex items-center gap-2 rounded-xl border px-4 py-3 text-sm",
                nimStatus?.terdaftar === false
                  ? "border-red-200 bg-red-50 text-red-600"
                  : "border-red-200 bg-red-50 text-red-600"
              )}>
                {nimStatus?.terdaftar === false ? (
                  <XCircle size={18} weight="fill" className="shrink-0 text-red-500" />
                ) : (
                  <XCircle size={18} weight="fill" className="shrink-0 text-red-500" />
                )}
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[#1a1a2e]">NIM / NIP</label>
              <input
                type="text"
                value={nimNip}
                onChange={(e) => {
                  setNimNip(e.target.value);
                  setNimStatus(null);
                  setError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCheckNim();
                }}
                placeholder="Masukkan NIM atau NIP"
                className="mt-1.5 block w-full rounded-xl border border-[#e2e8f0] bg-white px-4 py-3 text-sm text-[#1a1a2e] placeholder-[#94a3b8] transition-colors focus:border-[#068ec5] focus:outline-none focus:ring-2 focus:ring-[#068ec5]/20"
                required
              />
            </div>

            {nimStatus?.terdaftar && (
              <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-600">
                <CheckCircle size={18} weight="fill" className="shrink-0" />
                <span>
                  Data terdaftar sebagai <strong>{nimStatus.role}</strong>. Silakan lanjutkan.
                </span>
              </div>
            )}

            <button
              onClick={handleCheckNim}
              disabled={checking || !nimNip.trim()}
              className={cn(
                "flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#068ec5] text-sm font-semibold text-white transition-all active:scale-[0.98]",
                checking ? "opacity-60" : "hover:bg-[#0577a3]"
              )}
            >
              {checking ? "Mengecek..." : "Cek NIM/NIP"}
            </button>
          </div>
        )}

        {/* Registration Form Step */}
        {step === "form" && (
          <form onSubmit={handleActivate} className="mt-10 space-y-5">
            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                <XCircle size={18} weight="fill" className="shrink-0" />
                {error}
              </div>
            )}

            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-emerald-600">
                <CheckCircle size={18} weight="fill" className="shrink-0" />
                Data terdaftar. Silakan lengkapi data diri.
              </div>
              <p className="mt-1 text-xs text-emerald-500">
                NIM/NIP: {nimNip}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1a1a2e]">Nama Lengkap</label>
              <input
                type="text"
                value={namaLengkap}
                onChange={(e) => setNamaLengkap(e.target.value)}
                placeholder="Nama lengkap"
                className="mt-1.5 block w-full rounded-xl border border-[#e2e8f0] bg-white px-4 py-3 text-sm text-[#1a1a2e] placeholder-[#94a3b8] transition-colors focus:border-[#068ec5] focus:outline-none focus:ring-2 focus:ring-[#068ec5]/20"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1a1a2e]">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Buat password (minimal 6 karakter)"
                className="mt-1.5 block w-full rounded-xl border border-[#e2e8f0] bg-white px-4 py-3 text-sm text-[#1a1a2e] placeholder-[#94a3b8] transition-colors focus:border-[#068ec5] focus:outline-none focus:ring-2 focus:ring-[#068ec5]/20"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1a1a2e]">Konfirmasi Password</label>
              <input
                type="password"
                value={konfirmasiPassword}
                onChange={(e) => setKonfirmasiPassword(e.target.value)}
                placeholder="Ulangi password"
                className="mt-1.5 block w-full rounded-xl border border-[#e2e8f0] bg-white px-4 py-3 text-sm text-[#1a1a2e] placeholder-[#94a3b8] transition-colors focus:border-[#068ec5] focus:outline-none focus:ring-2 focus:ring-[#068ec5]/20"
                required
              />
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className={cn(
                  "flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#068ec5] text-sm font-semibold text-white transition-all active:scale-[0.98]",
                  submitting ? "opacity-60" : "hover:bg-[#0577a3]"
                )}
              >
                {submitting ? "Mengaktivasi..." : "Aktivasi Akun"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep("nim");
                  setNimStatus(null);
                  setError("");
                }}
                className="text-sm text-center text-[#64748b] hover:text-[#068ec5] transition-colors"
              >
                Gunakan NIM/NIP lain
              </button>
            </div>
          </form>
        )}

        <p className="mt-8 text-center text-sm text-[#64748b]">
          Sudah punya akun?{" "}
          <Link href="/login" className="font-semibold text-[#068ec5] transition-colors hover:text-[#0577a3]">
            Masuk
          </Link>
        </p>
      </div>
    </div>
  );
}
