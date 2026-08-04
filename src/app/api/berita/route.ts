import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "9");
  const sort = searchParams.get("sort") || "terbaru";
  const search = searchParams.get("search") || "";
  const authorId = searchParams.get("author") || "";

  const where: Record<string, unknown> = {
    section: "SIT",
  };

  if (authorId) {
    where.authorId = parseInt(authorId);
  } else {
    where.status = "Published";
  }

  if (search) {
    where.OR = [
      { headline: { contains: search } },
      { content: { contains: search } },
    ];
  }

  const orderBy = sort === "terlama" ? { publishedAt: "asc" as const } : { publishedAt: "desc" as const };

  const [items, total] = await Promise.all([
    prisma.postBerita.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: { author: { include: { masterData: { select: { namaLengkap: true } } } } },
    }),
    prisma.postBerita.count({ where }),
  ]);

  return NextResponse.json({
    items: items.map((i) => ({
      id: i.id,
      headline: i.headline,
      content: i.content.substring(0, 200),
      status: i.status,
      author: i.author?.masterData
        ? { namaLengkap: i.author.masterData.namaLengkap }
        : null,
      publishedAt: i.publishedAt?.toISOString() || null,
    })),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { headline, content } = await req.json();

  if (!headline || !content) {
    return NextResponse.json(
      { error: "Headline dan konten harus diisi." },
      { status: 400 }
    );
  }

  const isAutoPublish = session.role === "admin" || session.role === "guru";

  const post = await prisma.postBerita.create({
    data: {
      headline,
      content,
      section: "SIT",
      authorId: session.userId,
      status: isAutoPublish ? "Published" : "Pending Review",
      publishedAt: isAutoPublish ? new Date() : null,
    },
  });

  return NextResponse.json({
    id: post.id,
    status: post.status,
  });
}
