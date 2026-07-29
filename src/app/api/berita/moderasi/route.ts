import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session || (session.role !== "admin" && session.role !== "guru")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const items = await prisma.postBerita.findMany({
    where: { status: "Pending Review" },
    orderBy: { createdAt: "desc" },
    include: { author: { include: { masterData: { select: { namaLengkap: true } } } } },
  });

  return NextResponse.json(
    items.map((i) => ({
      id: i.id,
      headline: i.headline,
      author: i.author?.masterData
        ? { namaLengkap: i.author.masterData.namaLengkap }
        : null,
      createdAt: i.createdAt.toISOString(),
    }))
  );
}
