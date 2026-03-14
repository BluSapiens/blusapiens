import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Mail, Search } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import { getPublicBlogCats, getPublicBlogPosts } from "@/blog/services/blog-api";
import type { PublicBlogPostSummary } from "@/blog/utils/types";
import { fadeUp, heroChild, heroStagger, staggerContainer, viewport } from "@/lib/motion";

const BlogCard = ({ post, featured = false }: { post: PublicBlogPostSummary; featured?: boolean }) => {
  if (featured) {
    return (
      <motion.div variants={fadeUp}>
        <Link
          to={`/blog/${post.slug}`}
          className="group block overflow-hidden rounded-xl border border-border bg-card transition-all duration-200 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="aspect-[16/10] bg-gradient-to-br from-accent/10 to-accent/5">
              {post.cover ? (
                <img
                  src={post.cover.optimizedUrl || post.cover.url}
                  alt={post.coverAlt || post.cover.alt || ""}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <span className="text-5xl font-bold text-accent">{post.title.charAt(0)}</span>
                </div>
              )}
            </div>
            <div className="p-8 lg:p-10">
              <span className="text-xs font-semibold uppercase tracking-wider text-accent">{post.category}</span>
              <h2 className="mt-2 text-2xl font-bold transition-colors duration-200 group-hover:text-accent lg:text-3xl">
                {post.title}
              </h2>
              <p className="mt-3 text-muted-foreground">{post.excerpt}</p>
              <div className="mt-5 flex items-center gap-4 text-xs text-muted-foreground">
                <span>{post.publishDate ? new Date(post.publishDate).toLocaleDateString("en-US") : "Unscheduled"}</span>
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {post.readingTime}
                </span>
              </div>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent">
                Read Article <ArrowRight size={14} />
              </span>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div variants={fadeUp}>
      <Link
        to={`/blog/${post.slug}`}
        className="group flex h-full flex-col rounded-xl border border-border bg-card p-6 transition-all duration-200 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 hover:-translate-y-1"
      >
        <span className="text-xs font-semibold uppercase tracking-wider text-accent">{post.category}</span>
        <h3 className="mt-2 text-lg font-bold leading-snug transition-colors duration-200 group-hover:text-accent">
          {post.title}
        </h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>
        <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
          <span>{post.publishDate ? new Date(post.publishDate).toLocaleDateString("en-US") : "Unscheduled"}</span>
          <span className="flex items-center gap-1">
            <Clock size={11} />
            {post.readingTime}
          </span>
        </div>
      </Link>
    </motion.div>
  );
};

export default function Blog() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("");

  const catsQuery = useQuery({
    queryKey: ["public-blog-cats"],
    queryFn: getPublicBlogCats,
    staleTime: 60_000,
  });

  const postsQuery = useQuery({
    queryKey: ["public-blog-posts", query, activeCategory],
    queryFn: () => getPublicBlogPosts({ q: query, cat: activeCategory }),
  });

  const featured = postsQuery.data?.featured || null;
  const posts = postsQuery.data?.items || [];

  return (
    <PageLayout>
      <section className="hero-bg section-padding py-24 text-primary-foreground md:py-32">
        <div className="container-narrow text-center">
          <motion.div variants={heroStagger} initial="hidden" animate="visible">
            <motion.p variants={heroChild} className="mb-3 text-sm font-semibold uppercase tracking-wider text-accent">
              Journal
            </motion.p>
            <motion.h1 variants={heroChild} className="text-4xl font-extrabold md:text-5xl">
              Insights & Ideas
            </motion.h1>
            <motion.p variants={heroChild} className="mx-auto mt-6 max-w-2xl text-lg opacity-70">
              Practical thinking on AI, digital transformation, automation, product strategy, and modern technology from the BluSapiens team.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-narrow">
          <div className="mb-8">
            <div className="relative max-w-md">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search articles..."
                className="w-full rounded-lg border border-input bg-card py-2.5 pl-10 pr-4 text-sm"
              />
            </div>
          </div>

          <div className="mb-12 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveCategory("")}
              className={`rounded-full px-4 py-2 text-xs font-medium ${!activeCategory ? "bg-accent text-accent-foreground" : "bg-secondary text-secondary-foreground"}`}
            >
              All
            </button>
            {(catsQuery.data || []).map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.slug)}
                className={`rounded-full px-4 py-2 text-xs font-medium ${activeCategory === cat.slug ? "bg-accent text-accent-foreground" : "bg-secondary text-secondary-foreground"}`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {featured ? (
            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewport} className="mb-12">
              <BlogCard post={featured} featured />
            </motion.div>
          ) : null}

          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport} className="mt-20 rounded-xl border border-border bg-card p-8 text-center md:p-10">
            <Mail size={24} className="mx-auto mb-4 text-accent" />
            <h3 className="text-xl font-bold">Stay informed</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Get the latest insights on AI, digital transformation, and technology strategy delivered to your inbox.
            </p>
            <div className="mx-auto mt-6 flex max-w-sm flex-col gap-3 sm:flex-row">
              <input type="email" placeholder="your@email.com" className="flex-1 rounded-lg border border-input bg-background px-4 py-2.5 text-sm" />
              <button className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
