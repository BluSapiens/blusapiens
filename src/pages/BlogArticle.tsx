import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  ChevronRight,
  Clock,
  Linkedin,
  Mail,
  Share2,
  Sparkles,
} from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import { fadeUp, heroChild, heroStagger, staggerContainer, viewport } from "@/lib/motion";
import { blogPosts, getPostBySlug, getRelatedPosts } from "@/lib/blog-data";

const ReadingProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed left-0 right-0 top-16 z-40 h-0.5 bg-border">
      <motion.div
        className="h-full bg-gradient-to-r from-accent to-cyan-300"
        style={{ width: `${progress}%` }}
        transition={{ duration: 0.05 }}
      />
    </div>
  );
};

const TableOfContents = ({ headings, activeIndex }: { headings: string[]; activeIndex: number }) => (
  <nav className="rounded-[1.5rem] border border-border/80 bg-card/90 p-5 shadow-[0_18px_50px_-40px_rgba(15,23,42,0.45)]">
    <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">On this page</p>
    <ul className="space-y-2">
      {headings.map((heading, index) => (
        <li key={heading}>
          <a
            href={`#section-${index}`}
            className={`block rounded-xl px-3 py-2 text-sm transition-colors duration-200 ${
              activeIndex === index
                ? "bg-accent/10 font-medium text-accent"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            {heading}
          </a>
        </li>
      ))}
    </ul>
  </nav>
);

const BlogArticle = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    if (!post) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            if (!Number.isNaN(index)) setActiveSection(index);
          }
        });
      },
      { rootMargin: "-100px 0px -60% 0px" }
    );

    post.headings.forEach((_, index) => {
      const element = document.getElementById(`section-${index}`);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [post]);

  const relatedPosts = useMemo(() => (post ? getRelatedPosts(post) : []), [post]);
  const currentIndex = post ? blogPosts.findIndex((item) => item.id === post.id) : -1;
  const prevPost = currentIndex > 0 ? blogPosts[currentIndex - 1] : null;
  const nextPost = currentIndex >= 0 && currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null;

  if (!post) {
    return (
      <PageLayout>
        <div className="container-narrow section-padding text-center">
          <h1 className="mb-4 text-2xl font-bold">Article not found</h1>
          <Link to="/blog" className="text-accent hover:underline">
            Back to Blog
          </Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <ReadingProgress />

      <section className="hero-bg relative overflow-hidden text-primary-foreground section-padding py-20 md:py-28">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
            backgroundSize: "34px 34px",
          }}
        />
        <div
          className="absolute right-[-8%] top-[-12%] h-72 w-72 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, hsl(var(--accent)), transparent 70%)" }}
        />

        <div className="container-narrow relative z-10 max-w-4xl">
          <motion.div variants={heroStagger} initial="hidden" animate="visible">
            <motion.div variants={heroChild} className="mb-6 flex items-center gap-2 text-xs text-primary-foreground/55">
              <Link to="/blog" className="transition-colors duration-200 hover:text-accent">
                Blog
              </Link>
              <ChevronRight size={12} />
              <span className="text-primary-foreground/75">{post.category}</span>
            </motion.div>

            <motion.div variants={heroChild} className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium">
              <Sparkles size={14} className="text-accent" />
              BluSapiens Journal
            </motion.div>
            <motion.span variants={heroChild} className="inline-flex rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-accent">
              {post.category}
            </motion.span>
            <motion.h1 variants={heroChild} className="mt-4 text-3xl font-extrabold leading-tight md:text-4xl lg:text-5xl">
              {post.title}
            </motion.h1>
            <motion.p variants={heroChild} className="mb-8 mt-4 max-w-3xl text-lg leading-relaxed opacity-70">
              {post.excerpt}
            </motion.p>

            <motion.div variants={heroChild} className="flex flex-wrap items-center gap-4 text-sm opacity-70">
              <span>{post.author.name}</span>
              <span>|</span>
              <span>
                {new Date(post.publishDate).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span>|</span>
              <span className="inline-flex items-center gap-1">
                <Clock size={14} />
                {post.readingTime}
              </span>
            </motion.div>

            <motion.div variants={heroChild} className="mt-8 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-primary-foreground/75">
                  #{tag}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-narrow">
          <div className="mb-8">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-accent"
            >
              <ArrowLeft size={16} />
              Back to Journal
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_260px]">
            <motion.article
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="relative rounded-[2rem] border border-border/80 bg-card/95 p-6 shadow-[0_24px_70px_-45px_rgba(15,23,42,0.55)] md:p-8 lg:p-10 overflow-hidden"
            >
              <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle_at_1px_1px,rgba(6,182,212,0.3)_1px,transparent_0)] bg-[length:20px_20px]" />
              <div className="relative z-10">
              <div className="mb-10 flex flex-wrap items-center justify-between gap-4 rounded-[1.5rem] border border-border/70 bg-gradient-to-r from-accent/5 via-secondary/40 to-primary/5 p-5 shadow-[0_8px_30px_-12px_rgba(6,182,212,0.15)]">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">Article snapshot</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Written for operators, founders, and teams shaping better digital systems.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-background px-3 py-1.5 shadow-sm">
                    <Clock size={12} />
                    {post.readingTime}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-background px-3 py-1.5 shadow-sm">
                    <Bookmark size={12} />
                    {post.category}
                  </span>
                </div>
              </div>

              <div className="article-content max-w-none prose prose-lg prose-slate dark:prose-invert mx-auto">
                {post.headings.map((heading, index) => (
                  <motion.div key={heading} variants={fadeUp} className="mb-12 group">
                    <div className="relative mb-6">
                      <h2 id={`section-${index}`} data-index={index} className="scroll-mt-24 text-2xl font-bold leading-tight text-foreground group-hover:text-accent transition-colors duration-200">
                        {heading}
                      </h2>
                      <div className="absolute -left-4 top-0 h-full w-1 bg-gradient-to-b from-accent/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    {post.body[index] ? (
                      <p className={`leading-relaxed text-muted-foreground ${index === 0 ? 'first-letter:text-5xl first-letter:font-bold first-letter:text-accent first-letter:float-left first-letter:mr-2 first-letter:mt-1' : ''}`}>
                        {post.body[index]}
                      </p>
                    ) : null}
                    {index < post.headings.length - 1 && (
                      <div className="mt-8 flex justify-center">
                        <div className="h-px w-16 bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
                      </div>
                    )}
                  </motion.div>
                ))}

                {post.body.slice(post.headings.length).map((paragraph, index) => (
                  <motion.p key={`extra-${index}`} variants={fadeUp} className="mb-6 leading-relaxed text-muted-foreground">
                    {paragraph}
                  </motion.p>
                ))}
              </div>

              {post.faqs && post.faqs.length > 0 ? (
                <motion.div variants={fadeUp} className="mt-12 border-t border-border pt-8">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-accent">
                      <Sparkles size={16} />
                    </div>
                    <h2 className="text-xl font-bold">Frequently Asked Questions</h2>
                  </div>
                  <div className="space-y-4">
                    {post.faqs.map((faq, index) => (
                      <motion.details key={faq.question} variants={fadeUp} className="group overflow-hidden rounded-[1.25rem] border border-border bg-gradient-to-r from-card to-secondary/20 shadow-sm transition-all duration-200 hover:shadow-md hover:border-accent/20">
                        <summary className="flex cursor-pointer items-center justify-between p-5 text-sm font-semibold transition-colors duration-200 hover:text-accent">
                          {faq.question}
                          <ChevronRight size={16} className="text-muted-foreground transition-transform duration-200 group-open:rotate-90" />
                        </summary>
                        <div className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{faq.answer}</div>
                      </motion.details>
                    ))}
                  </div>
                </motion.div>
              ) : null}

              <motion.div variants={fadeUp} className="mt-12 border-t border-border pt-8">
                <div className="rounded-[1.5rem] border border-border/80 bg-gradient-to-br from-secondary/35 via-card to-accent/5 p-6 shadow-[0_8px_30px_-12px_rgba(6,182,212,0.1)]">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">About the author</p>
                  <div className="mt-4 flex gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent/20 to-primary/20 text-accent shadow-sm">
                      <span className="text-sm font-bold">{post.author.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{post.author.name}</p>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{post.author.bio}</p>
                      {post.author.linkedin ? (
                        <a href={post.author.linkedin} className="mt-2 inline-flex items-center gap-1 text-xs text-accent hover:underline transition-colors duration-200">
                          <Linkedin size={12} />
                          LinkedIn
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              </motion.div>

              <div className="mt-12 grid grid-cols-1 gap-4 border-t border-border pt-8 sm:grid-cols-2">
                {prevPost ? (
                  <Link
                    to={`/blog/${prevPost.slug}`}
                    className="group rounded-[1.25rem] border border-border p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/30 hover:bg-secondary/40"
                  >
                    <span className="text-xs text-muted-foreground">Previous</span>
                    <p className="mt-1 line-clamp-2 text-sm font-semibold transition-colors duration-200 group-hover:text-accent">
                      {prevPost.title}
                    </p>
                  </Link>
                ) : (
                  <div />
                )}

                {nextPost ? (
                  <Link
                    to={`/blog/${nextPost.slug}`}
                    className="group rounded-[1.25rem] border border-border p-4 text-right transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/30 hover:bg-secondary/40"
                  >
                    <span className="text-xs text-muted-foreground">Next</span>
                    <p className="mt-1 line-clamp-2 text-sm font-semibold transition-colors duration-200 group-hover:text-accent">
                      {nextPost.title}
                    </p>
                  </Link>
                ) : null}
              </div>
              </div>
            </motion.article>

            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-5">
                <TableOfContents headings={post.headings} activeIndex={activeSection} />

                <div className="rounded-[1.5rem] border border-border/80 bg-primary p-5 text-primary-foreground shadow-[0_20px_60px_-40px_rgba(15,23,42,0.7)]">
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-accent">
                    <Mail size={18} />
                  </div>
                  <h3 className="text-lg font-bold">Want more like this?</h3>
                  <p className="mt-2 text-sm leading-relaxed text-primary-foreground/70">
                    Subscribe for practical updates on AI, systems, product, and growth.
                  </p>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="mt-4 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <button className="mt-3 w-full rounded-2xl bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-accent/20">
                    Subscribe
                  </button>
                </div>

                <div className="rounded-[1.5rem] border border-border/80 bg-card/90 p-5">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Share</p>
                  <button className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm text-foreground transition-colors duration-200 hover:bg-accent/10 hover:text-accent">
                    <Share2 size={14} />
                    Share article
                  </button>
                </div>
              </div>
            </aside>
          </div>

          {relatedPosts.length > 0 ? (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              className="mt-20 border-t border-border pt-12"
            >
              <motion.h2 variants={fadeUp} className="mb-8 text-2xl font-bold">
                Related Articles
              </motion.h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {relatedPosts.map((relatedPost) => (
                  <motion.div key={relatedPost.id} variants={fadeUp}>
                    <Link
                      to={`/blog/${relatedPost.slug}`}
                      className="group block rounded-[1.5rem] border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-[0_22px_70px_-38px_rgba(6,182,212,0.25)]"
                    >
                      <span className="inline-flex rounded-full bg-accent/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">
                        {relatedPost.category}
                      </span>
                      <h3 className="mt-3 line-clamp-2 font-bold transition-colors duration-200 group-hover:text-accent">
                        {relatedPost.title}
                      </h3>
                      <p className="mt-3 text-xs text-muted-foreground">{relatedPost.readingTime}</p>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : null}

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="mt-16 rounded-[2rem] border border-border/80 bg-secondary/35 p-8 text-center md:p-10"
          >
            <h3 className="mb-2 text-xl font-bold">Stay informed</h3>
            <p className="mx-auto mb-6 max-w-md text-sm text-muted-foreground">
              Get insights on AI, digital transformation, and technology strategy.
            </p>
            <div className="mx-auto flex max-w-sm flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 rounded-2xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button className="rounded-2xl bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-accent/20">
                Subscribe
              </button>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport} className="mt-12 text-center">
            <p className="mb-4 text-muted-foreground">Need help applying these ideas to your business?</p>
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 rounded-lg bg-accent px-7 py-3.5 text-sm font-semibold text-accent-foreground transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/20"
            >
              Talk to BluSapiens
              <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
};

export default BlogArticle;
