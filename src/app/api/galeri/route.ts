import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dummy.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "dummy-key"
);

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

  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { data, error } = await supabase.storage
    .from("galeri")
    .upload(filename, buffer, { contentType: file.type });

  if (error) {
    return NextResponse.json(
      { error: `Upload gagal: ${error.message}` },
      { status: 500 }
    );
  }

  const fotoUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/galeri/${data.path}`;
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
