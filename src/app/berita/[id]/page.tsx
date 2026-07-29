import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CalendarBlank, User } from "@phosphor-icons/react/dist/ssr";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function DetailBerita({ params }: Props) {
  const { id } = await params;
  const postId = parseInt(id);

  if (isNaN(postId)) notFound();

  const post = await prisma.postBerita.findUnique({
    where: { id: postId },
    include: { author: { include: { masterData: { select: { namaLengkap: true } } } } },
  });

  if (!post) notFound();

  return (
    <div className="min-h-[100dvh] pt-24">
      <div className="mx-auto max-w-[900px] px-6 pb-20 lg:px-8">
        <Link
          href="/berita"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-[#64748b] transition-colors hover:text-[#068ec5]"
        >
          <ArrowLeft size={16} weight="bold" />
          Kembali ke Berita
        </Link>

        <article>
          <div className="flex items-center gap-3 text-xs text-[#94a3b8]">
            {post.status !== "Published" && (
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-semibold text-amber-700">
                {post.status}
              </span>
            )}
            {post.publishedAt && (
              <>
                <CalendarBlank size={12} weight="fill" />
                <span>
                  {new Date(post.publishedAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </>
            )}
          </div>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#1a1a2e] md:text-4xl">
            {post.headline}
          </h1>

          {post.author && (
            <div className="mt-4 flex items-center gap-2 text-sm text-[#64748b]">
              <User size={14} weight="fill" />
              <span>{post.author.masterData?.namaLengkap || ""}</span>
            </div>
          )}

          <div
            className="prose prose-sm prose-headings:text-[#1a1a2e] prose-p:text-[#64748b] prose-a:text-[#068ec5] prose-img:rounded-2xl prose-img:border prose-img:border-[#e2e8f0] max-w-none mt-10 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </div>
    </div>
  );
}
