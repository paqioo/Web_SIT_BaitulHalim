import { prisma } from "@/lib/prisma";
import Hero from "@/components/landing/Hero";
import Welcome from "@/components/landing/Welcome";
import VisiMisi from "@/components/landing/VisiMisi";
import UnitSekolah from "@/components/landing/UnitSekolah";
import Fasilitas from "@/components/landing/Fasilitas";
import GaleriPreview from "@/components/landing/GaleriPreview";
import { BeritaPreview } from "@/components/landing/BeritaPreview";
import InstagramFeed from "@/components/landing/InstagramFeed";

export default async function Home() {
  const [welcomeData, visiData, misiData, fasilitas, galeri, berita] =
    await Promise.all([
      prisma.webContent.findUnique({ where: { key: "welcome_text" } }),
      prisma.webContent.findUnique({ where: { key: "visi" } }),
      prisma.webContent.findUnique({ where: { key: "misi" } }),
      prisma.fasilitas.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.gallery.findMany({
        take: 8,
        orderBy: { createdAt: "desc" },
        select: { id: true, judul: true, fotoUrl: true },
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

  const serializeBerita = berita.map((b) => ({
    id: b.id,
    headline: b.headline,
    publishedAt: b.publishedAt?.toISOString(),
    author: b.author
      ? { namaLengkap: b.author?.masterData?.namaLengkap || "" }
      : undefined,
    content: b.content,
  }));

  return (
    <>
      <Hero />
      <Welcome
        headline={welcomeData?.value ? "Selamat Datang" : undefined}
        text={welcomeData?.value}
      />
      <VisiMisi visi={visiData?.value} misi={misiData?.value} />
      <UnitSekolah />
      <Fasilitas
        items={fasilitas.map((f) => ({
          id: f.id,
          judul: f.judul,
          deskripsi: f.deskripsi,
        }))}
      />
      <GaleriPreview
        items={galeri.map((g) => ({
          id: g.id,
          judul: g.judul,
          fotoUrl: g.fotoUrl,
        }))}
      />
      <BeritaPreview items={serializeBerita} />
      <InstagramFeed />
    </>
  );
}
