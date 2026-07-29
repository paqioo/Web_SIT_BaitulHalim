import Link from "next/link";

interface GalleryItem {
  id: number;
  judul: string;
  fotoUrl: string;
}

interface GaleriPreviewProps {
  items?: GalleryItem[];
}

export default function GaleriPreview({ items = [] }: GaleriPreviewProps) {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#068ec5]/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#068ec5]">
              Galeri
            </div>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#1a1a2e] sm:text-4xl">
              Galeri Foto
            </h2>
          </div>
          <Link
            href="/galeri"
            className="text-sm font-semibold text-[#068ec5] transition-colors hover:text-[#0577a3] flex items-center gap-1 group"
          >
            Lihat Semua &rarr;
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {items.length > 0 ? (
            items.slice(0, 8).map((item) => (
              <div
                key={item.id}
                className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#f1f5f9] border border-[#e2e8f0]"
              >
                <img
                  src={item.fotoUrl}
                  alt={item.judul}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            ))
          ) : (
            [...Array(4)].map((_, i) => (
              <div
                key={i}
                className="aspect-[4/3] rounded-2xl bg-[#f1f5f9] border border-[#e2e8f0]"
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
