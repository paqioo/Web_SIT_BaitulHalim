import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const nimNip = req.nextUrl.searchParams.get("nim");

  if (!nimNip) {
    return NextResponse.json(
      { error: "NIM/NIP harus diisi." },
      { status: 400 }
    );
  }

  const masterData = await prisma.masterData.findUnique({
    where: { nimNip },
  });

  if (!masterData) {
    return NextResponse.json({ terdaftar: false });
  }

  const existingUser = await prisma.user.findUnique({
    where: { nimNip },
  });

  return NextResponse.json({
    terdaftar: true,
    status: masterData.status,
    role: masterData.role,
    sudahPunyaAkun: !!existingUser,
  });
}
