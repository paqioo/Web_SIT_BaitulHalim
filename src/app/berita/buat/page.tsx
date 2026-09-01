"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowLeft } from "@phosphor-icons/react";
import { uploadImageToSupabase } from "@/lib/uploadImage";

interface Session {
  userId: number;
  nimNip: string;
  role: string;
  unitSekolah: string;
  namaLengkap: string;
  fotoProfilUrl: string | null;
}

const RichTextEditor = dynamic(
  () => import("@/components/ui/RichTextEditor"),
  { ssr: false }
);

export default function BuatPostinganPage() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [headline, setHeadline] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data) router.push("/login?redirect=/berita/buat");
        else setSession(data);
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleSubmit = async () => {
    if (!headline || !content) {
      setError("Headline dan konten harus diisi.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/berita", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ headline, content }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Gagal membuat postingan.");
        return;
      }

      router.push(`/berita/${data.id}`);
    } catch {
      setError("Terjadi kesalahan.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#068ec5] border-t-transparent" />
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-[100dvh] pt-24">
      <div className="mx-auto max-w-[900px] px-6 pb-20 lg:px-8">
        <Link
          href="/berita"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-[#64748b] transition-colors hover:text-[#068ec5]"
        >
          <ArrowLeft size={16} weight="bold" />
          Kembali ke Berita
        </Link>

        <div className="rounded-2xl border border-[#e2e8f0] bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold tracking-tight text-[#1a1a2e]">
            Buat Postingan Baru
          </h1>
          <p className="mt-1 text-sm text-[#64748b]">
            {session.role === "murid"
              ? "Setelah dikirim, berita Anda akan ditinjau oleh Guru/Admin."
              : "Berita akan langsung dipublikasikan."}
          </p>

          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="mt-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#1a1a2e]">
                Headline
              </label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Judul berita..."
                maxLength={255}
                className="mt-1.5 block w-full rounded-xl border border-[#e2e8f0] bg-white px-4 py-3 text-sm text-[#1a1a2e] placeholder-[#94a3b8] transition-colors focus:border-[#068ec5] focus:outline-none focus:ring-2 focus:ring-[#068ec5]/20"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1a1a2e]">
                Konten
              </label>
              <p className="mt-1 mb-3 text-xs text-[#94a3b8]">
                Anda dapat menambahkan gambar dan video di dalam teks.
              </p>
              <RichTextEditor
                content={content}
                onChange={setContent}
                placeholder="Tulis artikel Anda di sini..."
                uploader={uploadImageToSupabase}
              />
            </div>

            <div className="flex items-center gap-3 pt-4">
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="rounded-xl bg-[#068ec5] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#0577a3] active:scale-[0.98] disabled:opacity-50"
              >
                {submitting ? "Mempublikasikan..." : "Publikasikan"}
              </button>
              <Link
                href="/berita"
                className="rounded-xl border border-[#e2e8f0] px-6 py-3 text-sm font-medium text-[#64748b] transition-colors hover:bg-[#f1f5f9]"
              >
                Batal
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
