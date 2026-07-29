import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || (session.role !== "admin" && session.role !== "guru")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const itemId = parseInt(id);
  if (isNaN(itemId)) {
    return NextResponse.json({ error: "ID tidak valid." }, { status: 400 });
  }

  const body = await req.json();
  const existing = await prisma.tenagaPendidik.findUnique({ where: { id: itemId } });

  if (!existing) {
    return NextResponse.json(
      { error: "Data tidak ditemukan." },
      { status: 404 }
    );
  }

  const updated = await prisma.tenagaPendidik.update({
    where: { id: itemId },
    data: {
      nama: body.nama ?? existing.nama,
      jabatan: body.jabatan ?? existing.jabatan,
      deskripsi: body.deskripsi ?? existing.deskripsi,
      unitId: body.unitId ?? existing.unitId,
      fotoUrl: body.fotoUrl ?? existing.fotoUrl,
      sortOrder: body.sortOrder ?? existing.sortOrder,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || (session.role !== "admin" && session.role !== "guru")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const itemId = parseInt(id);

  const existing = await prisma.tenagaPendidik.findUnique({ where: { id: itemId } });
  if (!existing) {
    return NextResponse.json(
      { error: "Data tidak ditemukan." },
      { status: 404 }
    );
  }

  await prisma.tenagaPendidik.delete({ where: { id: itemId } });
  return NextResponse.json({ success: true });
}
