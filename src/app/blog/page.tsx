import Link from "next/link";
import Image from "next/image";
import { MainLayout } from "@/components/layout/main-layout";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { BLOG_POSTS } from "@/lib/content/blog";
import { APP_NAME } from "@/lib/constants";

export const metadata = {
  title: "Blog",
  description: `Ghiduri, sfaturi și povești din comunitatea enduro/motocross ${APP_NAME}.`,
};

function formatBlogDate(iso: string) {
  return new Date(iso).toLocaleDateString("ro-RO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BlogPage() {
  return (
    <MainLayout>
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <Reveal className="text-center">
          <p className="text-sm font-medium uppercase tracking-[0.22em] text-primary">
            Blog
          </p>
          <h1 className="mt-2 font-heading text-4xl font-bold sm:text-5xl">
            Ghiduri și povești din off-road
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Sfaturi de echipament, destinații recomandate și noutăți din
            comunitatea {APP_NAME}.
          </p>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
          {BLOG_POSTS.map((post) => (
            <RevealItem key={post.slug} className="h-full">
              <Link href={`/blog/${post.slug}`} className="block h-full">
                <GlassCard
                  glow={post.accent}
                  className="glass-edge group h-full overflow-hidden transition-transform duration-300 hover:-translate-y-1"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                    <Badge variant="outline" className="absolute bottom-3 left-3">
                      {post.category}
                    </Badge>
                  </div>
                  <div className="p-5">
                    <h2 className="font-heading text-lg font-semibold leading-tight group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                      {post.excerpt}
                    </p>
                    <p className="mt-4 border-t border-white/5 pt-3 text-xs text-muted-foreground">
                      {post.author} · {formatBlogDate(post.publishedAt)}
                    </p>
                  </div>
                </GlassCard>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </MainLayout>
  );
}
