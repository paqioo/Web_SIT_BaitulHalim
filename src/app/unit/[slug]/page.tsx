import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";

interface Props {
  params: Promise<{ slug: string }>;
}

const validUnits = ["tkit", "sdit", "smpit"];

export default async function UnitPage({ params }: Props) {
  const { slug } = await params;

  if (!validUnits.includes(slug)) {
    notFound();
  }

  const unit = slug.toUpperCase() as string;
  const unitLabel = unit === "TKIT" ? "TKIT" : unit === "SDIT" ? "SDIT" : "SMPIT";

  const [sambutan, pendidik, berprestasi, galeri, berita] =
    await Promise.all([
      prisma.webContent.findUnique({
        where: { key: `${slug}_sambutan` },
      }),
      prisma.tenagaPendidik.findMany({
        where: { unitId: unit },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.muridBerprestasi.findMany({
        where: { unitId: unit },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.gallery.findMany({
        where: { section: unit },
        take: 6,
        orderBy: { createdAt: "desc" },
      }),
      prisma.postBerita.findMany({
        where: { status: "Published" },
        take: 3,
        orderBy: { publishedAt: "desc" },
        include: {
          author: {
            include: { masterData: { select: { namaLengkap: true } } },
          },
        },
      }),
    ]);

  return (
    <>
      {/* Hero Unit */}
      <section className="relative flex min-h-[50dvh] items-center justify-center overflow-hidden bg-[#068ec5]">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.03] blur-3xl" />
        <div className="relative z-10 text-center">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-1 text-sm text-white/70 hover:text-white"
          >
            <ArrowLeft size={14} weight="bold" />
            Kembali
          </Link>
          <h1 className="text-5xl font-bold tracking-tight text-white md:text-6xl">
            Unit {unitLabel}
          </h1>
        </div>
      </section>

      {/* Sambutan */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
          <div className="flex flex-col items-center gap-10 md:flex-row">
            <div className="h-40 w-40 shrink-0 overflow-hidden rounded-full border-4 border-[#e2e8f0] bg-[#f1f5f9] flex items-center justify-center text-[#94a3b8]" />
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#068ec5]/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#068ec5]">
                Sambutan Kepala Sekolah
              </div>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#64748b]">
                {sambutan?.value ||
                  `Selamat datang di Unit ${unitLabel}. Kami berkomitmen memberikan pendidikan terbaik bagi putra-putri Anda.`}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tenaga Pendidik */}
      {pendidik.length > 0 && (
        <section className="py-20 bg-[#fafcfe] border-y border-[#e2e8f0]">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#068ec5]/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#068ec5]">
                Tenaga Pendidik
              </div>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#1a1a2e]">
                Pendidik {unitLabel}
              </h2>
            </div>
            <div className="mt-12 flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
              {pendidik.map((p) => (
                <div
                  key={p.id}
                  className="min-w-[280px] shrink-0 snap-start rounded-2xl border border-[#e2e8f0] bg-white p-6 text-center"
                >
                  <div className="mx-auto h-20 w-20 rounded-full overflow-hidden">
                    {p.fotoUrl ? (
                      <img src={p.fotoUrl} alt={p.nama} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[#f1f5f9] text-[#94a3b8] text-lg font-bold">
                        {p.nama.charAt(0)}
                      </div>
                    )}
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-[#1a1a2e]">{p.nama}</h3>
                  <p className="text-xs font-medium text-[#068ec5]">{p.jabatan}</p>
                  {p.deskripsi && (
                    <p className="mt-2 text-xs leading-relaxed text-[#64748b]">{p.deskripsi}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Murid Berprestasi */}
      {berprestasi.length > 0 && (
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#068ec5]/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#068ec5]">
                Prestasi
              </div>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#1a1a2e]">
                Murid Berprestasi
              </h2>
            </div>
            <div className="mt-12 flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
              {berprestasi.map((m) => (
                <div
                  key={m.id}
                  className="min-w-[280px] shrink-0 snap-start rounded-2xl border border-[#e2e8f0] bg-[#fafcfe] p-6 text-center"
                >
                  <div className="mx-auto h-20 w-20 rounded-full bg-[#068ec5]/10 flex items-center justify-center text-[#068ec5] text-2xl font-bold">
                    {m.nama.charAt(0)}
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-[#1a1a2e]">{m.nama}</h3>
                  <p className="mt-1 text-xs font-medium text-[#068ec5]">{m.prestasi}</p>
                  {m.deskripsi && (
                    <p className="mt-2 text-xs leading-relaxed text-[#64748b]">{m.deskripsi}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Galeri Unit */}
      {galeri.length > 0 && (
        <section className="py-20 bg-[#fafcfe] border-t border-[#e2e8f0]">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-[#068ec5]/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#068ec5]">
                  Galeri
                </div>
                <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#1a1a2e]">
                  Galeri {unitLabel}
                </h2>
              </div>
              <Link
                href="/galeri"
                className="text-sm font-semibold text-[#068ec5] hover:underline"
              >
                Lihat Semua &rarr;
              </Link>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3">
              {galeri.map((g) => (
                <div
                  key={g.id}
                  className="aspect-[4/3] overflow-hidden rounded-2xl border border-[#e2e8f0] bg-[#f1f5f9]"
                >
                  <img
                    src={g.fotoUrl}
                    alt={g.judul}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Berita Unit */}
      {berita.length > 0 && (
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-[#068ec5]/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#068ec5]">
                  Berita
                </div>
                <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#1a1a2e]">
                  Berita {unitLabel}
                </h2>
              </div>
              <Link
                href="/berita"
                className="text-sm font-semibold text-[#068ec5] hover:underline"
              >
                Lihat Semua &rarr;
              </Link>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {berita.map((b) => (
                <Link
                  key={b.id}
                  href={`/berita/${b.id}`}
                  className="rounded-2xl border border-[#e2e8f0] bg-white p-6 transition-all hover:border-[#068ec5]/20 hover:shadow-md"
                >
                  <h3 className="text-base font-semibold leading-snug text-[#1a1a2e] line-clamp-2">
                    {b.headline}
                  </h3>
                  {b.author && (
                    <p className="mt-2 text-xs text-[#94a3b8]">
                      Oleh: {b.author?.masterData?.namaLengkap || ""}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
