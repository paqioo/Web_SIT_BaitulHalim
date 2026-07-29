import Link from "next/link";
import { CalendarBlank } from "@phosphor-icons/react/dist/ssr";

interface NewsItem {
  id: number;
  headline: string;
  content?: string;
  author?: { namaLengkap: string };
  publishedAt?: string | Date;
}

interface BeritaPreviewProps {
  items?: NewsItem[];
}

export async function BeritaPreview({ items = [] }: BeritaPreviewProps) {
  const defaultItems = items.map((item) => (
    <div
      key={item.id}
      className="group rounded-2xl border border-[#e2e8f0] bg-white p-6 transition-all duration-300 hover:border-[#068ec5]/20 hover:shadow-md"
    >
      <div className="flex items-center gap-2 text-xs text-[#94a3b8] mb-3">
        {item.publishedAt && (
          <>
            <CalendarBlank size={14} weight="fill" />
            <span>{new Date(item.publishedAt).toLocaleDateString("id-ID")}</span>
          </>
        )}
      </div>
      <h3 className="text-base font-semibold leading-snug text-[#1a1a2e] line-clamp-2 group-hover:text-[#068ec5] transition-colors">
        {item.headline}
      </h3>
      {item.author && (
        <p className="mt-2 text-xs text-[#94a3b8]">Oleh: {item.author.namaLengkap}</p>
      )}
      <Link
        href={`/berita/${item.id}`}
        className="mt-4 inline-flex text-xs font-semibold text-[#068ec5] hover:underline"
      >
        Baca Selengkapnya &rarr;
      </Link>
    </div>
  ));

  const skeletons = [...Array(3)].map((_, i) => (
    <div
      key={`skeleton-${i}`}
      className="rounded-2xl border border-[#e2e8f0] bg-white p-6"
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="h-3 w-20 animate-pulse rounded-md bg-[#e2e8f0]" />
      </div>
      <div className="h-10 w-full animate-pulse rounded-md bg-[#f1f5f9]" />
      <div className="mt-3 h-4 w-24 animate-pulse rounded-md bg-[#f1f5f9]" />
      <div className="mt-4 h-4 w-28 animate-pulse rounded-md bg-[#f1f5f9]" />
    </div>
  ));

  return (
    <section className="py-24 bg-[#fafcfe]">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#068ec5]/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#068ec5]">
              Berita
            </div>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#1a1a2e] sm:text-4xl">
              Berita Terbaru
            </h2>
          </div>
          <Link
            href="/berita"
            className="text-sm font-semibold text-[#068ec5] transition-colors hover:text-[#0577a3] flex items-center gap-1"
          >
            Lihat Semua &rarr;
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.length > 0 ? defaultItems : skeletons}
        </div>
      </div>
    </section>
  );
}
