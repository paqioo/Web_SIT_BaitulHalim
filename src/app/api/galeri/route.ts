import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const section = req.nextUrl.searchParams.get("section");

  const where = section ? { section } : {};

  const items = await prisma.gallery.findMany({
    where,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      judul: true,
      fotoUrl: true,
      caption: true,
      tanggal: true,
      section: true,
    },
  });

  return NextResponse.json(
    items.map((i) => ({
      ...i,
      tanggal: i.tanggal.toISOString(),
    }))
  );
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || (session.role !== "admin" && session.role !== "guru")) {
    return NextResponse.json(
      { error: "Hanya Admin dan Guru yang dapat mengupload." },
      { status: 403 }
    );
  }

  const formData = await req.formData();
  const file = formData.get("foto") as File | null;
  const judul = formData.get("judul") as string;
  const caption = (formData.get("caption") as string) || "";
  const section = formData.get("section") as string;
  const tanggalStr = formData.get("tanggal") as string;

  if (!file || !judul || !section) {
    return NextResponse.json(
      { error: "Judul, foto, dan section harus diisi." },
      { status: 400 }
    );
  }

  const ext = file.name.split(".").pop()?.toLowerCase();
  if (!ext || !["jpg", "jpeg", "png", "webp"].includes(ext)) {
    return NextResponse.json(
      { error: "Format file harus JPG/PNG/WEBP." },
      { status: 400 }
    );
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json(
      { error: "Ukuran file maksimal 5MB." },
      { status: 400 }
    );
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads", "galeri");
  await mkdir(uploadDir, { recursive: true });

  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const filepath = path.join(uploadDir, filename);
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filepath, buffer);

  const fotoUrl = `/uploads/galeri/${filename}`;
  const tanggal = tanggalStr ? new Date(tanggalStr) : new Date();

  await prisma.gallery.create({
    data: {
      judul,
      fotoUrl,
      caption,
      tanggal,
      section,
      uploaderId: session.userId,
    },
  });

  return NextResponse.json({ success: true, url: fotoUrl });
}
