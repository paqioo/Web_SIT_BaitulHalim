import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const items = await prisma.webContent.findMany();
  const result: Record<string, string> = {};
  items.forEach((item) => (result[item.key] = item.value));
  return NextResponse.json(result);
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session || (session.role !== "admin" && session.role !== "guru")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { key, value } = await req.json();
  if (!key || value === undefined) {
    return NextResponse.json({ error: "Key dan value harus diisi." }, { status: 400 });
  }

  await prisma.webContent.upsert({
    where: { key },
    update: { value, updatedBy: session.userId },
    create: { key, value, updatedBy: session.userId },
  });

  return NextResponse.json({ success: true });
}
