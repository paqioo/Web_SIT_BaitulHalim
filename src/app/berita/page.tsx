"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  MagnifyingGlass,
  CalendarBlank,
  User,
  Plus,
} from "@phosphor-icons/react";

interface BeritaItem {
  id: number;
  headline: string;
  content: string;
  status: string;
  author: { namaLengkap: string } | null;
  publishedAt: string | null;
}

interface SessionData {
  userId: number;
  role: string;
  namaLengkap: string;
  fotoProfilUrl: string | null;
}

export default function BeritaPage() {
  const [items, setItems] = useState<BeritaItem[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("terbaru");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<SessionData | null>(null);
  const perPage = 9;

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => (r.ok ? r.json() : null))
      .then(setSession);
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      limit: String(perPage),
      sort,
    });
    if (search) params.set("search", search);

    fetch(`/api/berita?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setItems(data.items || []);
        setTotal(data.total || 0);
      })
      .finally(() => setLoading(false));
  }, [page, sort, search]);

  const totalPages = Math.ceil(total / perPage);

  return (
    <div className="min-h-[100dvh] pt-24">
      <section className="bg-gradient-to-b from-[#068ec5]/5 to-white py-16">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#068ec5]/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#068ec5]">
              Berita
            </div>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-[#1a1a2e]">
              Berita & Artikel
            </h1>
          </div>

          <div className="mx-auto mt-10 flex max-w-2xl flex-col items-center gap-4 sm:flex-row">
            <div className="relative flex-1 w-full">
              <MagnifyingGlass
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]"
              />
              <input
                type="text"
                placeholder="Cari berita..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-xl border border-[#e2e8f0] bg-white py-3 pl-11 pr-4 text-sm text-[#1a1a2e] placeholder-[#94a3b8] transition-colors focus:border-[#068ec5] focus:outline-none focus:ring-2 focus:ring-[#068ec5]/20"
              />
            </div>
            <div className="flex items-center gap-2">
              {["terbaru", "terlama"].map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setSort(s);
                    setPage(1);
                  }}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition-all",
                    sort === s
                      ? "bg-[#068ec5] text-white"
                      : "bg-white border border-[#e2e8f0] text-[#64748b] hover:border-[#068ec5]/30"
                  )}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
            {session && (
              <Link
                href="/berita/buat"
                className="flex items-center gap-1.5 rounded-full bg-[#068ec5] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#0577a3]"
              >
                <Plus size={16} weight="bold" />
                Buat Postingan
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-2xl border border-[#e2e8f0] bg-white p-6">
                  <div className="h-3 w-24 animate-pulse rounded bg-[#e2e8f0]" />
                  <div className="mt-3 h-6 w-full animate-pulse rounded bg-[#f1f5f9]" />
                  <div className="mt-2 h-4 w-20 animate-pulse rounded bg-[#f1f5f9]" />
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-sm text-[#64748b]">Belum ada berita.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                  <Link
                    key={item.id}
                    href={`/berita/${item.id}`}
                    className="group rounded-2xl border border-[#e2e8f0] bg-white p-6 transition-all hover:border-[#068ec5]/20 hover:shadow-md"
                  >
                    <div className="flex items-center gap-2 text-xs text-[#94a3b8]">
                      {item.publishedAt && (
                        <>
                          <CalendarBlank size={12} weight="fill" />
                          {new Date(item.publishedAt).toLocaleDateString("id-ID")}
                        </>
                      )}
                    </div>
                    <h3 className="mt-3 text-base font-semibold leading-snug text-[#1a1a2e] line-clamp-3 group-hover:text-[#068ec5] transition-colors">
                      {item.headline}
                    </h3>
                    {item.author && (
                      <p className="mt-3 flex items-center gap-1 text-xs text-[#94a3b8]">
                        <User size={12} weight="fill" />
                        {item.author.namaLengkap}
                      </p>
                    )}
                  </Link>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-xl text-sm font-medium transition-all",
                        page === i + 1
                          ? "bg-[#068ec5] text-white"
                          : "border border-[#e2e8f0] bg-white text-[#64748b] hover:border-[#068ec5]/30"
                      )}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
