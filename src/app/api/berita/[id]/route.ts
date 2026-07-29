import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const postId = parseInt(id);
  if (isNaN(postId)) {
    return NextResponse.json({ error: "ID tidak valid." }, { status: 400 });
  }

  const post = await prisma.postBerita.findUnique({
    where: { id: postId },
    include: { author: { include: { masterData: { select: { namaLengkap: true } } } } },
  });

  if (!post) {
    return NextResponse.json({ error: "Berita tidak ditemukan." }, { status: 404 });
  }

  return NextResponse.json({
    id: post.id,
    headline: post.headline,
    content: post.content,
    status: post.status,
    author: post.author?.masterData
      ? { namaLengkap: post.author.masterData.namaLengkap }
      : null,
    publishedAt: post.publishedAt?.toISOString() || null,
    createdAt: post.createdAt.toISOString(),
  });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const postId = parseInt(id);
  if (isNaN(postId)) {
    return NextResponse.json({ error: "ID tidak valid." }, { status: 400 });
  }

  const body = await req.json();

  const post = await prisma.postBerita.findUnique({ where: { id: postId } });
  if (!post) {
    return NextResponse.json({ error: "Berita tidak ditemukan." }, { status: 404 });
  }

  if (session.role !== "admin" && session.role !== "guru") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const updated = await prisma.postBerita.update({
    where: { id: postId },
    data: {
      headline: body.headline ?? post.headline,
      content: body.content ?? post.content,
      status: body.status ?? post.status,
      publishedAt:
        body.status === "Published" && !post.publishedAt
          ? new Date()
          : post.publishedAt,
    },
  });

  return NextResponse.json({ success: true, status: updated.status });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const postId = parseInt(id);

  const post = await prisma.postBerita.findUnique({ where: { id: postId } });
  if (!post) {
    return NextResponse.json({ error: "Berita tidak ditemukan." }, { status: 404 });
  }

  if (session.role !== "admin" && session.role !== "guru") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.postBerita.delete({ where: { id: postId } });
  return NextResponse.json({ success: true });
}
