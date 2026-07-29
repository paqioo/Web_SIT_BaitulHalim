import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const itemId = parseInt(id);
  if (isNaN(itemId)) {
    return NextResponse.json({ error: "ID tidak valid." }, { status: 400 });
  }

  const item = await prisma.masterData.findUnique({
    where: { id: itemId },
    include: {
      user: {
        select: { fotoProfilUrl: true, lastLogin: true },
      },
    },
  });

  if (!item) {
    return NextResponse.json(
      { error: "Data tidak ditemukan." },
      { status: 404 }
    );
  }

  return NextResponse.json({
    id: item.id,
    namaLengkap: item.namaLengkap,
    nimNip: item.nimNip,
    role: item.role,
    unitSekolah: item.unitSekolah,
    status: item.status,
    hasAccount: !!item.user,
    lastLogin: item.user?.lastLogin?.toISOString() || null,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const itemId = parseInt(id);
  if (isNaN(itemId)) {
    return NextResponse.json({ error: "ID tidak valid." }, { status: 400 });
  }

  const body = await req.json();

  const existing = await prisma.masterData.findUnique({
    where: { id: itemId },
  });

  if (!existing) {
    return NextResponse.json(
      { error: "Data tidak ditemukan." },
      { status: 404 }
    );
  }

  if (body.nimNip && body.nimNip !== existing.nimNip) {
    const dup = await prisma.masterData.findUnique({
      where: { nimNip: body.nimNip },
    });
    if (dup) {
      return NextResponse.json(
        { error: "NIM/NIP sudah digunakan." },
        { status: 400 }
      );
    }
  }

  const updated = await prisma.masterData.update({
    where: { id: itemId },
    data: {
      namaLengkap: body.namaLengkap ?? existing.namaLengkap,
      nimNip: body.nimNip ?? existing.nimNip,
      role: body.role ?? existing.role,
      unitSekolah: body.unitSekolah ?? existing.unitSekolah,
    },
  });

  return NextResponse.json({
    id: updated.id,
    namaLengkap: updated.namaLengkap,
    nimNip: updated.nimNip,
    role: updated.role,
    unitSekolah: updated.unitSekolah,
    status: updated.status,
    updatedAt: updated.updatedAt.toISOString(),
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const itemId = parseInt(id);
  if (isNaN(itemId)) {
    return NextResponse.json({ error: "ID tidak valid." }, { status: 400 });
  }

  const existing = await prisma.masterData.findUnique({
    where: { id: itemId },
  });

  if (!existing) {
    return NextResponse.json(
      { error: "Data tidak ditemukan." },
      { status: 404 }
    );
  }

  await prisma.masterData.delete({ where: { id: itemId } });

  return NextResponse.json({ success: true });
}
