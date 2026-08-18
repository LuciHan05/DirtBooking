import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { MainLayout } from "@/components/layout/main-layout";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { BLOG_POSTS, getBlogPost } from "@/lib/content/blog";

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
  };
}

function formatBlogDate(iso: string) {
  return new Date(iso).toLocaleDateString("ro-RO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  return (
    <MainLayout>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Înapoi la blog
        </Link>

        <div className="mt-6">
          <Badge variant="outline">{post.category}</Badge>
          <h1 className="mt-3 font-heading text-3xl font-bold sm:text-4xl">
            {post.title}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {post.author} · {formatBlogDate(post.publishedAt)}
          </p>
        </div>

        <div className="relative mt-8 aspect-[21/9] overflow-hidden rounded-2xl">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>

        <GlassCard className="mt-8 space-y-4 p-6 sm:p-8">
          {post.content.map((paragraph, i) => (
            <p key={i} className="leading-relaxed text-muted-foreground">
              {paragraph}
            </p>
          ))}
        </GlassCard>

        <div className="mt-12">
          <h2 className="mb-4 font-heading text-lg font-semibold">
            Alte articole
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {BLOG_POSTS.filter((p) => p.slug !== post.slug)
              .slice(0, 2)
              .map((related) => (
                <Link key={related.slug} href={`/blog/${related.slug}`}>
                  <GlassCard className="h-full p-5 transition-colors hover:border-primary/30">
                    <p className="font-heading font-semibold hover:text-primary">
                      {related.title}
                    </p>
                    <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
                      {related.excerpt}
                    </p>
                  </GlassCard>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
