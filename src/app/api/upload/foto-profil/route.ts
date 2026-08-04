import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getSession, createToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("foto") as File | null;

  if (!file) {
    return NextResponse.json({ error: "File tidak ditemukan." }, { status: 400 });
  }

  const ext = file.name.split(".").pop()?.toLowerCase();
  if (!ext || !["jpg", "jpeg", "png"].includes(ext)) {
    return NextResponse.json(
      { error: "Format file harus JPG/PNG." },
      { status: 400 }
    );
  }

  if (file.size > 2 * 1024 * 1024) {
    return NextResponse.json(
      { error: "Ukuran file maksimal 2MB." },
      { status: 400 }
    );
  }

  const filename = `${session.userId}-${Date.now()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { data, error } = await supabase.storage
    .from("profil")
    .upload(filename, buffer, {
      contentType: file.type,
      upsert: true,
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: publicUrl } = supabase.storage
    .from("profil")
    .getPublicUrl(filename);

  const url = publicUrl.publicUrl;

  const user = await prisma.user.update({
    where: { id: session.userId },
    data: { fotoProfilUrl: url },
    include: { masterData: true },
  });

  const newToken = await createToken({
    userId: user.id,
    nimNip: user.nimNip,
    role: user.role,
    unitSekolah: user.unitSekolah,
    namaLengkap: user.masterData.namaLengkap,
    fotoProfilUrl: url,
  });

  const response = NextResponse.json({ success: true, url });
  response.cookies.set("token", newToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24,
    path: "/",
    sameSite: "lax",
  });

  return response;
}
