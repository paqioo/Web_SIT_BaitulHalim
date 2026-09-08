import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const section = req.nextUrl.searchParams.get("section");
  const where = section ? { section } : {};

  try {
    const items = await prisma.landingImage.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
    return NextResponse.json(items);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || (session.role !== "admin" && session.role !== "guru")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const section = formData.get("section") as string;
  const imageUrlParam = formData.get("imageUrl") as string | null;

  if (!section) {
    return NextResponse.json({ error: "Section harus diisi." }, { status: 400 });
  }

  let finalUrl = imageUrlParam || "";

  if (file) {
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!ext || !["jpg", "jpeg", "png", "webp", "svg"].includes(ext)) {
      return NextResponse.json(
        { error: "Format file harus JPG/PNG/WEBP/SVG." },
        { status: 400 }
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Ukuran file maksimal 10MB." },
        { status: 400 }
      );
    }

    const filename = `landing-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { data, error } = await supabase.storage
      .from("galeri")
      .upload(filename, buffer, { contentType: file.type });

    if (error) {
      return NextResponse.json({ error: `Upload gagal: ${error.message}` }, { status: 500 });
    }

    finalUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/galeri/${data.path}`;
  }

  if (!finalUrl) {
    return NextResponse.json({ error: "Foto atau URL gambar harus diisi." }, { status: 400 });
  }

  // Jika section hero/logo, replace/upsert
  if (section === "hero" || section === "logo") {
    await prisma.landingImage.deleteMany({ where: { section } });
  }

  const count = await prisma.landingImage.count({ where: { section } });

  const newItem = await prisma.landingImage.create({
    data: {
      section,
      imageUrl: finalUrl,
      sortOrder: count,
    },
  });

  return NextResponse.json(newItem);
}
