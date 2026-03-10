import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import PageLayout from "@/components/layout/PageLayout";
import { ArrowLeft, ArrowRight, Clock, ChevronRight, Linkedin, Mail, Share2 } from "lucide-react";
import { fadeUp, heroStagger, heroChild, staggerContainer, viewport } from "@/lib/motion";
import { getPostBySlug, getRelatedPosts, blogPosts, type BlogPost } from "@/lib/blog-data";

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
    <div className="fixed top-16 left-0 right-0 z-40 h-0.5 bg-border">
      <motion.div
        className="h-full bg-accent"
        style={{ width: `${progress}%` }}
        transition={{ duration: 0.05 }}
      />
    </div>
  );
};

const TableOfContents = ({ headings, activeIndex }: { headings: string[]; activeIndex: number }) => (
  <nav className="sticky top-24">
    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">On this page</p>
    <ul className="space-y-2">
      {headings.map((h, i) => (
        <li key={i}>
          <a
            href={`#section-${i}`}
            className={`block text-sm transition-colors duration-200 ${
              activeIndex === i ? "text-accent font-medium" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {h}
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
            const idx = Number(entry.target.getAttribute("data-index"));
            if (!isNaN(idx)) setActiveSection(idx);
          }
        });
      },
      { rootMargin: "-100px 0px -60% 0px" }
    );
    post.headings.forEach((_, i) => {
      const el = document.getElementById(`section-${i}`);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [post]);

  const relatedPosts = useMemo(() => post ? getRelatedPosts(post) : [], [post]);

  // Navigation
  const currentIndex = post ? blogPosts.findIndex(p => p.id === post.id) : -1;
  const prevPost = currentIndex > 0 ? blogPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null;

  if (!post) {
    return (
      <PageLayout>
        <div className="section-padding container-narrow text-center">
          <h1 className="text-2xl font-bold mb-4">Article not found</h1>
          <Link to="/blog" className="text-accent hover:underline">Back to Blog</Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <ReadingProgress />

      {/* Header */}
      <section className="hero-bg text-primary-foreground section-padding py-20 md:py-28">
        <div className="container-narrow max-w-3xl">
          <motion.div variants={heroStagger} initial="hidden" animate="visible">
            {/* Breadcrumb */}
            <motion.div variants={heroChild} className="flex items-center gap-2 text-xs text-primary-foreground/50 mb-6">
              <Link to="/blog" className="hover:text-accent transition-colors duration-200">Blog</Link>
              <ChevronRight size={12} />
              <span className="text-primary-foreground/70">{post.category}</span>
            </motion.div>

            <motion.span variants={heroChild} className="text-xs font-semibold text-accent uppercase tracking-wider">{post.category}</motion.span>
            <motion.h1 variants={heroChild} className="text-3xl md:text-4xl lg:text-5xl font-extrabold mt-2 mb-4 leading-tight">{post.title}</motion.h1>
            <motion.p variants={heroChild} className="text-lg opacity-70 mb-6">{post.excerpt}</motion.p>

            <motion.div variants={heroChild} className="flex flex-wrap items-center gap-4 text-sm opacity-60">
              <span>{post.author.name}</span>
              <span>·</span>
              <span>{new Date(post.publishDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
              <span>·</span>
              <span className="flex items-center gap-1"><Clock size={14} />{post.readingTime}</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding">
        <div className="container-narrow">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-12">
            {/* Article body */}
            <motion.article
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="max-w-none"
            >
              {post.headings.map((heading, i) => (
                <motion.div key={i} variants={fadeUp} className="mb-10">
                  <h2
                    id={`section-${i}`}
                    data-index={i}
                    className="text-xl md:text-2xl font-bold mb-4 scroll-mt-24"
                  >
                    {heading}
                  </h2>
                  {post.body[i] && (
                    <p className="text-muted-foreground leading-[1.8] text-[15px]">{post.body[i]}</p>
                  )}
                </motion.div>
              ))}

              {/* Remaining paragraphs */}
              {post.body.slice(post.headings.length).map((para, i) => (
                <motion.p key={`extra-${i}`} variants={fadeUp} className="text-muted-foreground leading-[1.8] text-[15px] mb-6">
                  {para}
                </motion.p>
              ))}

              {/* FAQ */}
              {post.faqs && post.faqs.length > 0 && (
                <motion.div variants={fadeUp} className="mt-12 pt-8 border-t border-border">
                  <h2 className="text-xl font-bold mb-6">Frequently Asked Questions</h2>
                  <div className="space-y-6">
                    {post.faqs.map((faq, i) => (
                      <details key={i} className="group rounded-lg border border-border bg-card overflow-hidden">
                        <summary className="flex items-center justify-between p-5 cursor-pointer text-sm font-semibold hover:text-accent transition-colors duration-200">
                          {faq.question}
                          <ChevronRight size={16} className="text-muted-foreground transition-transform duration-200 group-open:rotate-90" />
                        </summary>
                        <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </div>
                      </details>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Author */}
              <motion.div variants={fadeUp} className="mt-12 pt-8 border-t border-border">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-accent/10 text-accent flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-sm">{post.author.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{post.author.name}</p>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{post.author.bio}</p>
                    {post.author.linkedin && (
                      <a href={post.author.linkedin} className="inline-flex items-center gap-1 text-xs text-accent mt-2 hover:underline">
                        <Linkedin size={12} /> LinkedIn
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Prev/Next */}
              <div className="mt-12 pt-8 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-4">
                {prevPost ? (
                  <Link
                    to={`/blog/${prevPost.slug}`}
                    className="group rounded-lg border border-border p-4 transition-all duration-200 hover:border-accent/30"
                  >
                    <span className="text-xs text-muted-foreground">← Previous</span>
                    <p className="text-sm font-semibold mt-1 group-hover:text-accent transition-colors duration-200 line-clamp-2">{prevPost.title}</p>
                  </Link>
                ) : <div />}
                {nextPost && (
                  <Link
                    to={`/blog/${nextPost.slug}`}
                    className="group rounded-lg border border-border p-4 text-right transition-all duration-200 hover:border-accent/30"
                  >
                    <span className="text-xs text-muted-foreground">Next →</span>
                    <p className="text-sm font-semibold mt-1 group-hover:text-accent transition-colors duration-200 line-clamp-2">{nextPost.title}</p>
                  </Link>
                )}
              </div>
            </motion.article>

            {/* Sidebar (TOC) */}
            <aside className="hidden lg:block">
              <TableOfContents headings={post.headings} activeIndex={activeSection} />
            </aside>
          </div>

          {/* Related */}
          {relatedPosts.length > 0 && (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              className="mt-20 pt-12 border-t border-border"
            >
              <motion.h2 variants={fadeUp} className="text-2xl font-bold mb-8">Related Articles</motion.h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((rp) => (
                  <motion.div key={rp.id} variants={fadeUp}>
                    <Link
                      to={`/blog/${rp.slug}`}
                      className="group block rounded-xl border border-border bg-card p-6 transition-all duration-200 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 hover:-translate-y-1"
                    >
                      <span className="text-xs font-semibold text-accent uppercase tracking-wider">{rp.category}</span>
                      <h3 className="font-bold mt-2 mb-2 group-hover:text-accent transition-colors duration-200 line-clamp-2">{rp.title}</h3>
                      <p className="text-xs text-muted-foreground">{rp.readingTime}</p>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Newsletter + CTA */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="mt-16 rounded-xl border border-border bg-card p-8 md:p-10 text-center"
          >
            <h3 className="text-xl font-bold mb-2">Stay informed</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
              Get insights on AI, digital transformation, and technology strategy.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200"
              />
              <button className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-all duration-200 hover:shadow-md hover:shadow-accent/20">
                Subscribe
              </button>
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="mt-12 text-center"
          >
            <p className="text-muted-foreground mb-4">Need help applying these ideas to your business?</p>
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 rounded-lg bg-accent px-7 py-3.5 text-sm font-semibold text-accent-foreground transition-all duration-200 hover:shadow-lg hover:shadow-accent/20 hover:-translate-y-0.5"
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
