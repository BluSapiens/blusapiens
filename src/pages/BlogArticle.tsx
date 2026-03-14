import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, Clock } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import BlogBlockRenderer from "@/blog/components/BlogBlockRenderer";
import { getPublicBlogPost } from "@/blog/services/blog-api";
import { fadeUp, heroChild, heroStagger, staggerContainer, viewport } from "@/lib/motion";

function useSeoTags(title: string, description: string) {
  useEffect(() => {
    document.title = title;

    const ensureMeta = (name: string, attribute: "name" | "property") => {
      let element = document.head.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      return element;
    };

    ensureMeta("description", "name").content = description;
    ensureMeta("og:title", "property").content = title;
    ensureMeta("og:description", "property").content = description;
  }, [description, title]);
}

export default function BlogArticle() {
  const navigate = useNavigate();
  const { slug = "" } = useParams<{ slug: string }>();
  const [activeSection, setActiveSection] = useState("");

  const postQuery = useQuery({
    queryKey: ["public-blog-post", slug],
    queryFn: () => getPublicBlogPost(slug),
  });

  const post = postQuery.data?.post;
  useSeoTags(post?.seoTitle || post?.title || "Blog", post?.seoDescription || post?.excerpt || "");

  useEffect(() => {
    if (post && post.resolvedSlug !== slug) {
      navigate(`/blog/${post.resolvedSlug}`, { replace: true });
    }
  }, [navigate, post, slug]);

  useEffect(() => {
    if (!post?.toc.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -55% 0px" },
    );

    post.toc.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [post]);

  if (postQuery.isLoading) {
    return (
      <PageLayout>
        <div className="section-padding">
          <div className="container-narrow h-[60vh] animate-pulse rounded-3xl border border-border bg-card" />
        </div>
      </PageLayout>
    );
  }

  if (!post) {
    return (
      <PageLayout>
        <div className="section-padding container-narrow text-center">
          <h1 className="text-2xl font-bold">Article not found</h1>
          <Link to="/blog" className="mt-4 inline-block text-accent">
            Back to Blog
          </Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <section className="hero-bg section-padding py-20 text-primary-foreground md:py-28">
        <div className="container-narrow max-w-3xl">
          <motion.div variants={heroStagger} initial="hidden" animate="visible">
            <motion.div variants={heroChild} className="mb-6 flex items-center gap-2 text-xs text-primary-foreground/60">
              <Link to="/blog">Blog</Link>
              <ChevronRight size={12} />
              <span>{post.category}</span>
            </motion.div>
            <motion.p variants={heroChild} className="text-xs font-semibold uppercase tracking-wider text-accent">
              {post.category}
            </motion.p>
            <motion.h1 variants={heroChild} className="mt-2 text-3xl font-extrabold leading-tight md:text-5xl">
              {post.title}
            </motion.h1>
            <motion.p variants={heroChild} className="mt-4 text-lg text-primary-foreground/70">
              {post.excerpt}
            </motion.p>
            <motion.div variants={heroChild} className="mt-6 flex flex-wrap items-center gap-4 text-sm text-primary-foreground/65">
              <span>{post.author}</span>
              <span>{post.publishDate ? new Date(post.publishDate).toLocaleDateString("en-US") : "Unscheduled"}</span>
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {post.readingTime}
              </span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-narrow">
          {post.cover ? (
            <img
              src={post.cover.optimizedUrl || post.cover.url}
              alt={post.coverAlt || post.cover.alt || ""}
              className="mb-10 h-auto w-full rounded-3xl object-cover"
            />
          ) : null}

          <div className="grid gap-12 lg:grid-cols-[1fr_240px]">
            <motion.article variants={staggerContainer} initial="hidden" animate="visible" className="space-y-8">
              {post.blocks.map((block) => (
                <motion.div key={block.id} variants={fadeUp}>
                  <BlogBlockRenderer block={block} />
                </motion.div>
              ))}

              {post.faqs.length > 0 ? (
                <motion.section variants={fadeUp} className="rounded-3xl border border-border bg-card p-6">
                  <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>
                  <div className="mt-5 space-y-4">
                    {post.faqs.map((faq) => (
                      <details key={`${faq.question}-${faq.order}`} className="rounded-2xl border border-border bg-background px-4 py-4">
                        <summary className="cursor-pointer text-sm font-semibold">{faq.question}</summary>
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{faq.answer}</p>
                      </details>
                    ))}
                  </div>
                </motion.section>
              ) : null}

              <motion.section variants={fadeUp} className="rounded-3xl border border-border bg-card p-6">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <span className="font-bold">{post.author.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-semibold">{post.author}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      Article author
                    </p>
                  </div>
                </div>
              </motion.section>
            </motion.article>

            <aside className="hidden lg:block">
              <div className="sticky top-24 rounded-3xl border border-border bg-card p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">On this page</p>
                <div className="mt-4 space-y-2">
                  {post.toc.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className={`block text-sm ${activeSection === item.id ? "font-semibold text-accent" : "text-muted-foreground"}`}
                    >
                      {item.text}
                    </a>
                  ))}
                </div>
              </div>
            </aside>
          </div>

          {postQuery.data?.related.length ? (
            <motion.section variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewport} className="mt-20 border-t border-border pt-12">
              <motion.h2 variants={fadeUp} className="mb-8 text-2xl font-bold">Related Articles</motion.h2>
              <div className="grid gap-6 md:grid-cols-3">
                {postQuery.data.related.map((related) => (
                  <motion.div key={related.id} variants={fadeUp}>
                    <Link
                      to={`/blog/${related.slug}`}
                      className="block rounded-xl border border-border bg-card p-6 transition hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5"
                    >
                      <span className="text-xs font-semibold uppercase tracking-wider text-accent">{related.category}</span>
                      <h3 className="mt-2 font-bold transition-colors hover:text-accent">{related.title}</h3>
                      <p className="mt-2 text-xs text-muted-foreground">{related.readingTime}</p>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          ) : null}

          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport} className="mt-12 text-center">
            <p className="mb-4 text-muted-foreground">Need help applying these ideas to your business?</p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-7 py-3.5 text-sm font-semibold text-accent-foreground"
            >
              Talk to BluSapiens <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
