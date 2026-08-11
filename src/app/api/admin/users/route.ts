import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      masterData: {
        select: {
          namaLengkap: true,
        },
      },
    },
  });

  return NextResponse.json(
    users.map((u) => ({
      id: u.id,
      masterDataId: u.masterDataId,
      nimNip: u.nimNip,
      role: u.role,
      unitSekolah: u.unitSekolah,
      passwordHash: u.password,
      lastLogin: u.lastLogin?.toISOString() || null,
      createdAt: u.createdAt.toISOString(),
      namaLengkap: u.masterData?.namaLengkap || ".",
    }))
  );
}
