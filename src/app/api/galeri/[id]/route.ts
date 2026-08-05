import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dummy.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "dummy-key"
);

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || (session.role !== "admin" && session.role !== "guru")) {
    return NextResponse.json(
      { error: "Hanya Admin dan Guru yang dapat menghapus." },
      { status: 403 }
    );
  }

  const { id: idStr } = await params;
  const id = parseInt(idStr);

  const gallery = await prisma.gallery.findUnique({
    where: { id },
    select: { fotoUrl: true, uploaderId: true },
  });

  if (!gallery) {
    return NextResponse.json(
      { error: "Foto tidak ditemukan." },
      { status: 404 }
    );
  }

  if (session.role !== "admin" && gallery.uploaderId !== session.userId) {
    return NextResponse.json(
      { error: "Hanya uploader atau admin yang dapat menghapus." },
      { status: 403 }
    );
  }

  const filename = gallery.fotoUrl.split("/galeri/")[1];

  await supabase.storage.from("galeri").remove([filename]);

  await prisma.gallery.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
