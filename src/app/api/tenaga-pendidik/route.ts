import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const unit = req.nextUrl.searchParams.get("unit");
  const where = unit ? { unitId: unit } : {};
  const items = await prisma.tenagaPendidik.findMany({
    where,
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || (session.role !== "admin" && session.role !== "guru")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { fotoUrl, nama, jabatan, deskripsi, unitId, sortOrder } = await req.json();

  if (!nama || !jabatan || !unitId) {
    return NextResponse.json(
      { error: "Nama, jabatan, dan unit harus diisi." },
      { status: 400 }
    );
  }

  const item = await prisma.tenagaPendidik.create({
    data: { fotoUrl, nama, jabatan, deskripsi, unitId, sortOrder: sortOrder ?? 0 },
  });

  return NextResponse.json(item);
}