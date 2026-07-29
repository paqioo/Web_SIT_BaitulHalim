import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const items = await prisma.masterData.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { fotoProfilUrl: true, lastLogin: true },
      },
    },
  });

  return NextResponse.json(
    items.map((i) => ({
      id: i.id,
      namaLengkap: i.namaLengkap,
      nimNip: i.nimNip,
      role: i.role,
      unitSekolah: i.unitSekolah,
      status: i.status,
      hasAccount: !!i.user,
      lastLogin: i.user?.lastLogin?.toISOString() || null,
      createdAt: i.createdAt.toISOString(),
      updatedAt: i.updatedAt.toISOString(),
    }))
  );
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { nimNip, role, unitSekolah } = await req.json();

  if (!nimNip || !role || !unitSekolah) {
    return NextResponse.json(
      { error: "NIM/NIP, role, dan unit harus diisi." },
      { status: 400 }
    );
  }

  const validRoles = ["admin", "guru", "murid"];
  if (!validRoles.includes(role)) {
    return NextResponse.json({ error: "Role tidak valid." }, { status: 400 });
  }

  const validUnits = ["TKIT", "SDIT", "SMPIT"];
  if (!validUnits.includes(unitSekolah)) {
    return NextResponse.json({ error: "Unit tidak valid." }, { status: 400 });
  }

  const existing = await prisma.masterData.findUnique({
    where: { nimNip },
  });

  if (existing) {
    return NextResponse.json(
      { error: "NIM/NIP sudah terdaftar." },
      { status: 400 }
    );
  }

  const item = await prisma.masterData.create({
    data: {
      nimNip,
      role,
      unitSekolah,
      status: "Belum Aktif",
    },
  });

  return NextResponse.json({
    id: item.id,
    namaLengkap: item.namaLengkap,
    nimNip: item.nimNip,
    role: item.role,
    unitSekolah: item.unitSekolah,
    status: item.status,
    createdAt: item.createdAt.toISOString(),
  });
}
